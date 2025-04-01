"use client";

import withAuth from "@/app/lib/withAuth";
import {useState, useEffect} from "react";
import { useRouter } from "next/navigation";

interface Room {
    room_id: number;
    room_name: string;
    owner: number;
}

function Home() {
    const [roomList, setRoomList] = useState<Room[]>([]);

    useEffect(() => {
        const getRooms = async () => {
            const response = await fetch('http://localhost:3001/rooms/get', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json', 
                }
            });
            const data = await response.json();
            console.log("Room data")
            console.log(data);
            if (response.ok) {
                setRoomList(data);
            } else {
                console.error('Failed to fetch rooms:', data);
            }
        }
        getRooms();
    }, []);

    return (
        <>
            <div className="flex flex-col justify-center items-center h-screen bg-green-200">
                <h1 className="text-4xl font-bold mb-4">Rooms</h1>
                <div className="flex flex-col gap-4">
                    {roomList && roomList.length > 0 ? (
                        roomList.map((room, index) => (
                            <div key={index} className="bg-white border border-gray-300 rounded-lg p-4 shadow-md">
                                {room && <h2 className="text-xl font-semibold">{room.room_name}</h2>}
                                <button 
                                className="mt-2 bg-green-500 text-white py-2 px-4 rounded-lg"
                                onClick={() => {
                                    console.log("Joining room:", room.room_id);
                                    // Todo: Add logic here
                                }}
                                >
                                    Join
                                </button>
                            </div>
                        ))
                    ) : (
                        <p>No rooms available</p>
                    )}
                </div>
                <div className="bg-green-100 border border-slate-700/50 rounded-lg p-8">

                </div>

            </div>
        </>
    )
}

export default withAuth(Home);