"use client"; // 1. Оголошуємо компонент клієнтським

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();

    // 2. Оновлюємо маршрутизатор при першому завантаженні
    useEffect(() => {
        router.refresh();
    }, [router]);

    return <>{children}</>;
}