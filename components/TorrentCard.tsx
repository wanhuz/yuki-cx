'use client';

import { useState } from "react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Image from "next/image";


async function handleSubmit(torrentUrl: string, setDownloadIcon: (iconUrl: string) => void) {
    try {
        setDownloadIcon("/spinner.svg");

        const response = await fetch("/api/torrent/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                torrentLink: torrentUrl,
            }),
        });

        if (!response.ok) {
            toast.error("Failed to send POST request", {position: "bottom-right"})
            console.error("Failed to send POST request");
        }

        const result = await response.json();
        console.log(result);
        toast.success("Successfully added torrent!", {position: "bottom-right"})
    } catch (error) {
        console.error("Error:", error);
        toast.error("Error: " + error, {position: "bottom-right"})
    } finally {
        setDownloadIcon("/download.svg");
    }
}

function getReleaseIcon(type : string) {
    const size = 20;
    const irregularSize = 25;
    const iconClass = "mx-auto";

    switch (type) {
        case "TV":
            return (<Image className={iconClass} src="/tv.png" width={size} height={size} alt="TV release"></Image>);
        case "Web":
            return (<Image className={iconClass} src="/web.png" width={size} height={size} alt="Web release"></Image>);
        case "DVD":
            return (<Image className={iconClass} src="/dvd.png" width={size} height={size} alt="DVD release"></Image>);
        case "Blu-ray":
            return (<Image className={iconClass} src="/blu-ray.png" width={size} height={size} alt="Blu-ray release"></Image>);
        case "DVD5":
            return (<Image className={iconClass} src="/dvd5.png" width={irregularSize} height={size} alt="Blu-ray release"></Image>);
        case "DVD9":
            return (<Image className={iconClass} src="/dvd9.png" width={irregularSize} height={size} alt="Blu-ray release"></Image>);
        default:
            return <></>
    }

}


export function TorrentCard({torrent} : {torrent : Torrent}) {
    const [downloadIcon, setDownloadIcon] = useState("/download.svg");

    return (
        <tr className="drop-shadow-sm border-gray-100 border-2 bg-white hover:bg-gray-50 text-gray-600 text-center">
            <td className="hidden sm:table-cell py-5">{getReleaseIcon(torrent.Release)}</td>
            <td className="hidden sm:table-cell text-start ps-4">{torrent.Group}</td>
            <td className="py-5 px-5 text-xs table-cell sm:hidden text-start">{torrent.Property}</td>
            {torrent.EpisodeNo? <td>{torrent.EpisodeNo}</td> : null}
            <td className="hidden sm:table-cell text-start">{torrent.Codec}</td>
            <td className="hidden sm:table-cell">{torrent.Resolution}</td>
            <td className="hidden sm:table-cell">{torrent.Size}</td>
            <td className="hidden sm:table-cell">{torrent.Subtitle}</td>
            <td className="hidden sm:table-cell">{torrent.Extension}</td>
            <td className="text-xs sm:text-sm text-seeders font-semibold"><span className="">{torrent.Seeders}</span></td>
            <td className="hidden sm:table-cell text-leechers font-semibold"><span className="">{torrent.Leechers}</span></td>
            <td>
                <div className="text-white text-lg font-bold" >
                    <button onClick={() => handleSubmit(torrent.Link, setDownloadIcon)}>
                        <Image src={downloadIcon} alt="Download" width={25} height={25}></Image>
                    </button>
                </div>
            </td>
        </tr>
    )

}