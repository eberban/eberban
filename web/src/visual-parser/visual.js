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
//   word         — single word box (root, particle, etc.)
//   group        — SI/ZI prefix(es) + verb, rendered side-by-side
//   nested       — VI/FI bind group, rendered as nested grid in row 2
//   nested-text  — grammatical quote (CA), contains full parsed text
//   erased-chain — RI-erased chain segment, pre-rendered with opacity
//   terminator   — thin empty box at sentence end
//   separator    — thin empty box between PE enum items (prefix mode)
//   return       — thin vertical connector after inline binds,
//                  bridges offset depth back to baseline
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
//
// ## Annotations (DI/DE/DA)
//
// Annotations are rendered as a 💬 icon on the word box. Hovering shows a
// popover with annotation details. Annotation HTML is stored in annotationStore
// (keyed by numeric ID) to avoid double-escaping in data attributes.
//
// ## Erasure (RA/RI)
//
// Sentence erasure (RA): erased sentence wrapped in vbox-erased-sentence (opacity),
// RA particle rendered as standalone box beside it.
// Chain erasure (RI): erased chain rendered as nested vbox-bind-group with
// vbox-erased class, RI particle as normal word item.
//
// ## ECHO-resumptive (PA)
//
// When a chain step has a `resume` field, the steps between the original
// verb and the resume are rendered at depth+1 (offset). The PA particle
// and resumed verb (dimmed) + binds render at the original depth.
// Multiple resumes on the same step nest: each resume's continuation
// (.next) is offset for the next resume to connect back.
//
// ## Slot detection
//
// Bar labels show exposed places (left) and chain place with ·/≡ symbol (right).
// parseSISlots: programmatic SI parsing (vowels, h-override, transparency, equiv).
// getVerbSlots/getVerbTransitivity: derive from verb form (roots, compounds, particles).
// ZI_SLOTS: hardcoded chaining overrides for ZI modifiers.
// ============================================================

import dictionary from '../../../dictionary/en.yaml';
import * as parser from "../grammar/eberban.peggy.js";
import { GrammarError } from "peggy";

const INLINE_DEPTH_OFFSET_PX = 10;

// Unicode symbols
const SYM_SHARING   = "\u00b7";  // · middle dot
const SYM_EQUIV     = "\u2261";  // ≡ triple bar
const SYM_MULTIPLY  = "\u00d7";  // × multiplication sign
const SYM_OVERLINE  = "\u0305";  // combining overline
const SYM_ARROW     = "\u2192";  // → right arrow
const ICON_ANNOT    = "\uD83D\uDCAC"; // 💬 speech bubble
const SUPERSCRIPT   = { '0':'\u2070','1':'\u00b9','2':'\u00b2','3':'\u00b3','4':'\u2074',
                         '5':'\u2075','6':'\u2076','7':'\u2077','8':'\u2078','9':'\u2079','-':'\u207b' };

// Annotation popover store (reset each parse)
let annotationStore = {};
let annotationNextId = 0;

/** Build annotation icon + data-attribute for a node, or empty strings if no annotations. */
function annotationAttrs(node) {
    let html = buildAnnotationHtml(node);
    if (!html) return { icon: "", attr: "" };
    let id = annotationNextId++;
    annotationStore[id] = html;
    return {
        icon: `<span class="vbox-annot-icon">${ICON_ANNOT}</span>`,
        attr: ` data-annotation-id="${id}"`
    };
}

// ============================================================
// Entry point
// ============================================================

