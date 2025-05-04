import { TorrentCard } from "./TorrentCard";

function createTorrentRow(torrents_data : Torrent[]) {
    return (
        torrents_data.map((entry, key) => (
            <TorrentCard torrent={entry} key={key} />
        ))
    );
}

export default function TorrentTable({torrent_data, isOngoing} : {torrent_data : Torrent[], isOngoing : boolean}) {
    return (
        <div className="flex flex-col mt-10 sm:px-4 lg:px-4">
        <b>Downloads</b>
        <hr />
        <div className="overflow-x-auto">
            <table className="bg-sky-500 py-3 mt-3 text-sm w-full">
                <thead>
                <tr className="text-white font-bold text-xs sm:text-md text-center">
                    <td className="py-3 hidden sm:table-cell ">Source</td>
                    <td className="py-3 sm:py-0 sm:ps-4 text-center sm:text-start ">Name</td>
                    {isOngoing ? <td>Episode</td> : null}
                    <td className="hidden sm:table-cell text-start sm:hidden lg:table-cell">Codec</td>
                    <td className="hidden sm:table-cell">Resolution</td>
                    <td>Size</td>
                    <td className="hidden sm:table-cell">Subtitle</td>
                    <td className="hidden sm:table-cell">Extension</td>
                    <td className="px-3 sm:px-0">Seeders</td>
                    <td className="hidden sm:table-cell">Leechers</td>
                    <td className="pe-2 sm:px-0 sm:hidden lg:table-cell">Action</td>
                </tr>
            </thead>
            <tbody>
                {createTorrentRow(torrent_data)}
            </tbody>
        </table>
        </div>
    </div>
    )
}