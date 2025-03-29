"use client";

import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:3001");

export default function Chat() {
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    socket.on("chat message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("chat message");
    };
  }, []);

  return (
    <div className="py-4 px-4">
      <ul>
        {messages.map((msg, index) => (
          <div key={index} className="bg-green-100 border my-4 border-slate-700/50 rounded-lg p-8 w-full">
            <li>{msg}</li>
          </div>
        ))}
      </ul>
    </div>
  );
}
