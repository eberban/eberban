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
//   word       — single word box (root, particle, etc.)
//   group      — SI/ZI prefix(es) + verb, rendered side-by-side
//   nested     — VI/FI bind group, rendered as nested grid in row 2
//   nested-text — grammatical quote (CA), contains full parsed text
//   terminator — thin empty box at sentence end
//   separator  — thin empty box between PE enum items (prefix mode)
//   return     — thin vertical connector after inline binds,
//                bridges offset depth back to baseline
//
// ## Nesting & Inlining
//
// VI/FI bind groups and PE enumerations are rendered as nested grids
// inside a container div (vbox-bind-group). Each nested grid has its
// own colored bar (pink for binds, orange for adverbs, green for enums).
//
// When a verb's explicit binds are the LAST thing in a chain (no next),
// the bind items are "inlined" — appended to the parent grid with
// colored bar sections and a progressive depth offset to show nesting.
// A thin "return" connector bridges back to baseline after inlined binds.
//
// ## Color scheme (semantic CSS variables in boxes.css)
//
// Bars:    bar-default (dark), bar-bind (pink), bar-adverb (orange),
//          bar-enum (green), bar-quote (gold)
// Words:   content (blue), si (lavender), bind (light pink),
//          zi (salmon), compound-bg (blue), sentence-bg (dark),
//          adverb (light orange), enum (light green), quote (gold)
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

const INLINE_DEPTH_OFFSET_PX = 10;

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
        setupTooltips();
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

    stepsToItems(flattenChain(chain), barColor, items, 0);

    // Last item never shows chainPlace
    if (items.length > 0) items[items.length - 1].chainPlace = "";

    // Return connector if any items have depth > 0
    let maxDepth = 0;
    for (let it of items) if (it.depth > maxDepth) maxDepth = it.depth;
    if (maxDepth > 0) {
        items.push({ type: "return", barColor, maxDepth });
    }

    // Sentence terminator
    items.push({ type: "terminator", barColor });
    return items;
}

function stepsToItems(steps, barColor, items, depth) {
    let slots = getSlotInfo(steps);

    for (let i = 0; i < steps.length; i++) {
        let step = steps[i];
        let { exposed, chainPlace } = slots[i];
        let isLast = i === steps.length - 1;

        let prefixes = extractPrefixes(step);
        let verb = stripModifiers(step.verb);

        if (prefixes.length > 0) {
            let siCount = step.select ? 1 : 0;
            items.push({ type: "group", prefixes, verb, barColor, exposed, chainPlace, siCount, depth });
        } else {
            items.push({ type: "word", node: verb, color: getWordColor(verb), barColor, exposed, chainPlace, depth });
        }

        if (step.explicit_binds) {
            if (!isLast) {
                items.push({ type: "nested", bindGroup: step.explicit_binds, barColor, depth });
            } else {
                collectBindItems(step.explicit_binds, items, depth, true);
            }
        }
    }
}

function collectBindItems(bindGroup, items, depth, inline) {
    let nextDepth = (depth || 0) + (inline ? 1 : 0);
    for (let bind of bindGroup.binds) {
        let adverb = isAdverbStart(bind.start);
        let barColor = adverb ? "vbox-bar-adverb" : "vbox-bar-bind";
        let wordColor = adverb ? "vbox-adverb" : "vbox-bind";

        items.push({ type: "word", node: bind.start, color: wordColor, barColor, exposed: "", chainPlace: "", depth: nextDepth });
        stepsToItems(flattenChain(bind.inner?.chain || bind.inner), barColor, items, nextDepth);
    }

    // VEI: omit only if inline AND elided
    if (bindGroup.end && !(inline && bindGroup.end.elided)) {
        let color = bindGroup.end.elided ? "vbox-bind vbox-elided" : "vbox-bind";
        items.push({ type: "word", node: bindGroup.end, color, barColor: "vbox-bar-bind", exposed: "", chainPlace: "", depth: nextDepth });
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

        stepsToItems(flattenChain(item.chain), barColor, items, 0);
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
        let depthPx = (item.depth || 0) * INLINE_DEPTH_OFFSET_PX;
        let depthStyle = depthPx ? ` style="margin-top:${depthPx}px"` : "";
        // Nested bind groups need extra margin on top of depth offset for visual separation
        let nestedDepthStyle = depthPx ? ` style="margin-top:${depthPx + 5}px"` : "";

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
            html += barCell(item.barColor, item.exposed, item.chainPlace, barExtra, depthStyle);
        }

        // Render row 2 content
        switch (item.type) {
            case "word":
                html += renderVerbContent(item.node, item.color, extra, depthStyle);
                break;
            case "group":
                html += renderGroup(item.prefixes, item.verb, extra, item.siCount, depthStyle);
                break;
            case "nested":
                html += renderNestedBind(item.bindGroup, extra, nestedDepthStyle);
                break;
            case "nested-text":
                html += `<div class="vbox-bind-group ${extra || ""}"${depthStyle}>${renderText(item.text)}</div>`;
                break;
            case "terminator":
                html += thinBox("vbox-sentence-bg", extra, depthStyle);
                break;
            case "separator":
                html += barCell(item.barColor, "", "", barExtra, depthStyle);
                html += thinBox(item.color, extra, depthStyle);
                break;
            case "return": {
                let returnHeight = item.maxDepth * INLINE_DEPTH_OFFSET_PX;
                html += `<div class="vbox-return vbox-bar-bind" style="height:${returnHeight}px"></div>`;
                break;
            }
        }
    }
    return html;
}

