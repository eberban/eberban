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
        if (para.starter) inner += wordBox(para.starter, "vbox-sentence-bg");
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

    // Sentence terminator
    items.push({ type: "terminator", barColor });
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
    for (let bind of bindGroup.binds) {
        let adverb = isAdverbStart(bind.start);
        let barColor = adverb ? "vbox-bar-adverb" : "vbox-bar-bind";
        let wordColor = adverb ? "vbox-adverb" : "vbox-bind";

        items.push({ type: "word", node: bind.start, color: wordColor, barColor, exposed: "", chainPlace: "" });
        stepsToItems(flattenChain(bind.inner?.chain || bind.inner), barColor, items);
    }

    if (bindGroup.end) {
        let color = bindGroup.end.elided ? "vbox-bind vbox-elided" : "vbox-bind";
        items.push({ type: "word", node: bindGroup.end, color, barColor: "vbox-bar-bind", exposed: "", chainPlace: "" });
    }
}

// ============================================================
// Render grid from items
// ============================================================

function renderGrid(items) {
    let html = "";
    for (let i = 0; i < items.length; i++) {
        let item = items[i];
        let isFirst = i === 0;
        let isLast = i === items.length - 1;
        // For bar border: last bar is the item before the terminator (or last item if no terminator)
        let nextIsTerminator = i + 1 < items.length && items[i + 1].type === "terminator";
        let isLastBar = isLast || nextIsTerminator;
        let extra = (isFirst ? "vbox-first" : "") + (isLast ? " vbox-last" : "");
        extra = extra.trim();

        // Bar extra classes
        let barExtra = "";
        if (isFirst) barExtra += "vbox-bar-first ";
        if (item.type === "terminator") {
            barExtra += "vbox-bar-last";
        } else if (nextIsTerminator || isLast) {
            barExtra += "vbox-bar-noborder";
        }

        if (item.type === "terminator") {
            html += barCell(item.barColor, "", "", barExtra);
            html += `<div class="vbox-terminator vbox-sentence-bg ${extra}">`
                + `<span class="vbox-word-text" style="visibility:hidden">x</span>`
                + `<span class="vbox-word-gloss" style="visibility:hidden">x</span>`
                + `<span class="vbox-word-family" style="visibility:hidden">x</span>`
                + `</div>`;
        } else {
            html += barCell(item.barColor, item.exposed, item.chainPlace, barExtra);

            if (item.type === "word") {
                html += renderVerbContent(item.node, item.color, extra);
            } else if (item.type === "group") {
                html += renderGroup(item.prefixes, item.verb, extra);
            } else if (item.type === "nested") {
                html += renderNestedBind(item.bindGroup, extra);
            } else if (item.type === "enum-sep") {
                html += `<div class="vbox-terminator ${item.color || ""} ${extra}">`
                    + `<span class="vbox-word-text" style="visibility:hidden">x</span>`
                    + `<span class="vbox-word-gloss" style="visibility:hidden">x</span>`
                    + `<span class="vbox-word-family" style="visibility:hidden">x</span>`
                    + `</div>`;
            }
        }
    }
    return html;
}

function barCell(barColor, exposed, chainPlace, barExtra) {
    let content = "";
    if (exposed) content += `<span class="vbox-bar-exposed">${exposed}</span>`;
    if (chainPlace) content += `<span class="vbox-bar-chain-place">${chainPlace}</span>`;
    return `<div class="vbox-bar ${barColor} ${barExtra || ""}">${content}</div>`;
}

// ============================================================
// Content renderers (row 2 of grid)
// ============================================================

function renderVerbContent(verb, color, extra) {
    if (!verb) return `<div class="vbox-word ${color}"></div>`;
    if (verb.family === "Compound") return renderCompound(verb, extra);
    if (verb.kind === "Number") return renderNumber(verb, extra);
    if (verb.start?.family === "PE") return renderEnum(verb, extra);
    return wordBox(verb, color, extra);
}

function renderGroup(prefixes, verb, extra) {
    let html = "";
    for (let p of prefixes) html += wordBox(p, getWordColor(p));
    html += renderVerbContent(verb, getWordColor(verb));
    return `<div class="vbox-pair ${extra || ""}">${html}</div>`;
}

function renderNestedBind(bindGroup, extra) {
    let innerItems = [];
    collectBindItems(bindGroup, innerItems);

    if (innerItems.length > 0) innerItems[innerItems.length - 1].chainPlace = "";

    return `<div class="vbox-bind-group ${extra || ""}"><div class="vbox-chain">${renderGrid(innerItems)}</div></div>`;
}

function renderEnum(verb, extra) {
    let enumItems = collectEnumItems(verb);
    return `<div class="vbox-bind-group ${extra || ""}"><div class="vbox-chain">${renderGrid(enumItems)}</div></div>`;
}

