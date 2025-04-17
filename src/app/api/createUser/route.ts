import { NextRequest, NextResponse } from "next/server";
import pool from "@/app/lib/db";
import type { ResultSetHeader } from "mysql2/promise";

export async function POST(req: NextRequest) {
  try {
    const { email, username } = await req.json();

    const [result] = await pool.execute<ResultSetHeader>(
      "INSERT INTO Users (email, username) VALUES (?, ?)",
      [email, username]
    );
    return NextResponse.json({
      message: "User created",
      user_id: result.insertId,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
