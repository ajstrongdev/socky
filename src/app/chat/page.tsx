"use client";

import Chat from "@/app/components/Chat";
import MessageBox from "@/app/components/MessageBox";

// Firebase
import { auth } from '@/app/firebase/config';
import { useAuthState } from 'react-firebase-hooks/auth';

export default function Home() {
  const [user] = useAuthState(auth);

  console.log("User:", user?.email);
  return (
   <div>
      <Chat />
      <MessageBox />
   </div>
  );
}
