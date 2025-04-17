import { NextRequest, NextResponse } from "next/server";
import pool from "@/app/lib/db";

export async function GET(_req: NextRequest) {
    try {
        const [rooms] = await pool.execute("SELECT * FROM Rooms");
        return NextResponse.json(rooms);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}