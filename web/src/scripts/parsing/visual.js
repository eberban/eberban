import dictionary from '../../../../dictionary/en.yaml';
import * as parser from "../../grammar/eberban.peggy.js";
import { GrammarError } from "peggy";

// ============================================================
// Entry point
// ============================================================

export function parse() {
    var input = $('#input_textarea').val();
    $('#result-row').slideDown();

    try {
        var result = parser.parse(input, { grammarSource: "form" });
        $('#parse-result-raw').html(`<pre>${JSON.stringify(result, null, 4)}</pre>`);
        $('#parse-result-boxes').html(renderText(result));
        $('#parser_error_box').hide();

        if (result?.warnings != undefined) {
            var warnings = "";
            for (var warn of result.warnings) {
                var err = new GrammarError(warn.message, warn.location);
                err.problems[0][0] = "warning";
                warnings += err.format([{ source: 'form', text: input }]);
                warnings += "\n\n";
            }
            result.warnings = undefined;
            $('#parse_warnings').text(warnings);
            $('#parser_warnings_box').show();
        } else {
            $('#parser_warnings_box').hide();
        }
    } catch (e) {
        var err_message = typeof e.format === "function"
            ? e.format([{ source: 'form', text: input }])
            : e.toString();
        $('#parse_error').text(err_message);
        $('#parser_error_box').show();
    }
}

// ============================================================
// Top-level rendering
// ============================================================

function renderText(output) {
    if (!output?.paragraphs) return "";
    let html = "";
    for (let para of output.paragraphs) {
        let inner = "";
        if (para.starter) inner += wordBox(para.starter, "vbox-bg-dark");
        for (let s of para.sentences) inner += renderSentence(s);
        html += `<div class="vbox-paragraph">${inner}</div>`;
    }
    return html;
}

function renderSentence(sentence) {
    let chain = sentence.definition?.chain || sentence.definition;
    if (!chain && sentence.pred) chain = { verb: sentence.pred };

    let items = collectChainItems(chain, sentence.starter, sentence.defined, "");
    return `<div class="vbox-sentence"><div class="vbox-chain">${renderGrid(items)}</div></div>`;
}

// ============================================================
// Collect items: walk parse tree → flat list of grid items
// ============================================================

// Each item: { type: "word"|"group"|"nested", barColor, exposed, chainPlace, ... }

function collectChainItems(chain, starter, defined, barColor) {
    if (!chain) return [];
    let items = [];

    if (starter) items.push(wordItem(starter, barColor));
    if (defined) items.push(wordItem(defined, barColor));

    let steps = flattenChain(chain);
    stepsToItems(steps, barColor, items);

    // Last item never shows chainPlace
    if (items.length > 0) items[items.length - 1].chainPlace = "";
    return items;
}

function stepsToItems(steps, barColor, items) {
    let slots = getSlotInfo(steps);

    for (let i = 0; i < steps.length; i++) {
        let step = steps[i];
        let { exposed, chainPlace } = slots[i];
        let isLast = i === steps.length - 1;

        // Extract ZI/SI prefixes
        let prefixes = extractPrefixes(step);
        let verb = stripModifiers(step.verb);

        if (prefixes.length > 0) {
            items.push({ type: "group", prefixes, verb, barColor, exposed, chainPlace });
        } else {
            items.push({ type: "word", node: verb, color: getWordColor(verb), barColor, exposed, chainPlace });
        }

        // Explicit binds
        if (step.explicit_binds) {
            if (!isLast || step.explicit_binds.binds.length > 1) {
                items.push({ type: "nested", bindGroup: step.explicit_binds, barColor });
            } else {
                collectBindItems(step.explicit_binds, items);
            }
        }
    }
}

function collectBindItems(bindGroup, items) {
    let adverb = isAdverbBind(bindGroup);
    let barColor = adverb ? "vbox-bar-orange" : "vbox-bar-pink";
    let wordColor = adverb ? "vbox-bg-orange" : "vbox-bg-pink";

    for (let bind of bindGroup.binds) {
        items.push({ type: "word", node: bind.start, color: wordColor, barColor, exposed: "", chainPlace: "" });
        stepsToItems(flattenChain(bind.inner?.chain || bind.inner), barColor, items);
    }

    if (bindGroup.end) {
        let color = bindGroup.end.elided ? `${wordColor} vbox-elided` : wordColor;
        items.push({ type: "word", node: bindGroup.end, color, barColor, exposed: "", chainPlace: "" });
    }
}

