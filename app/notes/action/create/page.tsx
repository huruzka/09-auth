import type { Metadata } from "next";
import css from "@/components/CreateNote/CreateNote.module.css";
import CreateNote from "@/components/CreateNote/CreateNote";

const siteUrl = "http://localhost:3000";

export const metadata: Metadata = {
    title: "Create Note | NoteHub",
    description: "Create a new note in your NoteHub.",
    openGraph: {
        title: "Create Note | NoteHub",
        description: "Create a new note in your NoteHub.",
        url: `${siteUrl}/notes/action/create`,
        images: ["/notehub-og-meta.webp"],
        type: "website",
    },
};

export default function CreateNotePage() {
    return (
        <main className={css.main}>
            <div className={css.container}>
                <CreateNote />
            </div>
        </main>
    );
}

