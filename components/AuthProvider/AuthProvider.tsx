"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/store/authStore";
import { getCurrentUser, checkSession } from "@/lib/api/clientApi";

const privateRoutes = ["/notes", "/profile"];

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();
    const pathname = usePathname();
    const { setUser, clearAuthState } = useAuthStore();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const isPrivateRoute = privateRoutes.some((route) =>
                pathname.startsWith(route)
            );

            if (isPrivateRoute) {
                try {
                    // 2. Спочатку перевіряємо, чи валідна сесія
                    const session = await checkSession();
                    if (!session.success) {
                        // Якщо сесія невалідна, одразу викидаємо помилку
                        throw new Error("Session expired or invalid");
                    }
                    // 3. Тільки після успішної перевірки сесії отримуємо дані користувача
                    const user = await getCurrentUser();
                    setUser(user);
                } catch (error) {
                    // Цей блок спрацює, якщо будь-який із запитів провалився
                    clearAuthState();
                    router.replace("/sign-in");
                }
            }
            // Завершуємо завантаження для будь-яких маршрутів
            setIsLoading(false);
        };

        checkAuth();
    }, [pathname, router, setUser, clearAuthState]);

    // Показуємо лоадер, поки триває перевірка на приватних маршрутах
    if (
        isLoading &&
        privateRoutes.some((route) => pathname.startsWith(route))
    ) {
        return <p>Loading, please wait...</p>;
    }

    return <>{children}</>;
};

export default AuthProvider;