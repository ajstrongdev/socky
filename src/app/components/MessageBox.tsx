"use client";

import io from "socket.io-client";

import { useState } from "react";
const socket = io("http://localhost:3001");

export default function MessageBox() {
    const [message, setMessage] = useState<string | null>("");

    const sendMessage = () => {
        if (message && message.trim()) {
          socket.emit("chat message", message);
          setMessage("");
        }
      };

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