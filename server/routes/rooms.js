import express from "express";
import pool from "../db.js";

const router = express.Router();

// Create room

// Get room list
router.get("/get", async (req, res, next) => {
    try {
        const rooms = await pool.query("SELECT * FROM Rooms");
        res.json(rooms[0]);
    } catch (err) {
        next(err);
    }
});

export default router;