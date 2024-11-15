import { NextResponse, NextRequest } from 'next/server';

export async function GET(req : NextRequest) {

    return NextResponse.json({ message: req });
}

export async function POST(request: NextRequest) {
    const { name } = await request.json();
    return NextResponse.json({ message: `Hello, ${name}!` });
}