export function parse() {
    const input = $('#input_textarea').val();
    $('#result-row').slideDown();

    try {
        annotationStore = {};
        annotationNextId = 0;
        const result = parser.parse(input, { grammarSource: "form" });
        $('#parse-result-raw').html(`<pre>${JSON.stringify(result, null, 4)}</pre>`);
        $('#parse-result-tree').html(renderTree(result));
        setupTreeToggles();
        $('#parse-result-glossing').html(renderGlosses(collectWords(result)));
        $('#parse-result-boxes').html(renderText(result));
        setupTooltips();
        setupAnnotationPopovers();
        $('#parser_error_box').hide();

        if (result?.warnings != undefined) {
            let warnings = "";
            for (let warn of result.warnings) {
                let err = new GrammarError(warn.message, warn.location);
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
        let err_message = typeof e.format === "function"
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
        if (para.starter) {
            let word = getWordText(para.starter);
            let gloss = lookupGloss(word);
            let annot = annotationAttrs(para.starter);
            inner += `<div class="vbox-para-header vbox-sentence-bg"${annot.attr}>`
                + annot.icon
                + `<span class="vbox-word-text">${esc(word)}</span>`
                + `<span class="vbox-word-gloss">${esc(gloss)}</span>`
                + `<span class="vbox-word-family">${esc(getDisplayFamily(para.starter))}</span>`
                + `</div>`;
        }
        for (let s of para.sentences) inner += renderSentence(s);
        html += `<div class="vbox-paragraph">${inner}</div>`;
    }
    return html;
}

function renderSentence(sentence) {
    let raBox = wordBox({ family: "RA", word: "ra" }, "vbox-sentence-bg vbox-ra-box");

    // Erased invalid sentence (RA on ungrammatical text)
    if (sentence.kind === "Erased Invalid") {
        let text = (sentence.starter ? getWordText(sentence.starter) + " " : "") + (sentence.rest || "");
        let invalidBox = wordBox({ family: "INVALID", word: text }, "vbox-sentence-bg");
        return `<div class="vbox-sentence">`
            + `<div class="vbox-erased-sentence">${invalidBox}</div>`
            + raBox
            + `</div>`;
    }

    // Erased valid sentence (RA on grammatical sentence)
    let isErased = sentence.kind?.startsWith("Erased");

    // NI sentences: starter + pred, no chain
    if (sentence.pred && !sentence.definition) {
        let items = [];
        items.push({ type: "starter-group", starter: sentence.starter, defined: sentence.pred, args: null, barColor: "", exposed: "", chainPlace: "" });
        let grid = `<div class="vbox-chain">${renderGrid(items)}</div>`;
        if (isErased) grid = `<div class="vbox-erased-sentence">${grid}</div>`;
        return `<div class="vbox-sentence">${grid}${isErased ? raBox : ""}</div>`;
    }

    let def = sentence.definition;
    let args = def?.args || null;
    let chain = def?.chain || def;

    let items = collectChainItems(chain, sentence.starter, sentence.defined, "", args);
    let grid = `<div class="vbox-chain">${renderGrid(items)}</div>`;
    if (isErased) grid = `<div class="vbox-erased-sentence">${grid}</div>`;
    return `<div class="vbox-sentence">${grid}${isErased ? raBox : ""}</div>`;
}

// ============================================================
// Collect items: walk parse tree → flat list of grid items
// ============================================================

/**
 * Walk a chain parse tree and build a flat item list for renderGrid.
 * Handles: starter/defined group, chain erasure (RI), step items, inline binds,
 * return connector, and sentence terminator.
 */
function collectChainItems(chain, starter, defined, barColor, args) {
    if (!chain) return [];
    let items = [];

    if (starter && (defined || args)) {
        items.push({ type: "starter-group", starter, defined, args, barColor, exposed: "", chainPlace: "" });
    } else if (starter) {
        items.push(wordItem(starter, barColor));
    }

    // Chain erasure (RI): render erased chain as nested container, then RI particle
    if (chain.erased) {
        for (let entry of chain.erased) {
            let erasedItems = [];
            stepsToItems(flattenChain(entry.chain), barColor, erasedItems, 0);
            if (erasedItems.length > 0) erasedItems[erasedItems.length - 1].chainPlace = "";
            let erasedGrid = `<div class="vbox-chain">${renderGrid(erasedItems)}</div>`;
            items.push({ type: "erased-chain", html: `<div class="vbox-bind-group vbox-erased">${erasedGrid}</div>`, barColor, exposed: "", chainPlace: "" });
            items.push({ type: "word", node: { family: "RI", word: "ri" }, color: "vbox-sentence-bg", barColor, exposed: "", chainPlace: "" });
        }
    }

    stepsToItems(flattenChain(chain), barColor, items, 0);

    // Last item never shows chainPlace
    if (items.length > 0) items[items.length - 1].chainPlace = "";

    // Return connector: bridge from last item's depth back to baseline
    // Stop at first item with explicit depth (0 = baseline, no bridge needed)
    let lastDepth = 0;
    for (let i = items.length - 1; i >= 0; i--) {
        if (items[i].depth !== undefined) { lastDepth = items[i].depth; break; }
    }
    if (lastDepth > 0) {
        items.push({ type: "return", barColor, maxDepth: lastDepth });
    }

    // Sentence terminator
    items.push({ type: "terminator", barColor });
    return items;
}

/** Convert chain steps into grid items. Extracts SI/ZI prefixes, computes slot info,
 *  and pushes word/group items. Recurses into explicit bind groups. */
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
            if (!isLast || step.resume) {
                items.push({ type: "nested", bindGroup: step.explicit_binds, barColor, depth });
            } else {
                collectBindItems(step.explicit_binds, items, depth, true);
            }
        }

        // ECHO-resumptive: offset remaining steps, then render resume parts
        if (step.resume) {
            let resumes = Array.isArray(step.resume) ? step.resume : [step.resume];

            // Remaining steps go at depth+1 (the "between" part)
            let remaining = steps.slice(i + 1);
            if (remaining.length > 0) {
                stepsToItems(remaining, "vbox-bar-default", items, depth + 1);
                if (items.length > 0) items[items.length - 1].chainPlace = "";
                addReturnIfNeeded(items, depth, "vbox-bar-default");
            }

            // Render each resume entry
            for (let ri = 0; ri < resumes.length; ri++) {
                let r = resumes[ri];

                // PA particle at original depth
                items.push({ type: "word", node: r.start, color: "vbox-bind", barColor: "vbox-bar-default", exposed: "", chainPlace: "", depth });

                // Resumed verb (dimmed) + its binds at original depth
                let rSteps = flattenChain(r.chain);
                let rSlots = getSlotInfo(rSteps);
                for (let j = 0; j < rSteps.length; j++) {
                    let rs = rSteps[j];
                    let rPrefixes = extractPrefixes(rs);
                    let rVerb = stripModifiers(rs.verb);
                    let { exposed: rExposed, chainPlace: rChainPlace } = rSlots[j];

                    if (rPrefixes.length > 0) {
                        let siCount = rs.select ? 1 : 0;
                        items.push({ type: "group", prefixes: rPrefixes, verb: rVerb, barColor: "vbox-bar-default", exposed: rExposed, chainPlace: rChainPlace, siCount, depth, dimmed: j === 0 });
                    } else {
                        items.push({ type: "word", node: rVerb, color: getWordColor(rVerb), barColor: "vbox-bar-default", exposed: rExposed, chainPlace: rChainPlace, depth, dimmed: j === 0 });
                    }

                    if (rs.explicit_binds) {
                        items.push({ type: "nested", bindGroup: rs.explicit_binds, barColor: "vbox-bar-default", depth });
                    }
                }

                // Resume continuation: offset for next resume to connect back, except last
                if (r.next) {
                    let isLastResume = ri === resumes.length - 1;
                    let nextDepth = isLastResume ? depth : depth + 1;
                    stepsToItems(flattenChain(r.next), "vbox-bar-default", items, nextDepth);
                    if (items.length > 0) items[items.length - 1].chainPlace = "";
                    addReturnIfNeeded(items, depth, "vbox-bar-default");
                }
            }

            return; // remaining steps already handled
        }
    }
}

