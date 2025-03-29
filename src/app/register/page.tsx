"use client";

// Firebase
import { auth } from '@/app/firebase/config';
import { useCreateUserWithEmailAndPassword  } from 'react-firebase-hooks/auth';

// Other
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Home() {
    const router = useRouter();
    const [createUserWithEmailAndPassword] = useCreateUserWithEmailAndPassword(auth);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");

    const signUp = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const res = await createUserWithEmailAndPassword(email, password);
            if (res?.user) {
                // Save the username to the database
                const response = await fetch("http://localhost:3001/users/create", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        username,
                        email
                    }),
                });
                if (response.status == 200) {
                    // Redirect to the home page
                    router.push("/");
                }
            }
        }
        catch (error) {
            console.error("Error signing up:", error);
        }
    }

    return (
        <div className="flex flex-col justify-center items-center h-screen bg-green-200">
            <div className="bg-green-100 border border-slate-700/50 rounded-lg p-8">
                <form onSubmit={signUp}>
                    <div>
                        <label className="text-xl text-slate-700 font-semibold" htmlFor="username">Username:</label>
                        <input
                            className="text-slate-700 w-full p-2 my-2 rounded-lg bg-green-200 border border-slate-700/50"
                            type="text"
                            placeholder="Username"
                            name="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="text-xl text-slate-700 font-semibold" htmlFor="email">Email:</label>
                        <input
                            className="text-slate-700 w-full p-2 my-2 rounded-lg bg-green-200 border border-slate-700/50"
                            type="email"
                            placeholder="Email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="text-xl text-slate-700 font-semibold" htmlFor="password">Password:</label>
                        <input
                            className="text-slate-700 w-full p-2 my-2 rounded-lg bg-green-200 border border-slate-700/50"
                            type="password"
                            placeholder="Password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        className="bg-green-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-600 transition-colors w-full mt-4"
                        type="submit"
                    >
                        Sign Up
                    </button>
                    <p className="text-slate-700 mt-4">
                        Already have an account? <Link href="/login" className="text-green-600 hover:underline">Log in</Link>
                    </p>
                </form>
            </div>
        </div>
    )
}