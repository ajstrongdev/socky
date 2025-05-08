import {NextRequest, NextResponse } from "next/server";
import pool from "@/app/lib/db";

export async function POST(req: NextRequest) {
    const { user_id } = await req.json();
    if (!user_id) {
        console.error("No UserID provided.")
    }
    try {
        const invites = await pool.query("SELECT * FROM Rooms WHERE room_id IN (SELECT room_id FROM Invites WHERE user_id = ?)", [user_id]);
        return NextResponse.json(invites[0]);
    } catch (error) {
        console.error(error);
        return NextResponse.json({message: "Error getting room invites"}, {status: 500})
    }
}