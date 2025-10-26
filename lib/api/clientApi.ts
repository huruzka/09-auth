import apiClient from "./api";
import { User, UserCredentials, UserProfileUpdate } from "@/types/user";
import type { Note, NewNotePayload, FetchNotesResponse } from "@/types/note";

// Регистрация пользователя
export const signUp = async (credentials: UserCredentials): Promise<User> => {
    const { data } = await apiClient.post<User>("/auth/register", credentials);
    return data;
};

// Вход пользователя
export const signIn = async (credentials: UserCredentials): Promise<User> => {
    const { data } = await apiClient.post<User>("/auth/login", credentials);
    return data;
};

// Выход пользователя
export const signOut = async (): Promise<void> => {
    await apiClient.post("/auth/logout");
};

// Получение данных текущего пользователя
export const getCurrentUser = async (): Promise<User> => {
    const { data } = await apiClient.get<User>("/users/me");
    return data;
};

// Обновление профиля пользователя
export const updateUserProfile = async (
    profileData: UserProfileUpdate
): Promise<User> => {
    const { data } = await apiClient.patch<User>("/users/me", profileData);
    return data;
};

// Параметри для отримання нотаток
interface FetchNotesParams {
    page?: number;
    query?: string;
    tag?: string;
}

// Отримання списку нотаток з підтримкою пагінації, пошуку та фільтрації за тегом
export const fetchNotes = async ({
    page = 1,
    query = "",
    tag = "",
}: FetchNotesParams): Promise<FetchNotesResponse> => {
    const response = await apiClient.get<FetchNotesResponse>("/notes", {
        params: {
            page,
            perPage: 12,
            ...(query ? { search: query } : {}),
            ...(tag ? { tag } : {}),
        },
    });
    return response.data;
};

// Створення нової нотатки
export const createNote = async (noteData: NewNotePayload): Promise<Note> => {
    const response = await apiClient.post<Note>("/notes", noteData);
    return response.data;
};

// Оновлення нотатки
export const deleteNote = async (noteId: string): Promise<Note> => {
  if (!noteId?.trim()) {
    throw new Error("❌ Invalid note ID: ID must be a non-empty string.");
  }

  const { data } = await apiClient.delete<Note>(`/notes/${noteId}`);
  return data;
};

// Отримання нотатки за ID
export const fetchSingleNote = async (noteId: string): Promise<Note> => {
    const { data } = await apiClient.get<Note>(`/notes/${noteId}`);
    return data;
};

// Перевірка активної сесії
export const checkSession = async (): Promise<{ success: boolean }> => {
    const { data } = await apiClient.get<{ success: boolean }>("/auth/session");
    return data;
};