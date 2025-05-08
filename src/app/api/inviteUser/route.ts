import { NextRequest, NextResponse } from "next/server";
import pool from "@/app/lib/db";

export async function POST(req: NextRequest) {
  try {
    const {user_id, room_id} = await req.json();
    if (!user_id || !room_id) {
      return NextResponse.json({error: "Room or UserID is required"}, {status: 500})
    }
    const [result] = await pool.execute(
      "INSERT INTO Invites (user_id, room_id) VALUES (?, ?)", [user_id, room_id]
      );
      return NextResponse.json({message: "User invited successfully"}, {status: 200})
  } catch (error) {
    console.error(error);
    return NextResponse.json({error: "Internal server error"}, {status: 500})
  }
}
