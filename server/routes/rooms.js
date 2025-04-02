import express from "express";
import pool from "../db.js";

const router = express.Router();

// Create room
router.post("/create", async (req, res, next) => {
    try {
        const { room_name, owner, global } = req.body;
        if (!room_name || !owner) {
            return res.status(400).json({ error: "Room name and owner are required" });
        }
        const [result] = await pool.execute(
            "INSERT INTO Rooms (room_name, owner, global) VALUES (?, ?, ?)",
            [room_name, owner, global]
        );
        res.json({ message: "Room created", room_id: result.insertId });
    } catch (err) {
        next(err);
    }
});

// Join room
router.post("/join", async (req, res, next) => {
    try {
        const { room_id, user_id } = req.body;
        if (!room_id || !user_id) {
            return res.status(400).json({ error: "Room ID and user ID are required" });
        }
        const [result] = await pool.execute(
            "INSERT INTO RoomMembers (room_id, user_id) VALUES (?, ?)",
            [room_id, user_id]
        );
        res.json({ message: "Joined room" });
    } catch (err) {
        next(err);
    }
});

// Get room list
router.get("/get", async (req, res, next) => {
    try {
        const rooms = await pool.query("SELECT * FROM Rooms");
        res.json(rooms[0]);
    } catch (err) {
        next(err);
    }
});

// getGlobal
router.post("/getGlobal", async (req, res, next) => {
    try {
        const { user_id } = req.body;
        if (!user_id) {
            return res.status(400).json({ error: "User ID is required" });
        }
        const rooms = await pool.query(
            "SELECT * FROM Rooms WHERE global = 1 AND room_id NOT IN (SELECT room_id FROM RoomMembers WHERE user_id = ?)",
            [user_id]
        );
        res.json(rooms[0]);
    } catch (err) {
        next(err);
    }
});

// Get rooms user is a member of
router.post("/getUser", async (req, res, next) => {
    const { user_id } = req.body;
    if (!user_id) {
        return res.status(400).json({ error: "User ID is required" });
    }
    try {
        const rooms = await pool.query("SELECT * FROM Rooms WHERE room_id IN (SELECT room_id FROM RoomMembers WHERE user_id = ?)", [user_id]);
        res.json(rooms[0]);
    } catch (err) {
        next(err);
    }
});

export default router;