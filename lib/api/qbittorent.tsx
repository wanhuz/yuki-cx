import { QBittorrent } from '@ctrl/qbittorrent';

const client = new QBittorrent({
  baseUrl: '',
  username: '',
  password: '',
});

async function getBase64FromTorrentURL(url : string) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.statusText}`);
      }
  
      const arrayBuffer = await response.arrayBuffer();

      const buffer = Buffer.from(arrayBuffer);

      const base64String = buffer.toString("base64");
  
      return base64String;
    } catch (error) {
        console.error(`Error fetching and converting .torrent file:`, error);
        throw error;
    }
  }

export async function addTorrent(url : string) {
    const base64Torrent = await getBase64FromTorrentURL(url)
    const status = await client.addTorrent(base64Torrent);

    if (status)
        return 200
    return 500
}