import Image from "next/image";
import Link from "next/link";

function generateSeriesLink(title : string, id : number) {
    return "/anime/" + encodeURIComponent(title) + "?id=" + id;
}

export default function SeriesCard({title, poster, id} : {title: string, poster: string, id : number}) {
    const seriesLink = generateSeriesLink(title, id);

    return (
        <Link href={seriesLink}>
            <div className="max-w-xs overflow-hidden" >
                <Image className="w-32 h-48 object-cover rounded-md" src={poster} alt={title} width={160} height={180}></Image>
                <div className=" py-4">
                    <div className="mb-2 text-sm w-32">{title}</div>
                </div>
            </div>
        </Link>
    );
  }