// ============================================================
// Render grid from items
// ============================================================

function renderGrid(items) {
    let html = "";
    for (let item of items) {
        html += barCell(item.barColor, item.exposed, item.chainPlace);

        if (item.type === "word") {
            html += renderVerbContent(item.node, item.color);
        } else if (item.type === "group") {
            html += renderGroup(item.prefixes, item.verb);
        } else if (item.type === "nested") {
            html += renderNestedBind(item.bindGroup);
        }
    }
    return html;
}

function barCell(barColor, exposed, chainPlace) {
    let content = "";
    if (exposed) content += `<span class="vbox-bar-exposed">${exposed}</span>`;
    if (chainPlace) content += `<span class="vbox-bar-chain-place">${chainPlace}</span>`;
    return `<div class="vbox-bar ${barColor}">${content}</div>`;
}

// ============================================================
// Content renderers (row 2 of grid)
// ============================================================

function renderVerbContent(verb, color) {
    if (!verb) return `<div class="vbox-word ${color}"></div>`;
    if (verb.family === "Compound") return renderCompound(verb);
    return wordBox(verb, color);
}

function renderGroup(prefixes, verb) {
    let html = "";
    for (let p of prefixes) html += wordBox(p, getWordColor(p));
    html += renderVerbContent(verb, getWordColor(verb));
    return `<div class="vbox-pair">${html}</div>`;
}

function renderNestedBind(bindGroup) {
    let innerItems = [];
    collectBindItems(bindGroup, innerItems);

    if (innerItems.length > 0) innerItems[innerItems.length - 1].chainPlace = "";

    return `<div class="vbox-bind-group"><div class="vbox-chain">${renderGrid(innerItems)}</div></div>`;
}

function renderCompound(verb) {
    let fullWord = verb.prefix + verb.content.map(c => c.word).join("");
    let gloss = lookupGloss(fullWord);

    let parts = verb.content.map(part =>
        `<div class="vbox-compound-part">`
        + `<span class="vbox-compound-part-word">${esc(part.word)}</span>`
        + `<span class="vbox-compound-part-gloss">${esc(lookupGloss(part.word))}</span>`
        + `</div>`
    ).join("");

    return `<div class="vbox-compound">`
        + `<span class="vbox-word-text">${esc(fullWord)}</span>`
        + `<span class="vbox-word-gloss">${esc(gloss)}</span>`
        + `<div class="vbox-compound-parts">${parts}</div>`
        + `<span class="vbox-word-family">COMPOUND</span>`
        + `</div>`;
}

function wordBox(node, color) {
    if (!node) return "";
    let word = getWordText(node);
    let gloss = lookupGloss(word);
    let family = getDisplayFamily(node);
    let elided = node.elided ? " vbox-elided" : "";

    return `<div class="vbox-word ${color}${elided}">`
        + `<span class="vbox-word-text">${esc(word)}</span>`
        + `<span class="vbox-word-gloss">${esc(gloss)}</span>`
        + `<span class="vbox-word-family">${esc(family)}</span>`
        + `</div>`;
}

// ============================================================
// Slot info computation
// ============================================================

function getSlotInfo(steps) {
    return steps.map(step => {
        if (step.select) {
            let label = getSILabel(step.select);
            let vowels = label.replace(/[^EAOU]/gi, "");
            return { exposed: label, chainPlace: vowels[vowels.length - 1] || "E" };
        }
        let trans = getTransitivity(step.verb);
        return { exposed: trans ? "E A" : "E", chainPlace: trans ? "A" : "E" };
    });
}

function getSILabel(select) {
    let entry = dictionary[select.word];
    return entry?.gloss ? entry.gloss.replace(/[<>]/g, "").trim() : "SI";
}

