import express from "express";
import pool from "../db.js";

const router = express.Router();

// Create user
router.post("/create", async (req, res, next) => {
    try {
        const { email, username } = req.body;
        const [result] = await pool.execute(
            "INSERT INTO Users (email, username) VALUES (?, ?)", [email, username]
        )
        res.json({ message: "User created", user_id: result.insertId });
    }
    catch (error) {
        next(error);
    }
});

export default router;