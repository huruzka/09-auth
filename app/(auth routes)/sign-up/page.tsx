"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { isAxiosError } from "axios";
import { signUp } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";
import css from "./SignUpPage.module.css";

// Реєстрація користувача
export default function SignUpPage() {
    const router = useRouter();
    const { setUser } = useAuthStore();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Обробка надсилання форми
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const user = await signUp({ email, password });
            setUser(user);
            toast.success("Registration successful!");
            router.push("/profile");
        } catch (error) {
            let errorMessage = "Registration failed. Please try again.";
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
                <h1 className={css.formTitle}>Sign up</h1>
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
                        minLength={6}
                    />
                </div>
                <div className={css.actions}>
                    <button
                        type="submit"
                        className={css.submitButton}
                        disabled={isLoading}
                    >
                        {isLoading ? "Registering..." : "Register"}
                    </button>
                </div>
                {error && <p className={css.error}>{error}</p>}
            </form>
        </main>
    );
}