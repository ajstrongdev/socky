"use client";

// Imports
import withAuth from "@/app/lib/withAuth";
import { auth } from '@/app/firebase/config';
import { useAuthState } from 'react-firebase-hooks/auth';
import {useState, useEffect} from "react";
import { useRouter } from "next/navigation";

// Components
import RoomList from "@/app/components/RoomList";
import DynamicMenu from "@/app/components/DynamicMenu";

function Home() {
    const [user] = useAuthState(auth);
    const router = useRouter();

    const menuItems = [
        {text: "Create Room", action: () => {router.push("/create-room")}},
    ]

    return (
        <>
        <div className="bg-green-200 h-screen w-screen">
        <DynamicMenu menuItems={menuItems} />
            <div className="grid grid-cols-1 md:grid-cols-[50%_50%]">
                <RoomList />
            </div>
        </div>
        </>
    )
}

export default withAuth(Home);