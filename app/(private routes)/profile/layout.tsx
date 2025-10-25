import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "User Profile | NoteHub",
    description: "View and manage your user profile on NoteHub.",
};

export default function ProfileLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}