function getTransitivity(verb) {
    if (!verb) return false;

    if (verb.family === "Compound")
        return getTransitivity(verb.content[verb.content.length - 1]);

    if (verb.family === "Root" || verb.family === "Particle") {
        let last = verb.word?.[verb.word.length - 1];
        return last ? "ieaou".includes(last) : false;
    }

    if (verb.family === "MI")
        return dictionary[verb.word]?.transitive || false;

    if (verb.family === "GI")
        return !verb.word?.startsWith("gi");

    if (verb.start?.family === "PE")
        return dictionary[verb.start.word]?.transitive ?? true;

    return false; // KI, Number, Quote, Borrowing, FFVariable
}

// ============================================================
// Helpers
// ============================================================

function flattenChain(chain) {
    let steps = [];
    let cur = chain;
    while (cur) { steps.push(cur); cur = cur.next; }
    return steps;
}

function extractPrefixes(step) {
    let prefixes = [];
    if (step.verb?.modifiers) {
        let mods = Array.isArray(step.verb.modifiers) ? step.verb.modifiers : [step.verb.modifiers];
        for (let m of mods) {
            prefixes.push(m.modifier);
            if (m.select) prefixes.push(m.select);
        }
    }
    if (step.select) prefixes.push(step.select);
    return prefixes;
}

function stripModifiers(verb) {
    if (!verb?.modifiers) return verb;
    let { modifiers, ...rest } = verb;
    return rest;
}

function wordItem(node, barColor) {
    return { type: "word", node, color: getWordColor(node), barColor, exposed: "", chainPlace: "" };
}

function isAdverbBind(bindGroup) {
    return bindGroup.binds.some(b => b.start?.family === "VOI" || b.start?.family === "FOI");
}

function getWordText(node) {
    if (node.word) return node.word;
    if (node.family === "Compound") return node.prefix + node.content.map(c => c.word).join("");
    if (node.family === "FFVariable") return "i" + node.content;
    if (node.family === "Borrowing") return "u" + node.content;
    if (node.kind === "BorrowingGroup") return node.group.map(b => "u" + b.content).join(" ");
    if (node.kind === "Number") return formatNumber(node.value);
    if (node.kind === "SingleWordQuote") return node.start.word + " " + (node.word?.word || "?");
    if (node.kind === "InlineAssignment") return node.start.word + " " + getWordText(node.verb);
    return "?";
}

function formatNumber(value) {
    let parts = [];
    if (value.int) parts.push(fmtDigits(value.int));
    if (value.base) parts.push(value.base.sep.word + " " + fmtDigits(value.base.value));
    if (value.fract) parts.push(value.fract.sep.word + " " + fmtDigits(value.fract.value));
    if (value.repeat) parts.push(value.repeat.sep.word + " " + fmtDigits(value.repeat.value));
    if (value.magn) parts.push(value.magn.sep.word + " " + fmtDigits(value.magn.value));
    if (value.end && !value.end.elided) parts.push(value.end.word);
    return parts.join(" ");
}

function fmtDigits(digits) {
    return digits ? digits.map(d => d.word || d.symbol || "?").join(" ") : "";
}

function lookupGloss(word) {
    return word ? (dictionary[word]?.gloss || "") : "";
}

function getWordColor(node) {
    let f = node?.family;
    if (f === "VE" || f === "VEI" || f === "FI" || f === "VOI" || f === "FOI" || f === "ZI" || f === "BI" || f === "BO") return "vbox-bg-pink";
    if (f === "SI") return "vbox-bg-yellow";
    if (f === "A" || f === "O" || f === "NI" || f === "NU" || f === "PO") return "vbox-bg-dark";
    if (f === "Compound" || f === "Borrowing" || f === "FFVariable" || f === "PE" || f === "PEI" || f === "BU") return "vbox-bg-purple";
    return "vbox-bg-blue";
}

function getDisplayFamily(node) {
    let f = node?.family;
    if (f === "Root") return "ROOT";
    if (f === "Compound") return "COMP";
    if (f === "Borrowing") return "BORR";
    if (f === "FFVariable") return "VAR";
    return f || "";
}

function esc(text) {
    if (!text) return "";
    return String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
