
export function TorrentCard({torrent} : {torrent : Torrent}) {

    return (
        <tr className="drop-shadow-sm border-gray-100 border-2 bg-white hover:bg-gray-50 px-10 text-gray-600">
            <td className="py-5 px-5">{torrent.Group}</td>
            <td>{torrent.Resolution}</td>
            <td>{torrent.Codec}</td>
            <td>{torrent.Extension}</td>
            <td>{torrent.Size}</td>
            <td>{torrent.Subtitle}</td>
            <td><span className="mx-5">{torrent.Seeders}</span></td>
            <td><span className="mx-5">{torrent.Leechers}</span></td>
            <td>
                <div className="text-white text-lg font-bold mx-5">
                    <a href={torrent.Link}>
                        <img src="/download.svg" alt="Download"></img>
                    </a>
                </div>
            </td>
        </tr>
    )

}