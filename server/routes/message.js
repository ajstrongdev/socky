import express from "express";
import pool from "../db.js";

const router = express.Router();

router.post("/onMessage", async (req, res, next) => {
    const { email, messageBody, room_id } = req.body;
    // Get user_id from email
    const [userResult] = await pool.execute("SELECT user_id FROM Users WHERE email = ?", [email]);
    const userId = userResult.flat()[0]?.user_id;
    if (!userId) {
        return res.status(404).json({ message: "User not found" });
    }
    try { 
        const [result] = await pool.execute(
            "INSERT INTO Messages (user_id, message, room_id) VALUES (?, ?, ?)", [userId, messageBody, room_id]
        );
        res.json({ message: "Message sent", message_id: result.insertId });
    } catch (error) {
        next(error);
    }
});

router.post("/getMessages", async (req, res, next) => {
    const { room_id } = req.body;
    const [messages] = await pool.execute("SELECT message FROM Messages WHERE room_id = ?", [room_id]);
    return res.json(messages.map((message) => message.message));
});

export default router;