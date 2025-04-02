import express from "express";
import openPool from '../no-db.js';
import { getPool } from '../db.js';

const router = express.Router();

// Create database
router.get("/create", async (req, res, next) => {
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
      CREATE TABLE IF NOT EXISTS Rooms (
        room_id INT PRIMARY KEY AUTO_INCREMENT,
        room_name VARCHAR(255) NOT NULL,
        owner INT NOT NULL,
        global TINYINT(1) DEFAULT 0,
        FOREIGN KEY (owner) REFERENCES Users(user_id)
      );
    `);

    // More for development
    await pool.execute(`
        INSERT INTO Rooms (room_name, owner, global) VALUES ("General", 1, 1), ("Memes", 1, 0);
      `);

    await pool.execute(`
        CREATE TABLE IF NOT EXISTS Messages (
          message_id INT PRIMARY KEY AUTO_INCREMENT,
          user_id INT NOT NULL,
          message TEXT NOT NULL,
          room_id INT NOT NULL,
          timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES Users(user_id),
          FOREIGN KEY (room_id) REFERENCES Rooms(room_id)
        );
      `)

    await pool.execute(`
        CREATE TABLE IF NOT EXISTS RoomMembers (
          room_id INT NOT NULL,
          user_id INT NOT NULL,
          PRIMARY KEY (room_id, user_id),
          FOREIGN KEY (room_id) REFERENCES Rooms(room_id),
          FOREIGN KEY (user_id) REFERENCES Users(user_id)
        );
      `);
    res.json({ message: "Database created successfully" });
  }


  catch (error) {
    next(error);
  }
});

// Check database exists
router.get("/exists", async (_req, res, next) => {
  try {
    const [result] = await openPool.execute(`
      SELECT COUNT(*) AS DatabaseExists
      FROM INFORMATION_SCHEMA.SCHEMATA
      WHERE SCHEMA_NAME = 'socky';
    `
    );
    return res.json(result[0]);
  }
  catch (error) {
    next(error);
  }
});

export default router;