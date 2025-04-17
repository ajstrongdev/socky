import { NextRequest, NextResponse } from 'next/server';
import pool from '@/app/lib/db';

export async function POST(req: NextRequest) {
    try {
        const { room_id, user_id } = await req.json();
        if (!room_id || !user_id) {
            return NextResponse.json({ error: 'Room ID and User ID are required' }, { status: 400 });
        }
        const [result] = await pool.execute(
            "INSERT INTO RoomMembers (room_id, user_id) VALUES (?, ?)",
            [room_id, user_id]
        );
        return NextResponse.json({ message: "User added to room successfully" }, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}