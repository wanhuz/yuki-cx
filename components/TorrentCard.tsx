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


export function TorrentCard({torrent} : {torrent : Torrent}) {
    const [downloadIcon, setDownloadIcon] = useState("/download.svg");

    return (
        <tr className="drop-shadow-sm border-gray-100 border-2 bg-white hover:bg-gray-50 px-10 text-gray-600">
            <td className="hidden sm:table-cell py-5 px-5">{torrent.Group}</td>
            <td className="py-5 px-5 table-cell sm:hidden">{torrent.Property}</td>
            <td className="hidden sm:table-cell">{torrent.Resolution}</td>
            <td className="hidden sm:table-cell">{torrent.Codec}</td>
            <td className="hidden sm:table-cell">{torrent.Extension}</td>
            <td className="hidden sm:table-cell">{torrent.Size}</td>
            <td className="hidden sm:table-cell">{torrent.Subtitle}</td>
            <td className="hidden sm:table-cell"><span className="mx-5">{torrent.Seeders}</span></td>
            <td className="hidden sm:table-cell"><span className="mx-5">{torrent.Leechers}</span></td>
            <td className="table-cell sm:hidden">
                <span className="mx-5">{torrent.Seeders}</span><br></br>
                <span className="mx-5">{torrent.Leechers}</span>
            </td>
            <td>
                <div className="text-white text-lg font-bold mx-5" >
                    <button onClick={() => handleSubmit(torrent.Link, setDownloadIcon)}>
                        <Image src={downloadIcon} alt="Download" width={25} height={25}></Image>
                    </button>
                </div>
            </td>
        </tr>
    )

}