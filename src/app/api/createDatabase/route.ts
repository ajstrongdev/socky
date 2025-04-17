import { NextRequest, NextResponse } from 'next/server';
import openPool from '@/app/lib/no-db';
import { getPool } from '@/app/lib/db';

export async function GET(_req: NextRequest) {
      try {
        // Create database, drop if exists
        await openPool.execute("DROP DATABASE IF EXISTS socky");
        await openPool.execute("CREATE DATABASE socky");
    
        const pool = getPool();
    
        // Create tables
        await pool.execute(`
            CREATE TABLE IF NOT EXISTS Users (
              user_id INT PRIMARY KEY AUTO_INCREMENT,
              email VARCHAR(255) NOT NULL,
              username VARCHAR(255) NOT NULL
            );
          `);
    
        // Just for development, delete for final version
        await pool.execute(`
            INSERT INTO Users (email, username) VALUES ("ajstrongdev@proton.me", "ajstrong");
          `);
    
        await pool.execute(`
            CREATE TABLE IF NOT EXISTS Messages (
              message_id INT PRIMARY KEY AUTO_INCREMENT,
              user_id INT NOT NULL,
              message TEXT NOT NULL,
              timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              FOREIGN KEY (user_id) REFERENCES Users(user_id)
            );
          `)
    
        await pool.execute(`
            CREATE TABLE IF NOT EXISTS Rooms (
              room_id INT PRIMARY KEY AUTO_INCREMENT,
              room_name VARCHAR(255) NOT NULL,
              owner INT NOT NULL,
              FOREIGN KEY (owner) REFERENCES Users(user_id)
            );
          `);
    
        await pool.execute(`
            CREATE TABLE IF NOT EXISTS RoomMembers (
              room_id INT NOT NULL,
              user_id INT NOT NULL,
              PRIMARY KEY (room_id, user_id),
              FOREIGN KEY (room_id) REFERENCES Rooms(room_id),
              FOREIGN KEY (user_id) REFERENCES Users(user_id)
            );
          `);
        return NextResponse.json({ message: 'Database and tables created successfully' });
      }
      catch (error:any) {
        console.error('Error creating database or tables:', error);
        return NextResponse.json({ error: 'Error creating database or tables' }, { status: 500 });
      }
    
}