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
            {inviteList && inviteList.length > 0 ? (
                <ul>
                    {inviteList.map((invite: Invite) => (
                        <div key={invite.room_id}>
                            <li key={invite.room_id}>
                            {invite.room_name} (Owner: {invite.owner})
                        </li>
                        <button
                        onClick={() => {
                            acceptInvite(invite.room_id);
                            getInvites(parseInt(sessionStorage.getItem("UserID") || "0"))
                        }}
                        >
                        Accept
                        </button>
                        </div>
                    ))}
                </ul>
            ) : (
                <p>No invites to show</p>
            )}
        </>
    )
}

export default withAuth(Home);