function barCell(barColor, exposed, chainPlace, barExtra, depthStyle) {
    let content = "";
    if (exposed) content += `<span class="vbox-bar-exposed">${exposed}</span>`;
    if (chainPlace) content += `<span class="vbox-bar-chain-place">${chainPlace}</span>`;
    return `<div class="vbox-bar ${barColor} ${barExtra || ""}"${depthStyle || ""}>${content}</div>`;
}

// Thin box with invisible text for height matching (terminator, enum separator)
function thinBox(colorClass, extra, depthStyle) {
    return `<div class="vbox-terminator ${colorClass} ${extra || ""}"${depthStyle || ""}>`
        + `<span class="vbox-word-text" style="visibility:hidden">x</span>`
        + `<span class="vbox-word-gloss" style="visibility:hidden">x</span>`
        + `<span class="vbox-word-family" style="visibility:hidden">x</span>`
        + `</div>`;
}

// ============================================================
// Content renderers (row 2 of grid)
// ============================================================

function renderVerbContent(verb, color, extra, depthStyle) {
    if (!verb) return `<div class="vbox-word ${color}"></div>`;
    if (verb.family === "Compound") return renderCompound(verb, extra, depthStyle);
    if (verb.kind === "Number") return renderNumber(verb, extra, depthStyle);
    if (verb.start?.family === "PE") return renderEnum(verb, extra, depthStyle);
    if (verb.kind === "SingleWordQuote") return renderSingleWordQuote(verb, extra, depthStyle);
    if (verb.kind === "Spelling Quote") return renderSpellingQuote(verb, extra, depthStyle);
    if (verb.kind === "GrammaticalQuote") return renderGrammaticalQuote(verb, extra, depthStyle);
    if (verb.kind === "ForeignQuote") return renderForeignQuote(verb, extra, depthStyle);
    return wordBox(verb, color, extra, depthStyle);
}

function renderGroup(prefixes, verb, extra, siCount, depthStyle) {
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
    return `<div class="vbox-pair ${extra || ""}"${depthStyle || ""}>${html}</div>`;
}

function renderNestedBind(bindGroup, extra, depthStyle) {
    let innerItems = [];
    collectBindItems(bindGroup, innerItems);
    if (innerItems.length > 0) innerItems[innerItems.length - 1].chainPlace = "";
    return `<div class="vbox-bind-group ${extra || ""}"${depthStyle || ""}><div class="vbox-chain">${renderGrid(innerItems)}</div></div>`;
}

function renderEnum(verb, extra, depthStyle) {
    let enumItems = collectEnumItems(verb);
    return `<div class="vbox-bind-group ${extra || ""}"${depthStyle || ""}><div class="vbox-chain">${renderGrid(enumItems)}</div></div>`;
}

function renderSingleWordQuote(verb, extra, depthStyle) {
    let parts = compoundPart(verb.start.word, lookupGloss(verb.start.word), " vbox-quote-delim", lookupShort(verb.start.word))
        + compoundPart(verb.word.word, lookupGloss(verb.word.word), "", lookupShort(verb.word.word));

    return `<div class="vbox-compound vbox-quote ${extra || ""}"${depthStyle || ""}>`
        + `<div class="vbox-compound-parts">${parts}</div>`
        + `<span class="vbox-word-family">QUOTE</span>`
        + `</div>`;
}

