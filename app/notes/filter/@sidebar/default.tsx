import Link from "next/link";
import css from "./[...slug]/Sidebar.module.css";

const TAGS = [
    "All",
    "Todo",
    "Work",
    "Personal",
    "Meeting",
    "Shopping",
] as const;

export default function Default() {
    return (
        <aside className={css.sidebar}>
            <h2 className={css.title}>Filter by Tag</h2>
            <ul className={css.menuList}>
                {TAGS.map((tag) => {
                    const href = `/notes/filter/${tag}`;
                    const isActive = tag === "All"; // На "порожньому" стані вважаємо активним All
                    return (
                                            <li key={tag} className={css.menuItem}>
                            <Link
                                href={href}
                                className={`${css.menuLink} ${isActive ? "active" : ""}`}
                                aria-current={isActive ? "page" : undefined}
                            >
                                {tag === "All" ? "All notes" : tag}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </aside>
    );
}