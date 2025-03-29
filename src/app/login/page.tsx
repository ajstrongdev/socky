"use client";

// Firebase
import { auth } from "@/app/firebase/config";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";

// React
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Home() {
    // Usestates
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);
    const router = useRouter();


    const signIn = async (e: React.FormEvent<HTMLFormElement>) => {
    console.log("Form submitted, function triggered");

    e.preventDefault(); // Prevent page reload
    try {
        const res = await signInWithEmailAndPassword(email, password);
        console.log("Firebase Response:", res);  // Check what res returns
        setEmail("");
        setPassword("");
        if (res && res.user) {
            console.log("User signed in, redirecting...");
            router.push("/chat");
        } else {
            console.log("Invalid email or password");
            alert("Invalid email or password");
        }
    } catch (error: any) {
        console.error("Sign-in Error:", error);
        alert("Invalid email or password");
    }
};


    return (
        <div>
            <form onSubmit={signIn}>
            <div className="py-2">
              <label className="text-xl text-slate-900 dark:text-slate-200 font-semibold" htmlFor="email">Email:</label>
              <input
                  className="text-slate-900 dark:text-slate-200 w-full p-2 my-2 rounded-lg bg-indigo-100 dark:bg-slate-800 border border-slate-700/50"
                  type="email"
                  placeholder="Email Address"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
              />
            </div>
            <div className="py-2">
              <label htmlFor="password" className="text-xl text-slate-900 dark:text-slate-200 font-semibold">Password:</label>
              <input
                className={`text-slate-900 dark:text-slate-200 w-full p-2 my-2 rounded-lg bg-indigo-100 dark:bg-slate-800 
                    border border-slate-700/50 ${error ? 'border-2 border-red-500' : ''}`}
                type="password"
                placeholder="Password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && (
                <p className="text-red-500 text-sm mt-1 font-semibold text-center mb-4">{error}</p>
            )}
            <div className="flex gap-4">
              <button type="submit" className="px-6 py-3 text-lg font-medium bg-indigo-600 rounded-lg transition-all duration-300 hover:bg-indigo-500 hover:scale-105 shadow-lg hover:shadow-indigo-500/50">
                  Sign in
              </button>
              <div className="mt-4 text-slate-900 dark:text-slate-200">
                  <Link href="/register" className='text-indigo-700 dark:text-white hover:underline cursor-pointer font-semibold mt-4'>Not a Member?</Link>
              </div>
            </div>
        </form>
        </div>
    )

}