/** Insert a return connector if the last item's depth exceeds targetDepth. */
function addReturnIfNeeded(items, targetDepth, barColor) {
    for (let i = items.length - 1; i >= 0; i--) {
        if (items[i].depth !== undefined) {
            let d = items[i].depth;
            if (d > targetDepth) {
                items.push({ type: "return", barColor, maxDepth: d - targetDepth, depth: targetDepth });
            }
            break;
        }
    }
}

function collectBindItems(bindGroup, items, depth, inline) {
    let nextDepth = (depth || 0) + (inline ? 1 : 0);
    for (let bind of bindGroup.binds) {
        let adverb = isAdverbStart(bind.start);
        let barColor = adverb ? "vbox-bar-adverb" : "vbox-bar-bind";
        let wordColor = adverb ? "vbox-adverb" : "vbox-bind";

        let inner = bind.inner;
        if (inner?.args) {
            items.push({ type: "vi-args", node: bind.start, color: wordColor, args: inner.args, barColor, exposed: "", chainPlace: "", depth: nextDepth });
        } else {
            items.push({ type: "word", node: bind.start, color: wordColor, barColor, exposed: "", chainPlace: "", depth: nextDepth });
        }
        let chainSteps = flattenChain(inner?.chain || inner);
        let places = getBindVowelPlaces(bind.start.word);

        if (places.length > 1 && chainSteps.length > 0) {
            let consumed = Math.min(places.length - 1, chainSteps.length);

            for (let v = 0; v < consumed; v++) {
                items.push({ type: "separator", barColor, color: wordColor, depth: nextDepth, chainPlace: places[v] });
                stepsToItems([chainSteps[v]], barColor, items, nextDepth);
                if (items.length > 0) items[items.length - 1].chainPlace = "";
            }

            items.push({ type: "separator", barColor, color: wordColor, depth: nextDepth, chainPlace: places[consumed] });
            let remaining = chainSteps.slice(consumed);
            if (remaining.length > 0) {
                stepsToItems(remaining, barColor, items, nextDepth);
                if (items.length > 0) items[items.length - 1].chainPlace = "";
            }
        } else {
            stepsToItems(chainSteps, barColor, items, nextDepth);
            if (items.length > 0) items[items.length - 1].chainPlace = "";
        }
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

        let beforeLen = items.length;
        stepsToItems(flattenChain(item.chain), barColor, items, 0);
        if (items.length > beforeLen) items[items.length - 1].chainPlace = "";
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

/**
 * Render a flat item list into a CSS Grid with 2 rows: bar (row 1) + content (row 2).
 * Handles depth offset for inlined binds, erased item opacity, and special margin
 * for container verbs (PE enums, grammatical quotes) to clear bar overflow.
 */
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
        if (item.erased) barExtra += " vbox-erased";
        if (item.dimmed) barExtra += " vbox-dimmed";
        barExtra = barExtra.trim();

        // Erased/dimmed items get opacity on content
        if (item.erased) extra = (extra ? extra + " " : "") + "vbox-erased";
        if (item.dimmed) extra = (extra ? extra + " " : "") + "vbox-dimmed";

        // Render bar cell (all types except separator get one)
        if (item.type !== "separator") {
            html += barCell(item.barColor, item.exposed, item.chainPlace, barExtra, depthStyle);
        }

        // Render row 2 content
        switch (item.type) {
            case "word": {
                // Container verbs (PE enums, grammatical quotes) render as bind-groups —
                // need extra margin to clear bar overflow in flattened/nested binds
                let wordDepth = depthStyle;
                if (item.node?.start?.family === "PE" || item.node?.kind === "GrammaticalQuote") {
                    wordDepth = ` style="margin-top:${(depthPx || 0) + 5}px"`;
                }
                html += renderVerbContent(item.node, item.color, extra, wordDepth);
                break;
            }
            case "group":
                html += renderGroup(item.prefixes, item.verb, extra, item.siCount, depthStyle);
                break;
            case "vi-args":
                html += renderViArgs(item.node, item.color, item.args, extra, depthStyle);
                break;
            case "starter-group":
                html += renderStarterGroup(item.starter, item.defined, item.args, extra, depthStyle);
                break;
            case "erased-chain":
                html += item.html;
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
                if (item.chainPlace) {
                    html += `<div class="vbox-terminator ${item.color} ${extra || ""}"${depthStyle || ""}>`
                        + `<span class="vbox-word-text" style="visibility:hidden">x</span>`
                        + `<span class="vbox-word-gloss">${item.chainPlace}</span>`
                        + `<span class="vbox-word-family" style="visibility:hidden">x</span>`
                        + `</div>`;
                } else {
                    html += thinBox(item.color, extra, depthStyle);
                }
                break;
            case "return": {
                let returnHeight = item.maxDepth * INLINE_DEPTH_OFFSET_PX;
                let bgVar = item.barColor === "vbox-bar-bind" ? "--vbox-bar-bind"
                          : item.barColor === "vbox-bar-adverb" ? "--vbox-bar-adverb"
                          : "--vbox-bar-default";
                let returnStyle = `height:${returnHeight}px;background:var(${bgVar})${depthPx ? `;margin-top:${depthPx}px` : ""}`;
                html += `<div class="vbox-return" style="${returnStyle}"></div>`;
                break;
            }
        }
    }
    return html;
}

