import { NextRequest, NextResponse } from 'next/server';
import pool from '@/app/lib/db';
import type { RowDataPacket, ResultSetHeader } from 'mysql2/promise';

type UserResult = { user_id: number } & RowDataPacket;

export async function POST(req: NextRequest) {
    try {
        const { email, messageBody } = await req.json();
        // Get userid from email
        const [userRows] = await pool.query<UserResult[]>(
            `SELECT user_id FROM Users WHERE email = ?`,
            [email]
        );
        const userId = userRows[0]?.user_id;
        if (!userId) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }
        // Insert 
        const [result] = await pool.execute<ResultSetHeader>(
            "INSERT INTO Messages (user_id, message) VALUES (?, ?)", [userId, messageBody]
        );
        return NextResponse.json({ message: "Message sent", message_id: result.insertId });
    } catch (error) {
        console.error("Error in POST /api/onMessage:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}