function renderSpellingQuote(verb, extra, depthStyle) {
    let parts = compoundPart(verb.starter.word, lookupGloss(verb.starter.word), " vbox-quote-delim", lookupShort(verb.starter.word));

    for (let item of verb.items) {
        let spellingShort = dictionary._spelling?.[item]?.short || "";
        parts += compoundPart(item, lookupSpelling(item), "", spellingShort);
    }

    if (verb.end) {
        let endWord = verb.end.elided ? `(${verb.end.word})` : verb.end.word;
        parts += compoundPart(endWord, lookupGloss(verb.end.word), " vbox-quote-delim", lookupShort(verb.end.word));
    }

    return `<div class="vbox-compound vbox-quote ${extra || ""}"${depthStyle || ""}>`
        + `<div class="vbox-compound-parts">${parts}</div>`
        + `<span class="vbox-word-family">SPELLING QUOTE</span>`
        + `</div>`;
}

function renderGrammaticalQuote(verb, extra, depthStyle) {
    let barColor = "vbox-bar-quote";
    let items = [];
    items.push({ type: "word", node: verb.start, color: "vbox-quote", barColor, exposed: "", chainPlace: "" });
    items.push({ type: "nested-text", text: verb.text, barColor });
    if (verb.end) {
        let color = verb.end.elided ? "vbox-quote vbox-elided" : "vbox-quote";
        items.push({ type: "word", node: verb.end, color, barColor, exposed: "", chainPlace: "" });
    }
    if (items.length > 0) items[items.length - 1].chainPlace = "";
    return `<div class="vbox-bind-group ${extra || ""}"${depthStyle || ""}><div class="vbox-chain">${renderGrid(items)}</div></div>`;
}

function renderForeignQuote(verb, extra, depthStyle) {
    let parts = compoundPart(verb.start.word, lookupGloss(verb.start.word), " vbox-quote-delim", lookupShort(verb.start.word))
        + `<div class="vbox-compound-part vbox-foreign-bracket">`
        + `<span class="vbox-compound-part-word">${esc(verb.content)}</span>`
        + `</div>`;

    return `<div class="vbox-compound vbox-quote ${extra || ""}"${depthStyle || ""}>`
        + `<div class="vbox-compound-parts">${parts}</div>`
        + `<span class="vbox-word-family">QUOTE</span>`
        + `</div>`;
}

function renderCompound(verb, extra, depthStyle) {
    let dictKey = verb.prefix + " " + verb.content.map(c => c.word).join(" ") + (verb.postfix ? " " + verb.postfix : "");
    let gloss = lookupGloss(dictKey);

    let parts = compoundPart(verb.prefix, "", " vbox-quote-delim", "");

    let lastIdx = verb.content.length - 1;
    parts += verb.content.map((part, i) => {
        let partGloss;
        if (i === lastIdx && part.word === "se") partGloss = "\u2192intrans";
        else if (i === lastIdx && part.word === "sa") partGloss = "\u2192trans";
        else if (i === lastIdx && part.word === "sai") partGloss = "\u2192trans(pred)";
        else partGloss = lookupGloss(part.word);
        return compoundPart(part.word, partGloss, "", lookupShort(part.word));
    }).join("");

    if (verb.postfix) {
        parts += compoundPart(verb.postfix, "", " vbox-quote-delim", "");
    }

    let short = lookupShort(dictKey);
    let tooltip = short ? ` data-tooltip="${esc(short)}"` : "";
    return `<div class="vbox-compound ${extra || ""}"${tooltip}${depthStyle || ""}>`
        + `<div class="vbox-compound-parts">${parts}</div>`
        + `<span class="vbox-word-gloss">${esc(gloss)}</span>`
        + `<span class="vbox-word-family">COMPOUND</span>`
        + `</div>`;
}

function renderNumber(verb, extra, depthStyle) {
    let val = verb.value;

    let parts = [];
    if (val.base) { for (let d of asArray(val.base.value)) parts.push(d); parts.push(val.base.sep); }
    if (val.int) for (let d of val.int) parts.push(d);
    if (val.fract) { parts.push(val.fract.sep); for (let d of val.fract.value) parts.push(d); }
    if (val.repeat) { parts.push(val.repeat.sep); for (let d of val.repeat.value) parts.push(d); }
    if (val.magn) { parts.push(val.magn.sep); for (let d of val.magn.value) parts.push(d); }
    if (val.end) parts.push(val.end);

    let partsHtml = parts.map(p => {
        let w = p.word || p.symbol || "?";
        let isJ = p.family === "JI" || p.family === "JO" || p.family === "JA" || p.family === "JE" || p.family === "JU";
        let delimClass = isJ ? " vbox-quote-delim" : "";
        let elided = p.elided ? " vbox-elided" : "";
        let display = p.elided ? `(${w})` : w;
        let gloss = isJ ? "" : lookupGloss(w);
        return compoundPart(display, gloss, delimClass + elided, lookupShort(w));
    }).join("");

    let display = computeNumberDisplay(val);

    return `<div class="vbox-compound ${extra || ""}"${depthStyle || ""}>`
        + `<div class="vbox-compound-parts">${partsHtml}</div>`
        + `<span class="vbox-word-gloss">${esc(display)}</span>`
        + `<span class="vbox-word-family">NUMBER</span>`
        + `</div>`;
}

