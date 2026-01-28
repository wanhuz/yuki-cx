export function generateSeriesLink(title : string, id : number) {
    return "/anime/" + encodeURIComponent(title) + "?id=" + id;
}

export function generateTagLabel(type : string) {
    let style = "inline-block px-2 text-xxs  text-white  rounded-full "
    
    switch(type) {
        case "TV Series":
            style += "bg-blue-500";
            break;
        case "Movie":
            style += "bg-green-500";
            break;
        case "TV Special":
            style += "bg-purple-500";
            break;
        case "OVA":
            style += "bg-orange-500";
            break;
        case "Airing":
            style += "bg-pink-500";
            break;
        default:
            style += "bg-gray-500";
    }

    return (<span className={style}>{type}</span>);
}