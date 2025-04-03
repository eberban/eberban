import { is_array } from "../scripts/utils";
import { markup_block, markup_inline } from "./markup";

function Word({ word, is_compound }) {
    if (!word) {
        return null;
    }
    const Formatted_Word = () => {
        if (!is_compound) {
            return <>{word}</>
        }
        return word.split(" ").map((part, index) => {
            let rendered_part;
            if (["i", "e", "u"].includes(part[0])) {
                rendered_part = part;
            } else {
                rendered_part = <a href={`#${part}`}>{part}</a>;
            }
            return (
                <>
                    {rendered_part}
                    {index < word.length - 1 ? " " : null}
                </>
            );
        });
    };
    return <span class="word"><Formatted_Word /></span>;
}

function Family({ family }) {
    return <a href={`#@${family}`} class="family">{family}</a>;
}

function Gloss({ gloss }) {
    return <i>{gloss}</i>;
}

function Short({ short }) {
    return <p>{markup_inline(short)}</p>;
}

function Notes({ notes }) {
    if (!notes) {
        return null;
    }
    return <><strong>Notes: </strong>{markup_block(notes)}</>;
}

function See_Also({ see_also }) {
    if (!(is_array(see_also)) || see_also.length === 0) {
        return null;
    }
    return (
        <p class="see-also">
            <strong>See also :</strong>
            {" "}
            {see_also.map((other_entry, index) => {
                return (
                    <>
                        <a href={`#${other_entry}`}>{other_entry}</a>
                        {index < see_also.length - 1 ? ", " : null}
                    </>
                );
            })}
        </p>
    );
}

function Tags({ tags }) {
    if (!(is_array(tags)) || tags.length === 0) {
        return null;
    }
    const extra_class = (tag) => {
        return {
            transitive: "btn-info",
            core: "btn-success",
        }[tag] ?? ""
    };
    return (
        <div>
            <strong>Tags : </strong>
            {tags.map((tag) =>
                <>
                    <a href={`##${tag}`} class={`btn btn-mini ${extra_class(tag)}`}>
                        {tag}
                    </a>
                    {" "}
                </>
            )}
        </div>
    );
}

function Links({ links }) {
    if (!(is_array(links)) || links.length === 0) {
        return null;
    }
    return (
        <>
            <strong>Links :</strong>
            <ul class="entry-links">
                {links.map(([icon_class, link_name, href]) => {
                    return (
                        <li>
                            <a href={href}>
                                <i class={icon_class} aria-hidden="true"></i>
                                {" "}
                                {link_name}
                            </a>
                        </li>
                    );
                })}
            </ul>
        </>
    );
}

function Definition({ definition }) {
    if (!definition) {
        return null;
    }
    return (
        <details>
            <summary><strong>Definition :</strong></summary>
            <pre>{definition}</pre>
        </details>
    );
}

function Permalink({ id }) {
    return (
        <p data-tooltip="Link with a unique ID that will remain the same even if the Eberban word changes">
            <strong><a href={`#${id}`}>Permalink</a></strong>
        </p>
    );
}

export default function Entry(props) {
    return (
        <details class={`dictionary-entry ${props.extra_css_class ?? ""}`}>
            <summary>
                <Word word={props.word} is_compound={props.family === "C"} />
                <Family family={props.family} />
                <span class="short">
                    <Gloss gloss={props.gloss} />
                    <Short short={props.short} />
                </span>
            </summary>
            <div class="dictionary-details">
                    <Notes notes={props.notes} />
                    <See_Also see_also={props.see_also} />
                    <Tags tags={props.tags} />
                    <Links links={props.links} />
                    <Definition definition={props.definition} />
                    <Permalink id={props.id} />
            </div>
        </details>
    );
}
