import {NextRequest, NextResponse } from "next/server";
import pool from "@/app/lib/db";

export async function POST(req: NextRequest) {
    const { room_id, user_id } = await req.json();
    if (!room_id || !user_id) {
        console.error("No RoomID/UserID provided.")
    }
    try {
        await pool.query("DELETE FROM Invites WHERE room_id = ? AND user_id = ?", [room_id, user_id]);
        return NextResponse.json({message: "Successfully deleted room"}, {status: 200})
    } catch (error) {
        console.error(error);
        return NextResponse.json({message: "Error getting room invites"}, {status: 500})
    }
}