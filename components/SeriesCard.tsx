import Image from "next/image";
import Link from "next/link";

function replaceWhitespaceWithUnderscore(title : string) {
    return title.replaceAll(" ", "_");
}

export default function SeriesCard({title, poster} : {title: string, poster: string}) {
    const seriesLink = "/anime/" + replaceWhitespaceWithUnderscore(title);

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