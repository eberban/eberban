// ============================================================
// Eberban Visual Box Renderer
// ============================================================
//
// Renders PEGGY parser output as nested colored box diagrams.
//
// ## Architecture
//
// The rendering is a 2-phase process:
//
// 1. COLLECT: Walk the parse tree and build a flat list of "items".
//    Each item represents one grid column and carries its type,
//    color, bar color, and slot info (exposed places / chain place).
//
// 2. RENDER: Convert items into a CSS Grid with 2 rows:
//    - Row 1: continuous colored bar with per-verb slot labels
//    - Row 2: word boxes, compound/number boxes, or nested groups
//
// ## Item types
//
//   word      — single word box (root, particle, etc.)
//   group     — SI/ZI prefix(es) + verb, rendered side-by-side
//   nested    — VI/FI bind group or PE enum, rendered as a nested
//               grid inside a container in row 2
//   terminator — thin empty box at sentence end (matches bar width)
//   separator  — thin empty box between PE enum items (prefix mode)
//
// ## Nesting
//
// VI/FI bind groups and PE enumerations are rendered as nested grids
// inside a container div (vbox-bind-group). Each nested grid has its
// own colored bar (pink for binds, orange for adverbs, green for enums).
//
// When a verb's explicit binds are the LAST thing in a chain (no next),
// the bind items are "inlined" — appended to the parent grid with
// colored bar sections instead of creating a nested block.
//
// ## Color scheme (semantic CSS variables in boxes.css)
//
// Bars:    bar-default (dark), bar-bind (pink), bar-adverb (orange),
//          bar-enum (green)
// Words:   content (blue), si (yellow), bind (light pink),
//          zi (coral), compound-bg (purple), sentence-bg (dark),
//          adverb (light orange), enum (light green)
//
// ## Key functions
//
// collectChainItems  — entry: parse tree → item list (with terminator)
// stepsToItems       — shared: chain steps → items (used by all collectors)
// collectBindItems   — VI/FI binds → items (per-bind adverb detection)
// collectEnumItems   — PE enum → items (separator/prefix mode)
// renderGrid         — items → HTML (grid with bar cells + content cells)
// renderVerbContent  — dispatches to compound/number/enum/wordBox renderers
// ============================================================

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

