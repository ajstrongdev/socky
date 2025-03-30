import express from "express";
import pool from "../db.js";
import next from "next";

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

// Get username
router.post("/getUsername", async (req, res, next) => {
    try {
        const { email } = req.body;
        const result = await pool.execute(
            "SELECT username FROM Users WHERE email = ?", [email]
        );
        if (result[0].length > 0) {
            const flattenedResult = result[0].flat();
            res.json({ username: flattenedResult[0].username });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } 
    catch (error) {
        next(error);
    }
});

export default router;