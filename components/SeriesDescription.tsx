import jsdom from "jsdom";
const { JSDOM } = jsdom;

function stripHTML(html : string) : string{
    const dom = new JSDOM(html);
    return dom.window.document.body.textContent || "";
 }

export default function SeriesDescription({description} : {description : string}) {
    return (
        <div className="flex flex-col mt-8">
            <b>Synopsis</b>
            <hr></hr>
            <span className="mt-3 text-sm">
                {stripHTML(description)}
            </span>
        </div>
    );
}