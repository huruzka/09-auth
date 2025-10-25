import Link from 'next/link';
import css from "./Home.module.css"
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Not-Found Page',
  description: 'This page is not found, please come back to Home page or try again later',
};

const NotFound = () => {
  return (
    <div>
      <h1 className={css.title}>404 - Page not found</h1>
      <p className={css.description}>Sorry, the page you are looking for does not exist.</p>
      <Link href="/">Go back home</Link>
    </div>
  );
};

export default NotFound;