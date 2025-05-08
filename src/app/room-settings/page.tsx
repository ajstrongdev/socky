"use client";

import withAuth from "@/app/lib/withAuth";
import { auth } from '@/app/firebase/config';
import { useAuthState } from 'react-firebase-hooks/auth';
import {useState, useEffect} from "react";
import { useRouter } from "next/navigation";
import DynamicMenu from "@/app/components/DynamicMenu"



function Home() {
  const router = useRouter();
  const [user] = useAuthState(auth);

  // Menu items
  const items = [
    {
        text: "Back",
        action: () => router.push("/rooms"),
    },
  ]

  const inviteSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget)
    const invitedEmail = data.get('email')
    // Get user id 
    const getUserID = async () => {
      const response = await fetch('/api/getUserDetails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({email: invitedEmail})
      });
      const userdata = await response.json();
      console.log("UID response: ", userdata.user_id)
      if (response.ok) {
        inviteToRoom(userdata.user_id);
      } else {
          console.error("Failed to fetch user ID", data)
      };
    };
    getUserID();
    // Invite the user to the room.
    const inviteToRoom = async (userid:number|null) => { // Pass through UID after retrived.
      console.log("Parsed number:", userid);
      await fetch("/api/inviteUser", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            user_id: userid,
            room_id: parseInt(sessionStorage.getItem("roomSettingsId") || "0"),
        }),
      });
    };
  };

  return (
    <>
      <div className="h-screen bg-green-200">
        <DynamicMenu menuItems={items} />
        <h1 className="text-center py-4 text-4xl font-bold">
          Room Settings:
        </h1>
        <div className="md:w-[85%] w-[95%] m-auto">
          <form onSubmit={inviteSubmit} className="bg-green-100 rounded-lg p-4">
            <label className="block">
              <span className="text-gray-700 text-2xl">Invite user by email:</span>
              <input
                type="email"
                name="email"
                required
                className="my-2 bg-green-200 rounded-lg border border-slate-700/50 w-full p-2"
                placeholder="user@example.com"
              />
            </label>
            <button
              type="submit"
              className="bg-green-500 text-white py-2 px-4 rounded-lg"
            >
              Invite
            </button>
          </form>
        </div>
      </div>
    </>
  )
}

export default withAuth(Home);
