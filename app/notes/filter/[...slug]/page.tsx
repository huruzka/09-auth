import { fetchNotes } from "@/lib/api";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import NotesClient from './Notes.client';
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }>; }):Promise<Metadata> {
  const { slug } = await params;
  const rawTag = slug?.[0];
  const tag = rawTag && rawTag !== "All" ? rawTag : "All";
  const title = `Notes – ${tag} | NoteHub`;
    const description =
        tag === "All"
            ? "Browse all your NoteHub notes."
            : `Browse your NoteHub notes filtered by tag: ${tag}.`;
  return {
    title: `Note: ${title}`,
    description,
    openGraph: {
      title: `Note: ${title}`,
      description,
      url: `https://notehub.com/notes/filter/${tag}`,
      siteName: 'NoteHub',
      images: [
        {
          url: 'https://placehold.co/1200x630',
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title}`,
      description,
      images: ['https://ac.goit.global/fullstack/react/og-meta.jpg'],
    },
  }
}


interface NotePageProps{
  params: Promise<{ slug?: string[] }>;
}

export default async function NotesFilterPage ({params}:NotePageProps) {
    const queryClient = new QueryClient();

  const resolvedParams = await params;
  const tag =
    resolvedParams.slug?.[0] && resolvedParams.slug[0] !== "All"
      ? resolvedParams.slug[0]
      : "";
  
    await queryClient.prefetchQuery({
        queryKey: ['notes', 1, "", tag],
        queryFn: () => fetchNotes({ page:1, query: "",tag}),
    });
    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <NotesClient tag={tag} />
      </HydrationBoundary>
  );
};

