'use client';

import {useState } from "react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Image from "next/image";
import ExpandableTableRow from "./ExpandableTableRow";


async function handleSubmit(torrentUrl: string, torrentFileList: FileData[], setDownloadIcon: (iconUrl: string) => void) {
    try {
        setDownloadIcon("/spinner.svg");

        const fileNameArray = torrentFileList.map(item => item.filename);

        const response = await fetch("/api/torrent/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                torrentLink: torrentUrl,
                torrentName: fileNameArray,
            }),
        });

        if (!response.ok) {
            toast.error("Failed to send POST request " + response.statusText, {position: "bottom-right"})

            console.error("Failed to send POST request" + response.statusText);

            return;
        }

        let result;

        try {
            result = await response.json();
        } catch {
            toast.error("Invalid server response", { position: "bottom-right" });

            console.error("Response was not valid JSON");

            return;
        }

        if (!result.ok) {
            console.log("ERRORR HERE: " + result.error);
            toast.error(
                result.error ? `Failed to add torrent: ${result.error}` : "Failed to add torrent",
                { position: "bottom-right" }
            );

            console.log("Failed to Add Torrent " + result.error);

            return;
        }

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
    const [isExpandRow, setIsExpandRow] = useState(false);

    const toggleRow = () => {
        setIsExpandRow(!isExpandRow);
    }

    return (
        <>
        <tr className="cursor-pointer drop-shadow-sm border-gray-100 border-2 bg-white hover:bg-gray-50 text-gray-600 text-center" onClick={toggleRow}>
            <td className="hidden sm:table-cell py-5">{getReleaseIcon(torrent.Source)}</td>
            <td className="hidden sm:table-cell text-start ps-4">{torrent.Group}</td>
            <td className="table-cell sm:hidden py-5 px-5 text-xs  text-start ">{torrent.Property}</td>
            {torrent.EpisodeNo? <td>{torrent.EpisodeNo}</td> : null}
            <td className="hidden sm:table-cell text-start sm:hidden lg:table-cell">{torrent.Codec}</td>
            <td className="hidden sm:table-cell">{torrent.Resolution}</td>
            <td className="text-xs">{torrent.Size}</td>
            <td className="hidden sm:table-cell">{torrent.Subtitle}</td>
            <td className="hidden sm:table-cell">{torrent.Extension}</td>
            <td className="text-xs sm:text-sm text-seeders font-semibold"><span className="">{torrent.Seeders}</span></td>
            <td className="hidden sm:table-cell text-leechers font-semibold"><span className="">{torrent.Leechers}</span></td>
            <td>
                <div className="text-white text-lg font-bold" >
                    <button onClick={(e) => {
                        e.preventDefault();
                        handleSubmit(torrent.Link, torrent.FileList || [], setDownloadIcon)
                    }}>
                        <Image src={downloadIcon} alt="Download" width={25} height={25}></Image>
                    </button>
                </div>
            </td>
            <td></td>
        </tr>


        <ExpandableTableRow FileList={torrent?.FileList} isExpandRow={isExpandRow} />

        </>
    )

}