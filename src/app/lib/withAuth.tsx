// Auth Middleware

// Firebase
import { auth } from "@/app/firebase/config";
import { useAuthState } from "react-firebase-hooks/auth";
// React / Next
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function withAuth<T extends object>(
    WrappedComponent: React.ComponentType<T>
) {
    function ProtectedRoute(props: T) {
        const [user, loading] = useAuthState(auth);
        const router = useRouter();

        useEffect(() => {
            if (!loading) {
                if (!user) {
                    router.push("/");
                }
            }
        }, [user, loading, router]);

        if (loading) {
            return <div>Loading...</div>;
        }

        if (!user) {
            return null;
        }

        return <WrappedComponent {...props} />;
    }

    return ProtectedRoute;
}
