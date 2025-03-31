import express from "express";
import pool from "../db.js";

const router = express.Router();

router.post("/onMessage", async (req, res, next) => {
    const { email, messageBody } = req.body;
    // Get user_id from email
    const [userResult] = await pool.execute("SELECT user_id FROM Users WHERE email = ?", [email]);
    const userId = userResult.flat()[0]?.user_id;
    if (!userId) {
        return res.status(404).json({ message: "User not found" });
    }
    try { 
        const [result] = await pool.execute(
            "INSERT INTO Messages (user_id, message) VALUES (?, ?)", [userId, messageBody]
        );
        res.json({ message: "Message sent", message_id: result.insertId });
    } catch (error) {
        next(error);
    }
});

router.get("/getMessages", async (req, res, next) => {
    const [messages] = await pool.execute("SELECT message FROM Messages");
    return res.json(messages.map((message) => message.message));
});

export default router;