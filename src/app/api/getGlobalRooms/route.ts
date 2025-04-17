import { NextRequest, NextResponse } from "next/server";
import pool from "@/app/lib/db";

export async function POST(req: NextRequest) {
    try {
        const { user_id } = await req.json();
        if (!user_id) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }
        const rooms = await pool.query(
            "SELECT * FROM Rooms WHERE global = 1 AND room_id NOT IN (SELECT room_id FROM RoomMembers WHERE user_id = ?)",
            [user_id]
        );
        return NextResponse.json(rooms[0]);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}