"use client";

import io from "socket.io-client";

import { useState, useEffect } from "react";
const socket = io("http://localhost:4000");

// Firebase
import { auth } from '@/app/firebase/config';
import { useAuthState } from 'react-firebase-hooks/auth';

export default function MessageBox() {
    const [user] = useAuthState(auth);
    const [message, setMessage] = useState<string | null>("");
    const [username, setUsername] = useState<string | null>(null);
    const [roomid, setRoomId] = useState<number | null>(null);
    
    const sendMessage = () => {
        if (message && message.trim()) {
            socket.emit("chat message", username, message);
            if (username) {
                storeMessage(username, message);
            }
            setMessage("");
          }
      };

    const storeMessage = async (username:string, message:string) => {
        const combinedMessage = `${username}: ${message}`;
        const response = await fetch("http://localhost:3001/message/onMessage", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: user?.email, messageBody: combinedMessage, room_id: roomid }), 
        });
        const data = await response.json();
        console.log(data);
    }

    useEffect(() => {
        if (user) {
            const fetchUsername = async (email:string) => {
                const response = await fetch("http://localhost:3001/users/getUserDetails", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email: email }), 
                });
                const data = await response.json();
                console.log(data);
                setUsername(data[0].username);
            };
            if (user.email) {
                fetchUsername(user.email);
            }
        }
    }, [user]);

    useEffect(() => {
        const getRoomId = () => {
            const roomId = sessionStorage.getItem("joinedRoom");
            if (roomId) {
              setRoomId(parseInt(roomId));
            }
          }
        getRoomId();
    }, []);

    return(
        <>
            <div className="absolute bottom-0 inset-x-0 py-4">
                <div className="flex justify-center items-center p-8 rounded-lg bg-green-200 w-auto mx-16 border border-slate-700/50">
                    <input
                        type="text"
                        value={message || ""}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type a message"
                        className="w-full bg-green-100 py-4 px-2 mx-4 rounded-lg border border-slate-700/50"
                    />
                <button onClick={sendMessage}>Send</button>
                </div>
            </div>
        </>
    )
}