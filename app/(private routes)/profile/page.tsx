"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { getCurrentUser } from "@/lib/api/clientApi";
import type { User } from "@/types/user";
import css from "./ProfilePage.module.css";

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const currentUser = await getCurrentUser();
                setUser(currentUser);
            } catch (error) {
                toast.error("Session expired. Please sign in again.");
                router.push("/sign-in"); // якщо користувач неавторизований
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [router]);

    if (loading) {
        return (
            <main className={css.mainContent}>
                <p>Loading profile...</p>
            </main>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <main className={css.mainContent}>
            <div className={css.profileCard}>
                <div className={css.header}>
                    <h1 className={css.formTitle}>Profile Page</h1>
                    <Link href="/profile/edit" className={css.editProfileButton}>
                        Edit Profile
                    </Link>
                </div>

                <div className={css.avatarWrapper}>
                    <Image
                        src={user.avatar || "/default-avatar.png"}
                        alt="User Avatar"
                        width={120}
                        height={120}
                        className={css.avatar}
                        priority
                    />
                </div>

                <div className={css.profileInfo}>
                    <p>
                        <strong>Username:</strong> {user.username}
                    </p>
                    <p>
                        <strong>Email:</strong> {user.email}
                    </p>
                </div>
            </div>
        </main>
    );
}