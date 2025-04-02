"use client";

import { useEffect, useState } from "react";
import io from "socket.io-client";
import withAuth from "@/app/lib/withAuth";

const socket = io("http://localhost:4000");

function Chat() {
  const [messages, setMessages] = useState<string[]>([]);

  // Load previous messages from the server
  useEffect(() => {
    const getRoomId = () => {
      const roomId = sessionStorage.getItem("joinedRoom");
      if (roomId) {
        fetchMessages(parseInt(roomId));
      }
    }
    const fetchMessages = async (roomid:number) => {
      const response = await fetch("http://localhost:3001/message/getMessages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          room_id: roomid,
        }),
      });
      const data = await response.json();
      setMessages(data);
    };

    getRoomId();
  }, []);

  // Temp fix for sockets not working across multiple devices therefore not updating messages
  const refreshMessages = async () => {
    const roomId = sessionStorage.getItem("joinedRoom");
    if (roomId) {
      const response = await fetch("http://localhost:3001/message/getMessages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          room_id: parseInt(roomId),
        }),
      });
      const data = await response.json();
      setMessages(data);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      refreshMessages();
    }, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    socket.on("chat message", (roomid, uname, msg) => {
      if (roomid == parseInt(sessionStorage.getItem("joinedRoom") || "")) {
        const combinedMessage = `${uname}: ${msg}`;
        setMessages((prevMessages) => [...prevMessages, combinedMessage]);
      }
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

export default withAuth(Chat);
