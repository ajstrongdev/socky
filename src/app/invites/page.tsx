"use client";

import withAuth from "@/app/lib/withAuth";
import { auth } from '@/app/firebase/config';
import { useAuthState } from 'react-firebase-hooks/auth';
import {useState, useEffect} from "react";
import { useRouter } from "next/navigation";
import DynamicMenu from "@/app/components/DynamicMenu"

interface Invite {
    room_id: number;
    room_name: string;
    owner: number;
}

function Home() {
    const router = useRouter();
    const [user] = useAuthState(auth);
    const [inviteList, setInviteList] = useState<Invite[]>([])

    const items = [
        {
            text: "Back",
            action: () => router.push("/rooms")
        }
    ]
    
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
                getInvites(userid)
            } else {
                console.error('Failed to fetch user ID:', data);
            }
        }
        getUserID();
    }, [user?.email]);

    const getInvites = async (userid:number) => {
        const response = await fetch('/api/getInvites', {
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
            setInviteList(data);
        } else {
            console.error('Failed to fetch user rooms:', data);
        }
    }

    const acceptInvite = async (roomid:number) => {
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
        deleteInvitation(roomid);
    }

    const deleteInvitation = async (roomid:number) => {
        await fetch("/api/deleteInvite", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                room_id: roomid,
                user_id: parseInt(sessionStorage.getItem("userID") || "0"),                
            }),
        });
    }

    return (
        <>
            <DynamicMenu menuItems={items} />
            <div className="h-screen bg-green-200">
                <div className="w-[85%] m-auto py-8">
                <h1 className="text-4xl font-bold">Invites:</h1>
                    {inviteList && inviteList.length >= 0 ? (
                        <ul>
                            {inviteList.map((invite: Invite) => (
                                <div key={invite.room_id} className="my-4 rounded-lg bg-green-100 border border-slate-700/50 p-8">
                                    <li key={invite.room_id}>
                                    <h2 className="text-2xl">{invite.room_name}</h2>
                                </li>
                                <button
                                className="bg-green-500 text-white py-2 px-4 mr-4 rounded-lg"
                                onClick={async () => {
                                     await acceptInvite(invite.room_id);
                                     await getInvites(parseInt(sessionStorage.getItem("userID") || "0"))
                                }}
                                >
                                Accept
                                </button>
                                <button
                                className="bg-green-500 text-white py-2 px-4 rounded-lg"
                                onClick={async ()=> {
                                     await deleteInvitation(invite.room_id)
                                     await getInvites(parseInt(sessionStorage.getItem("userID") || "0"))
                                }}
                                >
                                    Delete
                                </button>
                                </div>
                            ))}
                        </ul>
                    ) : (
                        <p>No invites to show</p>
                    )}
                </div>
            </div>
        </>
    )
}

export default withAuth(Home);