import { cookies } from "next/headers";
import { AxiosResponse } from "axios";
import { api as serverApiClient } from "@/app/api/api";
import type { Note, FetchNotesResponse } from "@/types/note";
import { User } from "@/types/user";

// 2. Функція для перевірки/оновлення сесії
export const checkSessionServer = async (): Promise<
    AxiosResponse<{ user: User }>
> => {
    const cookieStore = await cookies();
    const response = await serverApiClient.get("auth/session", {
        headers: {
            Cookie: cookieStore.toString(),
        },
    });
    // Просто повертаємо всю відповідь
    return response;
};

// 3. Функція для отримання поточного користувача на сервері
export const getCurrentUserServer = async (): Promise<User> => {
    const cookieStore = await cookies();
    const { data } = await serverApiClient.get<User>("/users/me", {
        headers: {
            Cookie: cookieStore.toString(),
        },
    });
    return data;
};

// Отримання списку нотаток на сервері
export const fetchNotesServer = async ({
    page = 1,
    query = "",
    tag = "",
}: {
    page?: number;
    query?: string;
    tag?: string;
}): Promise<FetchNotesResponse> => {
    const cookieStore = await cookies();
    const { data } = await serverApiClient.get<FetchNotesResponse>("/notes", {
        params: {
            page,
            perPage: 12,
            ...(query ? { search: query } : {}),
            ...(tag ? { tag } : {}),
        },
        headers: {
            Cookie: cookieStore.toString(),
        },
    });
    return data;
};

// Функція для отримання нотатки за її ID на сервері
export const fetchNoteByIdServer = async (noteId: string): Promise<Note> => {
    const cookieStore = await cookies();
    const { data } = await serverApiClient.get<Note>(`/notes/${noteId}`, {
        headers: {
            Cookie: cookieStore.toString(),
        },
    });
    return data;
};