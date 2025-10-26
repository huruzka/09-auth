import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { parse } from "cookie";
import { checkSessionServer } from "@/lib/api/serverApi";

//  Маршрути, які потребують авторизації
const privateRoutes = ["/notes", "/profile"];

//  Маршрути для логіну/реєстрації (непотрібні, якщо користувач вже залогінений)
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

  //  Якщо користувач вже залогінений і намагається потрапити на /sign-in або /sign-up
  if (isAuthRoute && accessToken) {
    const response = NextResponse.redirect(new URL("/", request.url));
    response.cookies.delete("accessToken");
    response.cookies.delete("refreshToken");
    return response;
  }

  //  Якщо користувач заходить на приватний маршрут
  if (isPrivateRoute) {
    // Якщо є accessToken — пропускаємо
    if (accessToken) {
      return NextResponse.next();
    }

    // Якщо є refreshToken — пробуємо оновити сесію
    if (refreshToken) {
      try {
        const data = await checkSessionServer();

        const setCookie = data.headers["set-cookie"];
        if (setCookie) {
          const response = NextResponse.next();
          const lines = Array.isArray(setCookie) ? setCookie : [setCookie];
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
                  secure: process.env.NODE_ENV === "production",
                  expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
                  maxAge: parsed["Max-Age"]
                    ? Number(parsed["Max-Age"])
                    : undefined,
                });
              }
            }
          }

          //  Токени оновлено — пропускаємо користувача
          return response;
        }
      } catch (error) {
        console.error("Session refresh failed:", error);
        // Якщо не вдалося оновити — перенаправляємо на логін
      }
    }

    //  Якщо немає токенів або сесія прострочена — редірект на логін
    const loginUrl = new URL("/sign-in", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  //  Для всіх інших сторінок — просто пропускаємо
  return NextResponse.next();
}

//  Налаштування маршрутів для Middleware
export const config = {
  matcher: ["/notes/:path*", "/profile/:path*", "/sign-in", "/sign-up"],
};