function collectChainItems(chain, starter, defined, barColor) {
    if (!chain) return [];
    let items = [];

    if (starter) items.push(wordItem(starter, barColor));
    if (defined) items.push(wordItem(defined, barColor));

    stepsToItems(flattenChain(chain), barColor, items);

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

        let prefixes = extractPrefixes(step);
        let verb = stripModifiers(step.verb);

        if (prefixes.length > 0) {
            let siCount = step.select ? 1 : 0;
            items.push({ type: "group", prefixes, verb, barColor, exposed, chainPlace, siCount });
        } else {
            items.push({ type: "word", node: verb, color: getWordColor(verb), barColor, exposed, chainPlace });
        }

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

function collectEnumItems(verb) {
    let barColor = "vbox-bar-enum";
    let wordColor = "vbox-enum";
    let items = [];

    items.push({ type: "word", node: verb.start, color: wordColor, barColor, exposed: "", chainPlace: "" });

    let isPrefixMode = !!verb.sep;
    if (isPrefixMode) {
        items.push({ type: "word", node: verb.sep, color: wordColor, barColor, exposed: "", chainPlace: "" });
    }

    for (let i = 0; i < verb.items.length; i++) {
        let item = verb.items[i];

        if (i > 0) {
            if (isPrefixMode) {
                items.push({ type: "separator", barColor, color: wordColor });
            } else if (item.sep) {
                items.push({ type: "word", node: item.sep, color: wordColor, barColor, exposed: "", chainPlace: "" });
            }
        }

        stepsToItems(flattenChain(item.chain), barColor, items);
    }

    if (verb.end) {
        let color = verb.end.elided ? `${wordColor} vbox-elided` : wordColor;
        items.push({ type: "word", node: verb.end, color, barColor, exposed: "", chainPlace: "" });
    }

    if (items.length > 0) items[items.length - 1].chainPlace = "";
    return items;
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
        let nextIsTerminator = i + 1 < items.length && items[i + 1].type === "terminator";

        // Row 2 extra classes (first/last margin + rounding)
        let extra = (isFirst ? "vbox-first " : "") + (isLast ? "vbox-last" : "");
        extra = extra.trim();

        // Bar extra classes
        let barExtra = "";
        if (isFirst) barExtra += "vbox-bar-first ";
        if (item.type === "terminator") {
            barExtra += "vbox-bar-last";
        } else if (nextIsTerminator || isLast) {
            barExtra += "vbox-bar-noborder";
        }
        barExtra = barExtra.trim();

        // Render bar cell (all types except separator get one)
        if (item.type !== "separator") {
            html += barCell(item.barColor, item.exposed, item.chainPlace, barExtra);
        }

        // Render row 2 content
        switch (item.type) {
            case "word":
                html += renderVerbContent(item.node, item.color, extra);
                break;
            case "group":
                html += renderGroup(item.prefixes, item.verb, extra, item.siCount);
                break;
            case "nested":
                html += renderNestedBind(item.bindGroup, extra);
                break;
            case "nested-text":
                html += `<div class="vbox-bind-group ${extra || ""}">${renderText(item.text)}</div>`;
                break;
            case "terminator":
                html += thinBox("vbox-sentence-bg", extra);
                break;
            case "separator":
                html += barCell(item.barColor, "", "", barExtra);
                html += thinBox(item.color, extra);
                break;
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

// Thin box with invisible text for height matching (terminator, enum separator)
function thinBox(colorClass, extra) {
    return `<div class="vbox-terminator ${colorClass} ${extra || ""}">`
        + `<span class="vbox-word-text" style="visibility:hidden">x</span>`
        + `<span class="vbox-word-gloss" style="visibility:hidden">x</span>`
        + `<span class="vbox-word-family" style="visibility:hidden">x</span>`
        + `</div>`;
}

// ============================================================
// Content renderers (row 2 of grid)
// ============================================================

function renderVerbContent(verb, color, extra) {
    if (!verb) return `<div class="vbox-word ${color}"></div>`;
    if (verb.family === "Compound") return renderCompound(verb, extra);
    if (verb.kind === "Number") return renderNumber(verb, extra);
    if (verb.start?.family === "PE") return renderEnum(verb, extra);
    if (verb.kind === "SingleWordQuote") return renderSingleWordQuote(verb, extra);
    if (verb.kind === "Spelling Quote") return renderSpellingQuote(verb, extra);
    if (verb.kind === "GrammaticalQuote") return renderGrammaticalQuote(verb, extra);
    if (verb.kind === "ForeignQuote") return renderForeignQuote(verb, extra);
    return wordBox(verb, color, extra);
}

function renderGroup(prefixes, verb, extra, siCount) {
    let html = "";
    for (let i = 0; i < prefixes.length; i++) {
        html += wordBox(prefixes[i], getWordColor(prefixes[i]));
        // Separator after outer SI (between SI and ZI group)
        if (siCount && i === siCount - 1 && i < prefixes.length - 1) {
            html += `<div class="vbox-group-sep"></div>`;
        }
    }
    // Separator before verb
    html += `<div class="vbox-group-sep"></div>`;
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

function renderSingleWordQuote(verb, extra) {
    let parts = `<div class="vbox-compound-part vbox-quote-delim">`
        + `<span class="vbox-compound-part-word">${esc(verb.start.word)}</span>`
        + `<span class="vbox-compound-part-gloss">${esc(lookupGloss(verb.start.word))}</span>`
        + `</div>`
        + `<div class="vbox-compound-part">`
        + `<span class="vbox-compound-part-word">${esc(verb.word.word)}</span>`
        + `<span class="vbox-compound-part-gloss">${esc(lookupGloss(verb.word.word))}</span>`
        + `</div>`;

    return `<div class="vbox-compound vbox-quote ${extra || ""}">`
        + `<div class="vbox-compound-parts">${parts}</div>`
        + `<span class="vbox-word-family">QUOTE</span>`
        + `</div>`;
}

function renderSpellingQuote(verb, extra) {
    let parts = `<div class="vbox-compound-part vbox-quote-delim">`
        + `<span class="vbox-compound-part-word">${esc(verb.starter.word)}</span>`
        + `<span class="vbox-compound-part-gloss">${esc(lookupGloss(verb.starter.word))}</span>`
        + `</div>`;

    for (let item of verb.items) {
        parts += `<div class="vbox-compound-part">`
            + `<span class="vbox-compound-part-word">${esc(item)}</span>`
            + `<span class="vbox-compound-part-gloss">${esc(lookupSpelling(item))}</span>`
            + `</div>`;
    }

    if (verb.end) {
        let endWord = verb.end.elided ? `(${verb.end.word})` : verb.end.word;
        parts += `<div class="vbox-compound-part vbox-quote-delim">`
            + `<span class="vbox-compound-part-word">${esc(endWord)}</span>`
            + `<span class="vbox-compound-part-gloss">${esc(lookupGloss(verb.end.word))}</span>`
            + `</div>`;
    }

    return `<div class="vbox-compound vbox-quote ${extra || ""}">`
        + `<div class="vbox-compound-parts">${parts}</div>`
        + `<span class="vbox-word-family">SPELLING QUOTE</span>`
        + `</div>`;
}

function renderGrammaticalQuote(verb, extra) {
    let barColor = "vbox-bar-quote";
    let items = [];
    items.push({ type: "word", node: verb.start, color: "vbox-quote", barColor, exposed: "", chainPlace: "" });
    items.push({ type: "nested-text", text: verb.text, barColor });
    if (verb.end) {
        let color = verb.end.elided ? "vbox-quote vbox-elided" : "vbox-quote";
        items.push({ type: "word", node: verb.end, color, barColor, exposed: "", chainPlace: "" });
    }
    if (items.length > 0) items[items.length - 1].chainPlace = "";
    return `<div class="vbox-bind-group ${extra || ""}"><div class="vbox-chain">${renderGrid(items)}</div></div>`;
}

function renderForeignQuote(verb, extra) {
    let parts = `<div class="vbox-compound-part vbox-quote-delim">`
        + `<span class="vbox-compound-part-word">${esc(verb.start.word)}</span>`
        + `<span class="vbox-compound-part-gloss">${esc(lookupGloss(verb.start.word))}</span>`
        + `</div>`
        + `<div class="vbox-compound-part vbox-foreign-bracket">`
        + `<span class="vbox-compound-part-word">${esc(verb.content)}</span>`
        + `</div>`;

    return `<div class="vbox-compound vbox-quote ${extra || ""}">`
        + `<div class="vbox-compound-parts">${parts}</div>`
        + `<span class="vbox-word-family">QUOTE</span>`
        + `</div>`;
}

function renderCompound(verb, extra) {
    let dictKey = verb.prefix + " " + verb.content.map(c => c.word).join(" ") + (verb.postfix ? " " + verb.postfix : "");
    let gloss = lookupGloss(dictKey);

    let parts = `<div class="vbox-compound-part vbox-quote-delim">`
        + `<span class="vbox-compound-part-word">${esc(verb.prefix)}</span>`
        + `</div>`;

    let lastIdx = verb.content.length - 1;
    parts += verb.content.map((part, i) => {
        let partGloss;
        if (i === lastIdx && part.word === "se") partGloss = "→intrans";
        else if (i === lastIdx && part.word === "sa") partGloss = "→trans";
        else if (i === lastIdx && part.word === "sai") partGloss = "→trans(pred)";
        else partGloss = lookupGloss(part.word);
        return `<div class="vbox-compound-part">`
            + `<span class="vbox-compound-part-word">${esc(part.word)}</span>`
            + `<span class="vbox-compound-part-gloss">${esc(partGloss)}</span>`
            + `</div>`;
    }).join("");

    if (verb.postfix) {
        parts += `<div class="vbox-compound-part vbox-quote-delim">`
            + `<span class="vbox-compound-part-word">${esc(verb.postfix)}</span>`
            + `</div>`;
    }

    return `<div class="vbox-compound ${extra || ""}">`
        + `<div class="vbox-compound-parts">${parts}</div>`
        + `<span class="vbox-word-gloss">${esc(gloss)}</span>`
        + `<span class="vbox-word-family">COMPOUND</span>`
        + `</div>`;
}

function renderNumber(verb, extra) {
    let val = verb.value;

    let parts = [];
    if (val.int) for (let d of val.int) parts.push(d);
    if (val.base) { parts.push(val.base.sep); for (let d of val.base.value) parts.push(d); }
    if (val.fract) { parts.push(val.fract.sep); for (let d of val.fract.value) parts.push(d); }
    if (val.repeat) { parts.push(val.repeat.sep); for (let d of val.repeat.value) parts.push(d); }
    if (val.magn) { parts.push(val.magn.sep); for (let d of val.magn.value) parts.push(d); }
    if (val.end && !val.end.elided) parts.push(val.end);

    let partsHtml = parts.map(p => {
        let w = p.word || p.symbol || "?";
        let isDelim = p.family === "JI" || p.family === "JO" || p.family === "JA" || p.family === "JE" || p.family === "JU";
        let delimClass = isDelim ? " vbox-quote-delim" : "";
        return `<div class="vbox-compound-part${delimClass}">`
            + `<span class="vbox-compound-part-word">${esc(w)}</span>`
            + `<span class="vbox-compound-part-gloss">${esc(lookupGloss(w))}</span>`
            + `</div>`;
    }).join("");

    let display = computeNumberDisplay(val);

    return `<div class="vbox-compound ${extra || ""}">`
        + `<div class="vbox-compound-parts">${partsHtml}</div>`
        + `<span class="vbox-word-gloss">${esc(display)}</span>`
        + `<span class="vbox-word-family">NUMBER</span>`
        + `</div>`;
}

function computeNumberDisplay(value) {
    let base = value.base ? digitsToInt(value.base.value) : 10;
    let parts = [];

    if (value.int) parts.push(digitsToInt(value.int, base).toString());
    if (value.fract) {
        let fracStr = value.fract.value.map(d => digitValue(d).toString(base)).join("");
        parts.push("." + fracStr);
    }
    if (value.repeat) {
        let repStr = value.repeat.value.map(d => digitValue(d).toString(base)).join("");
        parts.push("(" + repStr + ")\u0305");
    }

    let result = parts.join("") || "0";

    if (value.magn) {
        let exp = digitsToInt(value.magn.value, base);
        result += " \u00d7" + base + superscript(exp);
    }

    if (value.end && !value.end.elided) {
        let jiGloss = lookupGloss(value.end.word);
        if (jiGloss) result += " " + jiGloss;
    }

    return result;
}

function digitValue(d) {
    let match = dictionary[d.word]?.short?.match(/Digit (\d+)/);
    return match ? parseInt(match[1]) : 0;
}

function digitsToInt(digits, base) {
    base = base || 10;
    let result = 0;
    for (let d of digits) {
        result = result * base + digitValue(d);
    }
    return result;
}

function superscript(n) {
    let sup = { '0': '\u2070', '1': '\u00b9', '2': '\u00b2', '3': '\u00b3', '4': '\u2074',
                '5': '\u2075', '6': '\u2076', '7': '\u2077', '8': '\u2078', '9': '\u2079',
                '-': '\u207b' };
    return String(n).split("").map(c => sup[c] || c).join("");
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
    if (verb.family === "MI") return dictionary[verb.word]?.transitive || false;
    if (verb.family === "GI") return !verb.word?.startsWith("gi");
    if (verb.start?.family === "PE") return dictionary[verb.start.word]?.transitive ?? true;
    return false;
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
    if (step.select) prefixes.push(step.select);
    if (step.verb?.modifiers) {
        let mods = Array.isArray(step.verb.modifiers) ? step.verb.modifiers : [step.verb.modifiers];
        for (let m of mods) {
            prefixes.push(m.modifier);
            if (m.select) prefixes.push(m.select);
        }
    }
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
    if (node.kind === "SingleWordQuote") return node.start.word + " " + (node.word?.word || "?");
    if (node.kind === "InlineAssignment") return node.start.word + " " + getWordText(node.verb);
    if (node.kind === "BorrowingGroup") return node.group.map(b => "u" + b.content).join(" ");
    if (node.kind === "Number") return formatNumber(node.value);
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

function lookupSpelling(unit) {
    return unit ? (dictionary._spelling?.[unit]?.gloss || "") : "";
}

function getWordColor(node) {
    let f = node?.family;
    if (f === "VE" || f === "VEI" || f === "FI") return "vbox-bind";
    if (f === "ZI" || f === "BI" || f === "BO") return "vbox-zi";
    if (f === "SI") return "vbox-si";
    if (f === "A" || f === "O" || f === "NI" || f === "NU" || f === "PO") return "vbox-sentence-bg";
    if (f === "PE" || f === "PEI" || f === "BU") return "vbox-enum";
    if (f === "CI" || f === "CE" || f === "CEI" || f === "CA" || f === "CAI" || f === "CO") return "vbox-quote";
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
