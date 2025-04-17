import { NextRequest, NextResponse } from 'next/server';
import openPool from '@/app/lib/no-db';
import type { RowDataPacket } from 'mysql2/promise';

type DatabaseExistsResult = { DatabaseExists: number } & RowDataPacket;

export async function GET(_req: NextRequest) {
  try {
    const [rows] = await openPool.execute<DatabaseExistsResult[]>(`
      SELECT COUNT(*) AS DatabaseExists
      FROM INFORMATION_SCHEMA.SCHEMATA
      WHERE SCHEMA_NAME = 'socky';
    `);

    const exists = rows[0]?.DatabaseExists > 0;

    if (exists) {
      return NextResponse.json({ message: 'Database exists' });
    } else {
      return NextResponse.json({ message: 'Database does not exist' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error checking database existence:', error);
    return NextResponse.json({ error: 'Database does not exist' }, { status: 500 });
  }
}
