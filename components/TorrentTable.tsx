import { TorrentCard } from "./TorrentCard";

function createTorrentRow(torrents_data : Torrent[]) {
    return (
        torrents_data.map((entry, key) => (
            <TorrentCard torrent={entry} key={key} />
        ))
    );
}

export default function TorrentTable({torrent_data} : {torrent_data : Torrent[]}) {
    return (
        <div className="flex flex-col mt-10">
        <b>Downloads</b>
        <hr />
        <table className="bg-sky-500 py-3 mt-3 text-sm">
            <thead>
                <tr className="text-white text-start  font-bold">
                    <td className="py-3 px-5">Release</td>
                    <td>Name</td>
                    <td className="hidden sm:table-cell">Codec</td>
                    <td className="hidden sm:table-cell">Resolution</td>
                    <td className="hidden sm:table-cell">Size</td>
                    <td className="hidden sm:table-cell">Subtitle</td>
                    <td className="hidden sm:table-cell">Extension</td>
                    <td className="hidden sm:table-cell">Seeders</td>
                    <td className="hidden sm:table-cell">Leechers</td>
                    <td className="table-cell sm:hidden">Health</td>
                    <td>Downloads</td>
                </tr>
            </thead>
            <tbody>
                {createTorrentRow(torrent_data)}
            </tbody>
        </table>
    </div>
    )
}