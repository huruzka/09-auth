"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { isAxiosError } from "axios";
import { signIn } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore"; // 1. Імпортуємо стор
import css from "./SignInPage.module.css";

export default function SignInPage() {
    const router = useRouter();
    const { setUser } = useAuthStore(); // 2. Отримуємо метод setUser
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const user = await signIn({ email, password });
            setUser(user); // 3. Використовуємо setUser для оновлення стану
            toast.success("Login successful!");
            setTimeout(() => {
    router.push("/profile");
}, 50);
              
        } catch (error) {
            let errorMessage = "Login failed. Please check your credentials.";
            if (isAxiosError(error) && error.response) {
                errorMessage = error.response.data.message || errorMessage;
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className={css.mainContent}>
            <Toaster position="top-right" />
            <form className={css.form} onSubmit={handleSubmit}>
                <h1 className={css.formTitle}>Sign in</h1>
                <div className={css.formGroup}>
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        className={css.input}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className={css.formGroup}>
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        name="password"
                        className={css.input}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className={css.actions}>
                    <button
                        type="submit"
                        className={css.submitButton}
                        disabled={isLoading}
                    >
                        {isLoading ? "Logging in..." : "Log in"}
                    </button>
                </div>
                {error && <p className={css.error}>{error}</p>}
            </form>
        </main>
    );
}