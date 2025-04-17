"use client";

import withAuth from "@/app/lib/withAuth";
import { auth } from '@/app/firebase/config';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function Home() {
    const router = useRouter();
    const [user] = useAuthState(auth);
    const [userid, setUserId] = useState<number | null>(null);

    const createRoom = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const roomName = e.currentTarget.roomName.value;
        const response = await fetch("/api/createRoom", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({
            room_name: roomName,
            owner: userid,
            global: (document.getElementById("global") as HTMLInputElement)?.checked ? 1 : 0,
            }),
        });
        if (response.status == 200) {
            const data = await response.json();
            if (data) {
                const id = data.room_id;
                joinRoom(id);
            }
        }
    }

    const joinRoom = async (roomid:number) => {
        console.log("Joining room: " + roomid);
        const response = await fetch("/api/joinRoom", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                room_id: roomid,
                user_id: userid,
            }),
        });
        if (response.status == 200) {
            router.push("/rooms");
        }
    }

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
                const uuid = data[0].user_id;
                setUserId(uuid);
            } else {
                console.error('Failed to fetch user ID:', data);
            }
        }
        if (user) {
            getUserID();
        }
    }, [user]);

    return (
        <>
            <div className="flex flex-col justify-center items-center h-screen bg-green-200">
            <div className="bg-green-100 border border-slate-700/50 rounded-lg p-8">
                    <form onSubmit={createRoom}>
                        <div>
                            <label className="text-xl text-slate-700 font-semibold" htmlFor="roomName">Room Name:</label>
                            <input
                                className="text-slate-700 w-full p-2 my-2 rounded-lg bg-green-200 border border-slate-700/50"
                                type="text"
                                placeholder="Room Name"
                                name="roomName"
                                required
                            />
                        </div>
                        <div>
                            <input
                                type="checkbox"
                                id="global"
                                name="global"
                            />
                            <label className="text-slate-700 font-semibold" htmlFor="global">Global Room</label>
                        </div>
                        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-lg mt-4">Create Room</button>
                    </form>
                </div>
            </div>
        </>
    )
}

export default withAuth(Home);