import { NextRequest, NextResponse } from "next/server";
import pool from "@/app/lib/db";
import type { RowDataPacket } from "mysql2/promise";

type MessageRow = { message:string } & RowDataPacket;

export async function POST(req: NextRequest) {
    try {
        const { room_id } = await req.json();
        const [messages] = await pool.execute<MessageRow[]>("SELECT message FROM Messages WHERE room_id = ?", [room_id]);
        return NextResponse.json(messages.map((message) => message.message));
    } catch (error) {
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}