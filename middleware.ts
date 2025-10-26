import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { checkSessionServer } from "./lib/api/serverApi";
import { cookies } from "next/headers";
import { parse } from "cookie";

const privateRoutes = ["/notes", "/profile"];
const authRoutes = ["/sign-in", "/sign-up"];

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const refreshToken = cookieStore.get("refreshToken")?.value;

    const isPrivateRoute = privateRoutes.some((route) =>
        pathname.startsWith(route)
    );
    const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

    // Виправляємо перенаправлення на головну сторінку
    if (isAuthRoute && accessToken) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    if (isPrivateRoute) {
        if (accessToken) {
            // Токен є, пропускаємо
            return NextResponse.next();
        }

        if (refreshToken) {
            try {
                const data = await checkSessionServer();
                const setCookie = data.headers["set-cookie"];

                if (setCookie) {
                    const response = NextResponse.next();
                    const lines = Array.isArray(setCookie)
                        ? setCookie
                        : [setCookie]; // Масив рядків Set-Cookie
                    // Розбираємо кожен рядок і оновлюємо куки
                    const tokenNames = ["accessToken", "refreshToken"] as const;

                    for (const line of lines) {
                        const parsed = parse(line);

                        for (const name of tokenNames) {
                            const val = parsed[name];
                            if (val) {
                                response.cookies.set(name, val, {
                                    path: parsed.Path || "/",
                                    httpOnly: true,
                                    sameSite: "lax",
                                    secure:
                                        process.env.NODE_ENV === "production",
                                    expires: parsed.Expires
                                        ? new Date(parsed.Expires)
                                        : undefined,
                                    maxAge: parsed["Max-Age"]
                                        ? Number(parsed["Max-Age"])
                                        : undefined,
                                });
                            }
                        }
                    }

                    // Успішно оновили токени - пропускаємо запит далі
                    return response;
                }
            } catch (error) {
                console.error("Session refresh failed:", error);
                // У разі помилки йдемо до редіректу нижче
            }
        }

        // Якщо жоден токен не спрацював, перенаправляємо на логін
        const loginUrl = new URL("/sign-in", request.url);
        loginUrl.searchParams.set("next", pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

// Налаштування маршрутів
export const config = {
    matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};