function collectEnumItems(verb) {
    let barColor = "vbox-bar-enum";
    let wordColor = "vbox-enum";
    let items = [];

    // PE starter
    items.push({ type: "word", node: verb.start, color: wordColor, barColor, exposed: "", chainPlace: "" });

    // Prefix mode: bu appears after PE
    let isPrefixMode = !!verb.sep;
    if (isPrefixMode) {
        items.push({ type: "word", node: verb.sep, color: wordColor, barColor, exposed: "", chainPlace: "" });
    }

    for (let i = 0; i < verb.items.length; i++) {
        let item = verb.items[i];

        // Separator between items
        if (i > 0) {
            if (isPrefixMode) {
                items.push({ type: "enum-sep", barColor, color: wordColor });
            } else if (item.sep) {
                items.push({ type: "word", node: item.sep, color: wordColor, barColor, exposed: "", chainPlace: "" });
            }
        }

        // Item chain
        stepsToItems(flattenChain(item.chain), barColor, items);
    }

    // PEI end
    if (verb.end) {
        let color = verb.end.elided ? `${wordColor} vbox-elided` : wordColor;
        items.push({ type: "word", node: verb.end, color, barColor, exposed: "", chainPlace: "" });
    }

    if (items.length > 0) items[items.length - 1].chainPlace = "";
    return items;
}

function renderCompound(verb, extra) {
    let fullWord = verb.prefix + verb.content.map(c => c.word).join("");
    let gloss = lookupGloss(fullWord);

    let parts = verb.content.map(part =>
        `<div class="vbox-compound-part">`
        + `<span class="vbox-compound-part-word">${esc(part.word)}</span>`
        + `<span class="vbox-compound-part-gloss">${esc(lookupGloss(part.word))}</span>`
        + `</div>`
    ).join("");

    return `<div class="vbox-compound ${extra || ""}">`
        + `<span class="vbox-word-text">${esc(fullWord)}</span>`
        + `<span class="vbox-word-gloss">${esc(gloss)}</span>`
        + `<div class="vbox-compound-parts">${parts}</div>`
        + `<span class="vbox-word-family">COMPOUND</span>`
        + `</div>`;
}

function renderNumber(verb, extra) {
    let display = formatNumber(verb.value);
    let val = verb.value;

    // Collect all component parts as sub-cells
    let parts = [];
    if (val.int) for (let d of val.int) parts.push(d);
    if (val.base) { parts.push(val.base.sep); for (let d of val.base.value) parts.push(d); }
    if (val.fract) { parts.push(val.fract.sep); for (let d of val.fract.value) parts.push(d); }
    if (val.repeat) { parts.push(val.repeat.sep); for (let d of val.repeat.value) parts.push(d); }
    if (val.magn) { parts.push(val.magn.sep); for (let d of val.magn.value) parts.push(d); }
    if (val.end && !val.end.elided) parts.push(val.end);

    let partsHtml = parts.map(p => {
        let w = p.word || p.symbol || "?";
        let g = lookupGloss(w);
        return `<div class="vbox-compound-part">`
            + `<span class="vbox-compound-part-word">${esc(w)}</span>`
            + `<span class="vbox-compound-part-gloss">${esc(g)}</span>`
            + `</div>`;
    }).join("");

    return `<div class="vbox-compound ${extra || ""}">`
        + `<span class="vbox-word-text">${esc(display)}</span>`
        + `<span class="vbox-word-gloss">number</span>`
        + `<div class="vbox-compound-parts">${partsHtml}</div>`
        + `<span class="vbox-word-family">NUM</span>`
        + `</div>`;
}

function wordBox(node, color, extra) {
    if (!node) return "";
    let word = getWordText(node);
    let gloss = lookupGloss(word);
    let family = getDisplayFamily(node);
    let elided = "";
    if (node.elided) {
        elided = " vbox-elided";
        word = `(${word})`;
    }

    return `<div class="vbox-word ${color}${elided} ${extra || ""}">`
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

function isAdverbStart(start) {
    return start?.word?.startsWith("voi") || start?.word?.startsWith("foi");
}

function getWordText(node) {
    // Check kind first (some have .word as an object, not string)
    if (node.kind === "SingleWordQuote") return node.start.word + " " + (node.word?.word || "?");
    if (node.kind === "InlineAssignment") return node.start.word + " " + getWordText(node.verb);
    if (node.kind === "BorrowingGroup") return node.group.map(b => "u" + b.content).join(" ");
    if (node.kind === "Number") return formatNumber(node.value);
    // Then check simple fields
    if (typeof node.word === "string") return node.word;
    if (node.family === "Compound") return node.prefix + node.content.map(c => c.word).join("");
    if (node.family === "FFVariable") return "i" + node.content;
    if (node.family === "Borrowing") return "u" + node.content;
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
    if (f === "VE" || f === "VEI" || f === "FI") return "vbox-bind";
    if (f === "ZI" || f === "BI" || f === "BO") return "vbox-zi";
    if (f === "SI") return "vbox-si";
    if (f === "A" || f === "O" || f === "NI" || f === "NU" || f === "PO") return "vbox-sentence-bg";
    if (f === "PE" || f === "PEI" || f === "BU") return "vbox-enum";
    if (f === "Compound" || f === "Borrowing" || f === "FFVariable") return "vbox-compound-bg";
    return "vbox-content";
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
