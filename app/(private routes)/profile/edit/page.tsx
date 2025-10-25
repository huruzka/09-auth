"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";
import { getCurrentUser, updateUserProfile } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";
import css from "./EditProfilePage.module.css";

export default function EditProfilePage() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { user: authUser, setUser } = useAuthStore();
    const [username, setUsername] = useState("");

    // 1. Отримуємо поточні дані користувача для заповнення форми
    const {
        data: user,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["user-profile"],
        queryFn: getCurrentUser,
        staleTime: 5 * 60 * 1000, // Кешуємо дані на 5 хвилин
    });

    // 2. Встановлюємо початкове значення для інпуту, коли дані завантажені
    useEffect(() => {
        if (user) {
            setUsername(user.username);
            // Також оновлюємо дані в Zustand на всякий випадок
            if (!authUser || authUser.email !== user.email) {
                setUser(user);
            }
        }
    }, [user, authUser, setUser]);

    // 3. Створюємо мутацію для оновлення профілю
    const mutation = useMutation({
        mutationFn: updateUserProfile,
        onSuccess: (updatedUser) => {
            toast.success("Profile updated successfully!");
            setUser(updatedUser); // Оновлюємо стан в Zustand
            // Інвалідовуємо кеш, щоб на сторінці профілю були свіжі дані
            queryClient.invalidateQueries({ queryKey: ["user-profile"] });
            router.push("/profile"); // Перенаправляємо на сторінку профілю
        },
        onError: () => {
            toast.error("Failed to update profile. Please try again.");
        },
    });

    // 4. Обробка форми
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (username.trim() === user?.username) {
            toast.error("You haven't changed anything.");
            return;
        }
        mutation.mutate({ username: username.trim() });
    };

    if (isLoading) {
        return <p>Loading editor...</p>;
    }

    if (isError || !user) {
        return <p>Could not load user data to edit.</p>;
    }

    return (
        <main className={css.mainContent}>
            <Toaster position="top-right" />
            <div className={css.profileCard}>
                <h1 className={css.formTitle}>Edit Profile</h1>
                <Image
                    src={user.avatar || "/default-avatar.png"}
                    alt="User Avatar"
                    width={120}
                    height={120}
                    className={css.avatar}
                />
                <form className={css.profileInfo} onSubmit={handleSubmit}>
                    <div className={css.usernameWrapper}>
                        <label htmlFor="username">Username:</label>
                        <input
                            id="username"
                            type="text"
                            className={css.input}
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <p>
                        <strong>Email:</strong> {user.email}
                    </p>
                    <div className={css.actions}>
                        <button
                            type="submit"
                            className={css.saveButton}
                            disabled={mutation.isPending}
                        >
                            {mutation.isPending ? "Saving..." : "Save"}
                        </button>
                        <button
                            type="button"
                            className={css.cancelButton}
                            onClick={() => router.back()} // Просто повертаємося назад
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}