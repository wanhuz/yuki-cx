import { NextResponse} from 'next/server';
import { addTorrent } from "@/lib/api/qbittorent";
import { getQBClientSettings } from '@/lib/api/settings';


export async function POST(request: Request) {
    const body = await request.json();
    const { torrentLink } = body;

    if (!torrentLink) {
        return NextResponse.json({ error: 'Missing parameters torrent link' }, { status: 400 });
    }

    const qbSettings = await getQBClientSettings();
    let status = 0;

    if (!torrentLink.includes("animebytes")) {
        return NextResponse.json({ error: 'Invalid torrent link' }, { status: 403 });
    }

    status = await addTorrent(torrentLink, 
        qbSettings.qb_url || "", 
        qbSettings.qb_port || 0, 
        qbSettings.qb_username || "", 
        qbSettings.qb_password || "", 
        qbSettings.qb_pause_torrent || false, 
        qbSettings.qb_default_label || ""
    );
    
    return NextResponse.json({
        status: {status},
    });
}