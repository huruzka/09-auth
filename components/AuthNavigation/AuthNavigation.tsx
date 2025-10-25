"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuthStore } from "@/lib/store/authStore";
import { signOut } from "@/lib/api/clientApi";
import css from "./AuthNavigation.module.css";

const AuthNavigation = () => {
    const router = useRouter();
    const { isAuthenticated, user, clearAuthState } = useAuthStore();

    const handleLogout = async () => {
        try {
            await signOut();
            clearAuthState(); // Очищаем состояние в Zustand
            toast.success("You have successfully logged out!");
            router.push("/sign-in");
        } catch (error) {
            toast.error("Logout failed. Please try again.");
        }
    };

    return (
        <>
            {isAuthenticated && user ? (
                <>
                    <li className={css.navigationItem}>
                        <Link href="/profile" className={css.navigationLink}>
                            Profile
                        </Link>
                    </li>
                    <li className={css.navigationItem}>
                        <span className={css.userEmail}>{user.email}</span>
                        <button
                            onClick={handleLogout}
                            className={css.logoutButton}
                        >
                            Logout
                        </button>
                    </li>
                </>
            ) : (
                <>
                    <li className={css.navigationItem}>
                        <Link href="/sign-in" className={css.navigationLink}>
                            Login
                        </Link>
                    </li>
                    <li className={css.navigationItem}>
                        <Link href="/sign-up" className={css.navigationLink}>
                            Sign up
                        </Link>
                    </li>
                </>
            )}
        </>
    );
};

export default AuthNavigation;