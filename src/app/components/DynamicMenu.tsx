"use client";

// Imports
import withAuth from "@/app/lib/withAuth";
import { auth } from '@/app/firebase/config';
import { useAuthState } from 'react-firebase-hooks/auth';
import {useState, useEffect} from "react";
import { useRouter } from "next/navigation";
import React from "react";

interface MenuItem {
    text: string;
    action: () => void;
}

interface DynamicMenuProps {
    menuItems: MenuItem[];
}

const DynamicMenu: React.FC<DynamicMenuProps> = ({ menuItems }) => {
    return(
    <>
        <div className="w-full flex justify-center bg-green-100 py-4 border-b border-slate-700/50 mb-8">
      {menuItems.map((item, index) => (
        <button
          key={index}
          onClick={item.action}
          className="bg-green-500 text-white py-2 px-4 rounded-lg"
        >
          {item.text}
        </button>
      ))}
    </div>
    </>
    )
}

export default DynamicMenu;