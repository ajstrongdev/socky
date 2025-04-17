import { NextRequest, NextResponse } from 'next/server';
import pool from '@/app/lib/db';
import { RowDataPacket } from 'mysql2/promise';

export async function POST(req: NextRequest) {
    try {
        const { room_name, owner, global } = await req.json();
        if (!room_name || !owner) {
            return NextResponse.json({ error: 'Room name and owner are required' }, { status: 400 });
        }
        const [result] = await pool.execute<RowDataPacket[]>(
            'INSERT INTO Rooms (room_name, owner, global) VALUES (?, ?, ?)',
            [room_name, owner, global]
        );
        return NextResponse.json({message: "Room created successfully"});
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}