function computeNumberDisplay(value) {
    let parts = [];

    // Base override: Eberban specifies highest digit, natlangs use digit+1
    if (value.base) {
        let baseDigit = digitValue(asArray(value.base.value)[0]);
        parts.push(`(base ${baseDigit + 1}) `);
    }

    if (value.int) parts.push(rawDigits(value.int));
    if (value.fract) parts.push("." + rawDigits(value.fract.value));
    if (value.repeat) parts.push("(" + rawDigits(value.repeat.value) + ")\u0305");

    let result = parts.join("") || "0";

    if (value.magn) {
        let expStr = rawDigits(value.magn.value);
        result += " \u00d7base" + superscript(expStr);
    }

    if (value.end) {
        let jiSuffix = { "ji": " (cardinal set)", "jiu": " (ordinal)" };
        result += jiSuffix[value.end.word] || "";
    }

    return result;
}

function digitValue(d) {
    let match = dictionary[d.word]?.short?.match(/Digit (\d+)/);
    return match ? parseInt(match[1]) : 0;
}

function rawDigits(digits) {
    return asArray(digits).map(d => {
        let v = digitValue(d);
        return v < 10 ? v.toString() : String.fromCharCode(55 + v); // A=10, B=11, etc.
    }).join("");
}

function superscript(s) {
    let sup = { '0': '\u2070', '1': '\u00b9', '2': '\u00b2', '3': '\u00b3', '4': '\u2074',
                '5': '\u2075', '6': '\u2076', '7': '\u2077', '8': '\u2078', '9': '\u2079',
                '-': '\u207b' };
    return String(s).split("").map(c => sup[c] || c).join("");
}

function compoundPart(word, gloss, extraClass, short) {
    let tooltip = short ? ` data-tooltip="${esc(short)}"` : "";
    return `<div class="vbox-compound-part${extraClass || ""}"${tooltip}>`
        + `<span class="vbox-compound-part-word">${esc(word)}</span>`
        + `<span class="vbox-compound-part-gloss">${esc(gloss)}</span>`
        + `</div>`;
}

function wordBox(node, color, extra, depthStyle) {
    if (!node) return "";
    let word = getWordText(node);
    let gloss = lookupGloss(word);
    let family = getDisplayFamily(node);
    let short = lookupShort(word);
    let elided = "";
    if (node.elided) {
        elided = " vbox-elided";
        word = `(${word})`;
    }

    let tooltip = short ? ` data-tooltip="${esc(short)}"` : "";
    return `<div class="vbox-word ${color}${elided} ${extra || ""}"${tooltip}${depthStyle || ""}>`
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

function asArray(val) {
    return Array.isArray(val) ? val : [val];
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

function lookupShort(word) {
    return word ? (dictionary[word]?.short?.trim() || "") : "";
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

// ============================================================
// Tooltip (fixed-position, escapes overflow clipping)
// ============================================================

let tooltipEl = null;

function setupTooltips() {
    if (!tooltipEl) {
        tooltipEl = document.createElement("div");
        tooltipEl.className = "vbox-tooltip";
        tooltipEl.style.display = "none";
        document.body.appendChild(tooltipEl);
    }

    $('#parse-result-boxes').off('.vbox');

    $('#parse-result-boxes').on('mousemove.vbox', function (e) {
        let target = e.target.closest('[data-tooltip]');
        if (target) {
            tooltipEl.textContent = target.getAttribute('data-tooltip');
            tooltipEl.style.display = "block";
            positionTooltip(e);
        } else {
            tooltipEl.style.display = "none";
        }
    });

    $('#parse-result-boxes').on('mouseleave.vbox', function () {
        tooltipEl.style.display = "none";
    });
}

function positionTooltip(e) {
    let x = e.clientX + 12;
    let y = e.clientY + 16;
    // Keep on screen
    let w = tooltipEl.offsetWidth;
    let h = tooltipEl.offsetHeight;
    if (x + w > window.innerWidth - 8) x = e.clientX - w - 8;
    if (y + h > window.innerHeight - 8) y = e.clientY - h - 8;
    tooltipEl.style.left = x + "px";
    tooltipEl.style.top = y + "px";
}

