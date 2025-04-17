import { NextRequest, NextResponse } from "next/server";
import pool from "@/app/lib/db";
import type { RowDataPacket } from "mysql2/promise";

type UserRow = { username: string } & RowDataPacket;

export async function POST(req: NextRequest) {
    const { email } = await req.json();
    try {
        const [rows] = await pool.query<UserRow[]>(
            `SELECT * FROM Users WHERE email = ?`,
            [email]
        );
        return NextResponse.json(rows[0]);
    } catch (error) {
        console.error("Error fetching username:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}