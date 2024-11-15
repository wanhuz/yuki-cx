import { NextResponse} from 'next/server';
import { addTorrent } from "@/lib/api/qbittorent";


export async function POST(request: Request) {
    const body = await request.json();
    const { torrentLink } = body;

    if (!torrentLink) {
        return NextResponse.json({ error: 'Missing parameters torrent link' }, { status: 400 });
    }
    const status = await addTorrent(torrentLink);

    return NextResponse.json({
        status: {status},
    });
}