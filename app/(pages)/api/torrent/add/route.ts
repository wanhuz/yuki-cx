import { NextResponse} from 'next/server';
import { addTorrent } from "@/lib/api/qbittorent";
import { addToLog, getQBClientSettings } from '@/lib/api/settings';


export async function POST(request: Request) {
    const body = await request.json();
    const { torrentLink, torrentName } = body;

    if (!torrentLink) {
        return NextResponse.json({ error: 'Missing parameters torrent link' }, { status: 400 });
    }

    const qbSettings = await getQBClientSettings();

    if (!torrentLink.includes("animebytes")) {
        return NextResponse.json({ error: 'Invalid torrent link' }, { status: 403 });
    }

    const status = await addTorrent(
        torrentLink, 
        qbSettings.connection.url, 
        qbSettings.connection.port, 
        qbSettings.connection.username, 
        qbSettings.connection.password, 
        qbSettings.add.manual.pauseTorrent , 
        qbSettings.add.manual.label,
        torrentName,
        addToLog
    );
    
    
    return NextResponse.json(status);
}