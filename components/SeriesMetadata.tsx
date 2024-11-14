
export default function SeriesMetadata({series} : {series : Anime}) {
    console.log(series);
    const altName = (series.AlternativeName || []).map((name, index) => (
        <li key={index}>{name}</li>
    ));

    const links = series.Links.map((link, index) => (
        <li key={index}>{link}</li>
    ));

    const tags = series.Tags.map((tag, index) => (
        index === series.Tags.length - 1 ? 
            <span key={index}>{tag} </span> :
        <span key={index}>{tag}, </span>
    ));

    return (
        <div className="sm:max-w-64 overflow-hidden" >
            <div id="title">
                <b>Alternative Title</b>
                <hr></hr>
                <ul className="mt-3 text-sm  text-wrap">
                    {series.AlternativeName.length ? altName : " "}
                </ul>
            </div>
            <div id="information" className="my-4">
                <b>Information</b>
                <hr></hr>
                <ul className="text-sm flex flex-col gap-1 mt-3 text-wrap">
                    <li><b>Type:</b> {series.Type}</li>
                    <li><b>Episodes:</b> {series.Episode}</li>
                    <li><b>Aired:</b> {series.Aired}</li>
                    <li><b>Tags:</b> {tags? tags : ""}</li>
                </ul>
                <ul className="text-sm flex flex-col gap-1 text-wrap">
                    <b>Links:</b> {links? links : ""}
                </ul>
            </div>
        </div>
    );
  }