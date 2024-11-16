'use client';
async function handleSubmit(data) {
    console.log(JSON.stringify(data));
    try {
      const response = await fetch("/api/torrent/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            torrentLink: data,
          }), 
      });

      if (!response.ok) {
        throw new Error("Failed to send POST request");
      }

      const result = await response.json();
      console.log("Server response:", result);
    } catch (error) {
      console.error("Error:", error);
    };
}


export function TorrentCard({torrent} : {torrent : Torrent}) {

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
                    <button onClick={() => handleSubmit(torrent.Link)}>
                        <img src="/download.svg" alt="Download"></img>
                    </button>
                </div>
            </td>
        </tr>
    )

}