import { NextRequest, NextResponse } from "next/server";
import pool from "@/app/lib/db";
import type { RowDataPacket } from "mysql2/promise";

type MessageRow = { message:string } & RowDataPacket;

export async function GET(_req: NextRequest) {
    try {
        const [messages] = await pool.execute<MessageRow[]>("SELECT message FROM Messages");
        return NextResponse.json(messages.map((message) => message.message));
    } catch (error) {
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}