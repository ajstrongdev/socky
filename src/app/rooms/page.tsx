"use client";

import withAuth from "@/app/lib/withAuth";
import { auth } from '@/app/firebase/config';
import { useAuthState } from 'react-firebase-hooks/auth';
import {useState, useEffect} from "react";
import { useRouter } from "next/navigation";

interface Room {
    room_id: number;
    room_name: string;
    owner: number;
}

function Home() {
    const router = useRouter();
    const [globalRoomList, setGlobalRoomList] = useState<Room[]>([]);
    const [userRoomList, setUserRoomList] = useState<Room[]>([]);
    const [user] = useAuthState(auth);

    useEffect(() => {

        const getUserID = async () => {
            const response = await fetch('/api/getUserDetails', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', 
                },
                body: JSON.stringify({ email: user?.email }),
            });
            const data = await response.json();
            console.log("User data")
            console.log(data);
            if (response.ok) {
                const userid = data.user_id;
                sessionStorage.setItem("userID", userid.toString());
                getGlobalRooms(userid);
                getUserRooms(userid);
            } else {
                console.error('Failed to fetch user ID:', data);
            }
        }

        const getUserRooms = async (userid:number) => {
            const response = await fetch('/api/getUserRooms', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', 
                },
                body: JSON.stringify({ user_id: userid }),
            });
            const data = await response.json();
            console.log("User room data")
            console.log(data);
            if (response.ok) {
                setUserRoomList(data);
            } else {
                console.error('Failed to fetch user rooms:', data);
            }
        }

        const getGlobalRooms = async (userid:number) => {
            const response = await fetch('/api/getGlobalRooms', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', 
                },
                body: JSON.stringify({ user_id: userid }),
            });
            const data = await response.json();
            console.log("Room data")
            console.log(data);
            if (response.ok) {
                setGlobalRoomList(data);
            } else {
                console.error('Failed to fetch rooms:', data);
            }
        }
        getUserID();

    }, []);

    const joinRoom = async (roomid:number) => {
        await fetch("/api/joinRoom", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                user_id: parseInt(sessionStorage.getItem("userID") || "0"),
                room_id: roomid,
            }),
        });
    }

    return (
        <>
            <div className="h-screen bg-green-200">
                <h1 className="text-4xl font-bold mb-4 text-center py-8">Your Rooms:</h1>
                <div className="flex flex-grid gap-4 mb-4 w-[85%] m-auto">
                    {userRoomList && userRoomList.length > 0 ? (
                        userRoomList.map((room, index) => (
                            <div key={index} className="bg-white border border-gray-300 rounded-lg p-4 shadow-md">
                                {room && <h2 className="text-xl font-semibold">{room.room_name}</h2>}
                                <button 
                                className="mt-2 bg-green-500 text-white py-2 px-4 rounded-lg"
                                onClick={() => {
                                    console.log("Joining room:", room.room_id);
                                    sessionStorage.setItem("joinedRoom", room.room_id.toString())
                                    router.push("/chat");
                                }}
                                >
                                    Chat!
                                </button>
                            </div>
                        ))
                    ) : (
                        <p>No rooms available</p>
                    )}
                </div>
                <h1 className="text-4xl font-bold mb-4 text-center py-8">Global Rooms:</h1>
                <div className="flex flex-grid gap-4 mb-4 w-[85%] m-auto">
                    {globalRoomList && globalRoomList.length > 0 ? (
                        globalRoomList.map((room, index) => (
                            <div key={index} className="bg-white border border-gray-300 rounded-lg p-4 shadow-md">
                                {room && <h2 className="text-xl font-semibold">{room.room_name}</h2>}
                                <button 
                                className="mt-2 bg-green-500 text-white py-2 px-4 rounded-lg"
                                onClick={() => {
                                    console.log("Joining room:", room.room_id);
                                    joinRoom(room.room_id);
                                    sessionStorage.setItem("joinedRoom", room.room_id.toString())
                                    router.push("/chat");
                                }}
                                >
                                    Join Room
                                </button>
                            </div>
                        ))
                    ) : (
                        <p>No rooms available</p>
                    )}
                </div>
            </div>
        </>
    )
}

export default withAuth(Home);