// Тип для користувача
export interface User {
    username: string;
    email: string;
    avatar: string;
}

// Тип для даних реєстрації/логіна
export type UserCredentials = Pick<User, "email"> & { password?: string };

// Тип для оновлення профілю
export type UserProfileUpdate = Partial<Pick<User, "username">>;