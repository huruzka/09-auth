import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";

import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import TanStackProvider from "@/components/TanStackProvider/TanStackProvider";

export const metadata: Metadata = {
  title: "Note Hub App",
  description: "Notes for your life",
  openGraph: {
      title: `Note Hub App`,
      description: 'Notes for your life',
      url: `https://notehub.com`,
      siteName: 'NoteHub',
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/og-meta.jpg',
          width: 1200,
          height: 630,
          alt: 'Note Hub main picture',
        },
      ],
      type: 'article',
  },
     twitter: {
      card: 'summary_large_image',
      title: 'Not Hub app',
      description: 'Notes for your life',
      images: ['https://ac.goit.global/fullstack/react/og-meta.jpg'],
    },
};

const roboto = Roboto({
  subsets: ['latin'], 
  weight: ['400', '700'],
  variable: '--font-roboto', 
  display: 'swap', 
});

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={`${roboto.variable}`}>
        <TanStackProvider>
        <Header/>

        <main>{children}       
          </main>
          {modal}

          <Footer />
          </TanStackProvider >
      </body>
    </html>
  );
};