function barCell(barColor, exposed, chainPlace, barExtra, depthStyle) {
    let content = "";
    if (exposed) {
        let expTip = null;
        if (exposed === "*") expTip = "all places exposed";
        else if (exposed === "~" && chainPlace) {
            expTip = `transparent (re-exposes all places of ${stripChainSymbol(chainPlace)})`;
        } else if (exposed === "~") expTip = "transparent";
        else if (exposed === "none") expTip = "no places exposed";
        else if (/^[EAOU]+$/.test(exposed)) expTip = "exposes " + exposed.split("").join(", ");
        let expAttr = expTip ? ` data-tooltip="${expTip}"` : "";
        content += `<span class="vbox-bar-exposed"${expAttr}>${exposed}</span>`;
    }
    if (chainPlace) {
        let equiv = chainPlace.includes(SYM_EQUIV);
        let place = stripChainSymbol(chainPlace);
        let tip = `chains ${place} (${equiv ? "equivalence/predicate" : "sharing/atom"})`;
        content += `<span class="vbox-bar-chain-place" data-tooltip="${tip}">${chainPlace}</span>`;
    }
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

function renderStarterGroup(starter, defined, args, extra, depthStyle) {
    let html = wordBox(starter, getWordColor(starter));
    if (defined) html += wordBox(defined, getWordColor(defined));
    if (args) {
        let parts = "";
        for (let arg of args.list) {
            let w = getWordText(arg);
            parts += compoundPart(w, lookupGloss(w), "", lookupShort(w));
        }
        let endW = getWordText(args.end);
        parts += compoundPart(endW, "", " vbox-quote-delim", lookupShort(endW));
        html += `<div class="vbox-compound vbox-args">`
            + `<div class="vbox-compound-parts">${parts}</div>`
            + `<span class="vbox-word-family">ARGS</span>`
            + `</div>`;
    }
    return `<div class="vbox-pair ${extra || ""}"${depthStyle || ""}>${html}</div>`;
}

function renderViArgs(node, color, args, extra, depthStyle) {
    let parts = "";
    for (let arg of args.list) {
        let w = getWordText(arg);
        parts += compoundPart(w, lookupGloss(w), "", lookupShort(w));
    }
    let endW = getWordText(args.end);
    parts += compoundPart(endW, "", " vbox-quote-delim", lookupShort(endW));

    let argsBox = `<div class="vbox-compound vbox-args">`
        + `<div class="vbox-compound-parts">${parts}</div>`
        + `<span class="vbox-word-family">ARGS</span>`
        + `</div>`;

    if (node) {
        let viBox = wordBox(node, color);
        return `<div class="vbox-pair ${extra || ""}"${depthStyle || ""}>${viBox}${argsBox}</div>`;
    }
    return `<div class="vbox-pair ${extra || ""}"${depthStyle || ""}>${argsBox}</div>`;
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
        if (i === lastIdx && part.word === "se") partGloss = SYM_ARROW + "intrans";
        else if (i === lastIdx && part.word === "sa") partGloss = SYM_ARROW + "trans";
        else if (i === lastIdx && part.word === "sai") partGloss = SYM_ARROW + "trans(pred)";
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
    if (value.repeat) parts.push("(" + rawDigits(value.repeat.value) + ")" + SYM_OVERLINE);

    let result = parts.join("") || "0";

    if (value.magn) {
        let expStr = rawDigits(value.magn.value);
        result += " " + SYM_MULTIPLY + "base" + toSuperscript(expStr);
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

function toSuperscript(s) {
    return String(s).split("").map(c => SUPERSCRIPT[c] || c).join("");
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

    let annot = annotationAttrs(node);
    let tooltip = short ? ` data-tooltip="${esc(short)}"` : "";
    return `<div class="vbox-word ${color}${elided} ${extra || ""}"${tooltip}${annot.attr}${depthStyle || ""}>`
        + annot.icon
        + `<span class="vbox-word-text">${esc(word)}</span>`
        + `<span class="vbox-word-gloss">${esc(gloss)}</span>`
        + `<span class="vbox-word-family">${esc(family)}</span>`
        + `</div>`;
}

function buildAnnotationHtml(node) {
    let parts = [];

    // DI focus prefixes
    if (node.pre) {
        for (let p of node.pre) {
            let scope = p.scope ? esc(p.scope.word) + " " : "";
            let gloss = lookupGloss(p.meta.word);
            parts.push(`<div class="vbox-popover-row">`
                + `<span class="vbox-popover-label">FOCUS</span>`
                + `<span>${scope}${esc(p.meta.word)}${gloss ? " — " + esc(gloss) : ""}</span>`
                + `</div>`);
        }
    }

    if (node.post) {
        for (let p of node.post) {
            // DE interjections
            if (p?.kind === "Interjection") {
                let tagGloss = lookupGloss(p.tag.word);
                let label = esc(p.tag.word) + (tagGloss ? " (" + esc(tagGloss) + ")" : "");
                let verbText = getWordText(p.verb);
                let verbGloss = lookupGloss(verbText);
                let siText = p.select ? esc(p.select.word) + " " : "";
                parts.push(`<div class="vbox-popover-row">`
                    + `<span class="vbox-popover-label">${label}</span>`
                    + `<span>${siText}${esc(verbText)}${verbGloss ? " — " + esc(verbGloss) : ""}</span>`
                    + `</div>`);
            }
            // DA/DAI parentheticals
            if (p?.kind === "Parenthetical") {
                parts.push(`<div class="vbox-popover-row">`
                    + `<span class="vbox-popover-label">PARENTHETICAL</span>`
                    + `</div>`
                    + `<div class="vbox-popover-parens">${renderText(p.content)}</div>`);
            }
        }
    }

    return parts.length ? parts.join("") : "";
}

// ============================================================
// Slot info computation
// ============================================================

const VOWELS = "ieaou";
const CONSONANTS = "npbfvtdszcjkglrm";

// ZI chaining overrides: null = keep verb's own slots
const ZI_SLOTS = {
    za: { trans: false, equiv: false },
    zu: { trans: false, equiv: false },
    zui: { trans: false, equiv: true },
    zue: null, ze: null,
    zoie: { trans: false, equiv: false },
    zoia: { trans: false, equiv: false },
    zoio: { trans: false, equiv: false },
    zoiu: { trans: false, equiv: false },
};

function getSlotInfo(steps) {
    return steps.map(step => {
        if (step.select) return parseSISlots(step.select.word);
        return getVerbSlots(step.verb);
    });
}

function formatChainPlace(trans, equiv) {
    let place = trans ? "A" : "E";
    return place + (equiv ? SYM_EQUIV : SYM_SHARING);
}

/** Get slot display info for a verb. Checks ZI modifiers first (hardcoded map),
 *  then falls back to verb transitivity. Returns { exposed, chainPlace }. */
function getVerbSlots(verb) {
    if (!verb) return { exposed: "*", chainPlace: "E" + SYM_SHARING };

    // Check ZI modifiers (outermost determines)
    if (verb.modifiers) {
        let mods = Array.isArray(verb.modifiers) ? verb.modifiers : [verb.modifiers];
        let outerZI = mods[0]?.modifier?.word;
        // ZI's own SI overrides
        if (mods[0]?.select) return parseSISlots(mods[0].select.word);
        // Check hardcoded ZI map
        if (outerZI && outerZI in ZI_SLOTS) {
            let override = ZI_SLOTS[outerZI];
            if (override !== null) {
                return { exposed: "*", chainPlace: formatChainPlace(override.trans, override.equiv) };
            }
        }
    }

    let { trans, equiv } = getVerbTransitivity(verb);
    return { exposed: "*", chainPlace: formatChainPlace(trans, equiv) };
}

/** Determine transitivity + equivalence for a verb node.
 *  Roots: last char vowel=trans, CCV(3 chars)/-i=equiv. Compounds: last component.
 *  MI/GI/BA/PE/KI: family-specific rules. Borrowings: same as roots. */
function getVerbTransitivity(verb) {
    if (!verb) return { trans: false, equiv: false };

    // Compound: last component determines, se/sa/sai override
    if (verb.family === "Compound") {
        let last = verb.content[verb.content.length - 1];
        let lastWord = last?.word;
        if (lastWord === "se") return { trans: false, equiv: false };
        if (lastWord === "sa") return { trans: true, equiv: false };
        if (lastWord === "sai") return { trans: true, equiv: true };
        return getVerbTransitivity(last);
    }

    // Root / Particle: derive from word form
    if (verb.family === "Root" || verb.family === "Particle") {
        return getRootTransitivity(verb.word);
    }

    // MI: dictionary
    if (verb.family === "MI") {
        let entry = dictionary[verb.word];
        return { trans: entry?.transitive || false, equiv: entry?.equivalence || false };
    }

    // GI: gi- intrans, others trans. -i after first vowel → equiv
    if (verb.family === "GI") {
        let w = verb.word;
        let intrans = w?.startsWith("gi") && (w.length === 2 || !VOWELS.includes(w[2]));
        let trans = !intrans;
        let equiv = trans && w?.endsWith("i");
        return { trans, equiv };
    }

    // BA: always sharing. h present: after h i=trans, e=intrans. No h → atom intrans.
    if (verb.family === "BA") {
        let w = verb.word;
        let hIdx = w?.indexOf("h");
        if (hIdx >= 0 && hIdx + 1 < w.length) {
            return { trans: w[hIdx + 1] === "i", equiv: false };
        }
        return { trans: false, equiv: false };
    }

    // BorrowingGroup: last item, same rule as roots
    if (verb.kind === "BorrowingGroup") {
        let last = verb.group[verb.group.length - 1];
        return getRootTransitivity(last.word || last.content);
    }

    // PE: dictionary
    if (verb.start?.family === "PE") {
        let entry = dictionary[verb.start.word];
        return { trans: entry?.transitive ?? true, equiv: false };
    }

    // KI, quotes, numbers: intrans sharing
    return { trans: false, equiv: false };
}

function getRootTransitivity(word) {
    if (!word) return { trans: false, equiv: false };
    let last = word[word.length - 1];
    let trans = VOWELS.includes(last);
    let equiv = false;
    if (trans) {
        // -i final → equiv
        if (last === "i") equiv = true;
        // CCV with single vowel (exactly 3 chars: CC+V) → equiv
        else if (word.length === 3 && CONSONANTS.includes(word[0]) && CONSONANTS.includes(word[1])) {
            equiv = true;
        }
    }
    return { trans, equiv };
}

/** Parse an SI word into slot display info. Extracts place vowels (e→E, a→A, o→O, u→U),
 *  detects transparent (si-prefix), h-override for chain place, and -i for equivalence. */
function parseSISlots(word) {
    let chars = word.slice(1); // strip 's'

    // Transparent: si + vowel(s) — still has chain place from remaining vowels
    let transparent = false;
    if (chars[0] === "i" && chars.length > 1) {
        transparent = true;
        chars = chars.slice(1); // consume the 'i', parse rest normally
    }

    let places = [], hOverride = null, hFlag = false, equiv = false;

    for (let c of chars) {
        if (c === "h") {
            hFlag = true;
        } else if (VOWELS.includes(c) && c !== "i") {
            places.push(c.toUpperCase());
            if (hFlag) { hOverride = c.toUpperCase(); hFlag = false; }
        } else if (c === "i") {
            equiv = true;
        }
    }

    if (places.length === 0) return { exposed: transparent ? "~" : "none", chainPlace: "" };

    let chainPlace = hOverride || places[places.length - 1];
    return {
        exposed: transparent ? "~" : places.join(""),
        chainPlace: chainPlace + (equiv ? SYM_EQUIV : SYM_SHARING)
    };
}

// ============================================================
// Helpers
// ============================================================

function stripChainSymbol(chainPlace) {
    return chainPlace ? chainPlace.replace(SYM_SHARING, "").replace(SYM_EQUIV, "") : "";
}

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

function getBindVowelPlaces(word) {
    let places = [];
    for (let ch of word) {
        if ('aeou'.includes(ch)) {
            places.push({ place: ch.toUpperCase(), equiv: false });
        } else if (ch === 'i' && places.length > 0) {
            places[places.length - 1].equiv = true;
        }
    }
    return places.map(p => p.place + (p.equiv ? SYM_EQUIV : SYM_SHARING));
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
    if (!word) return "";
    let entry = dictionary[word];
    if (entry) return entry.gloss || "";
    // Borrowings (u- prefix) or multi-word strings (invalid text) — no gloss
    if (word.startsWith("u") || word.includes(" ")) return "";
    // Unknown word
    return "???";
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
    if (f === "Borrowing" || node?.kind === "BorrowingGroup") return "BORROWING";
    if (f === "FFVariable") return "VAR";
    return f || "";
}

function esc(text) {
    if (!text) return "";
    return String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/** Render dictionary markup: [E:type] place notation, {word} references, `code` backticks. */
function renderMarkup(text) {
    if (!text) return "";
    return esc(String(text))
        // [E:type], [A:(pred)], [*:...] → styled place notation
        .replace(/\[(\*|[EAOU]):([^\]]*)\]/g, '<span class="mk-place"><span class="mk-place-label">$1</span>:$2</span>')
        // [FAMILY] → styled family reference (no colon)
        .replace(/\[([A-Z]+)\]/g, '<span class="mk-ref">$1</span>')
        // {word} → styled word reference
        .replace(/\{([^}]+)\}/g, '<span class="mk-word">$1</span>')
        // `code` → styled inline code
        .replace(/`([^`]+)`/g, '<code class="mk-code">$1</code>');
}

// ============================================================
// Glosses tab
// ============================================================

const EBB_ORDER = "ieaouhnnrlmpbfvtdszcjkg";

function ebbCompare(a, b) {
    let len = Math.min(a.length, b.length);
    for (let i = 0; i < len; i++) {
        let ai = EBB_ORDER.indexOf(a[i].toLowerCase());
        let bi = EBB_ORDER.indexOf(b[i].toLowerCase());
        if (ai === -1) ai = 99;
        if (bi === -1) bi = 99;
        if (ai !== bi) return ai - bi;
    }
    return a.length - b.length;
}

/** Walk parse tree and collect all word strings into a Set. */
function collectWords(obj, words) {
    if (!obj || typeof obj !== "object") return;
    words = words || new Set();

    // Compound dict key: "prefix content1 content2 ..."
    if (obj.family === "Compound" && obj.prefix && obj.content) {
        let key = obj.prefix + " " + obj.content.map(c => c.word).join(" ") + (obj.postfix ? " " + obj.postfix : "");
        words.add(key);
    }

    // Regular word
    if (typeof obj.word === "string" && obj.word) {
        words.add(obj.word);
    }

    // Recurse
    for (let val of Object.values(obj)) {
        if (Array.isArray(val)) {
            for (let item of val) collectWords(item, words);
        } else if (val && typeof val === "object") {
            collectWords(val, words);
        }
    }
    return words;
}

function renderGlosses(words) {
    let entries = [];
    for (let w of words) {
        let entry = dictionary[w];
        if (!entry) continue;
        entries.push({ word: w, family: entry.family || "", gloss: entry.gloss || "", short: entry.short || "" });
    }
    entries.sort((a, b) => ebbCompare(a.word, b.word));

    if (entries.length === 0) return "<i>No dictionary words found.</i>";

    let rows = entries.map(e =>
        `<tr>`
        + `<td class="gloss-word">${esc(e.word)}</td>`
        + `<td class="gloss-family">${esc(e.family)}</td>`
        + `<td>${renderMarkup(e.gloss)}</td>`
        + `<td class="gloss-short">${renderMarkup(e.short)}</td>`
        + `</tr>`
    ).join("");

    return `<table class="gloss-table">`
        + `<tr><th>Word</th><th>Family</th><th>Gloss</th><th>Short</th></tr>`
        + rows
        + `</table>`;
}

// ============================================================
// Parse tree viewer
// ============================================================

/** Render a JSON value as a collapsible HTML tree. Depth < 2 expanded by default. */
function renderTree(value, key, depth) {
    depth = depth || 0;
    let keyHtml = key !== undefined ? `<span class="ptree-key">${esc(String(key))}:</span> ` : "";

    if (value === null || value === undefined) {
        return `<div class="ptree-node">${keyHtml}<span class="ptree-null">${value === null ? "null" : "undefined"}</span></div>`;
    }
    if (typeof value === "string") {
        return `<div class="ptree-node">${keyHtml}<span class="ptree-str">"${esc(value)}"</span></div>`;
    }
    if (typeof value === "number") {
        return `<div class="ptree-node">${keyHtml}<span class="ptree-num">${value}</span></div>`;
    }
    if (typeof value === "boolean") {
        return `<div class="ptree-node">${keyHtml}<span class="ptree-bool">${value}</span></div>`;
    }

    let isArr = Array.isArray(value);
    let entries = isArr ? value.map((v, i) => [i, v]) : Object.entries(value);
    if (entries.length === 0) {
        return `<div class="ptree-node">${keyHtml}<span class="ptree-bracket">${isArr ? "[]" : "{}"}</span></div>`;
    }

    let expanded = true;
    let arrow = expanded ? "\u25BC" : "\u25B6";
    let display = expanded ? "" : ' style="display:none"';

    // Preview for collapsed state
    let preview;
    if (isArr) {
        preview = `[${entries.length} item${entries.length > 1 ? "s" : ""}]`;
    } else {
        let keys = entries.slice(0, 3).map(([k]) => k);
        preview = "{" + keys.join(", ") + (entries.length > 3 ? ", ..." : "") + "}";
    }

    let childrenHtml = entries.map(([k, v]) => renderTree(v, k, depth + 1)).join("");
    let bracket = isArr ? ["[", "]"] : ["{", "}"];

    return `<div class="ptree-node">`
        + `<span class="ptree-toggle">${arrow}</span>`
        + keyHtml
        + `<span class="ptree-preview">${esc(preview)}</span>`
        + `<div class="ptree-children"${display}>`
        + childrenHtml
        + `<span class="ptree-bracket">${bracket[1]}</span>`
        + `</div>`
        + `</div>`;
}

function setupTreeToggles() {
    $('#parse-result-tree').off('click.ptree').on('click.ptree', '.ptree-toggle', function () {
        let node = this.parentElement;
        let children = node.querySelector('.ptree-children');
        if (!children) return;
        let collapsed = children.style.display === "none";
        children.style.display = collapsed ? "" : "none";
        this.textContent = collapsed ? "\u25BC" : "\u25B6";
    });
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
            tooltipEl.innerHTML = renderMarkup(target.getAttribute('data-tooltip'));
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

// ============================================================
// Annotation popovers
// ============================================================

let popoverEl = null;
let popoverTimeout = null;

function setupAnnotationPopovers() {
    if (!popoverEl) {
        popoverEl = document.createElement("div");
        popoverEl.className = "vbox-popover";
        popoverEl.style.display = "none";
        document.body.appendChild(popoverEl);

        // Keep popover open while hovering it
        popoverEl.addEventListener("mouseenter", () => {
            clearTimeout(popoverTimeout);
        });
        popoverEl.addEventListener("mouseleave", () => {
            popoverTimeout = setTimeout(() => {
                popoverEl.style.display = "none";
            }, 200);
        });
    }

    $('#parse-result-boxes').off('.vbox-annot');

    $('#parse-result-boxes').on('mouseenter.vbox-annot', '.vbox-annot-icon', function (e) {
        clearTimeout(popoverTimeout);
        let annotEl = this.closest('[data-annotation-id]');
        if (!annotEl) return;
        let id = annotEl.getAttribute('data-annotation-id');
        if (!(id in annotationStore)) return;

        popoverEl.innerHTML = annotationStore[id];
        popoverEl.style.display = "block";

        // Position above the icon
        let rect = this.getBoundingClientRect();
        let popW = popoverEl.offsetWidth;
        let popH = popoverEl.offsetHeight;
        let x = rect.left + rect.width / 2 - popW / 2;
        let y = rect.top - popH - 6;

        // Keep on screen
        if (x < 8) x = 8;
        if (x + popW > window.innerWidth - 8) x = window.innerWidth - popW - 8;
        if (y < 8) y = rect.bottom + 6; // flip below if no room above

        popoverEl.style.left = x + "px";
        popoverEl.style.top = y + "px";
    });

    $('#parse-result-boxes').on('mouseleave.vbox-annot', '.vbox-annot-icon', function () {
        popoverTimeout = setTimeout(() => {
            popoverEl.style.display = "none";
        }, 200);
    });
}

