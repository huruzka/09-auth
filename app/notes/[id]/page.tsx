import {
    HydrationBoundary,
    QueryClient,
    dehydrate,
} from "@tanstack/react-query";
import { fetchSingleNote } from "@/lib/api";
import NoteDetailsClient from "./NoteDetails.client";
import { Metadata } from "next";


// Типизируем `params` как Promise
interface NoteDetailsPageProps {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: NoteDetailsPageProps ):Promise<Metadata> {
  const { id } = await params
  const note = await fetchSingleNote(id)
  return {
    title: `Note: ${note.title}`,
    description: note.content.slice(0, 30),
    openGraph: {
      title: `Note: ${note.title}`,
      description: note.content.slice(0, 100),
      url: `https://notehub.com/notes/${id}`,
      siteName: 'NoteHub',
      images: [
        {
          url: 'https://placehold.co/1200x630',
          width: 1200,
          height: 630,
          alt: note.title,
        },
      ],
      type: 'article',
    },
    twitter: {
	    card: 'summary_large_image',
      title: `${note.title}`,
      description: note.content.slice(0, 3),
      images: ['https://ac.goit.global/fullstack/react/og-meta.jpg'],
    },
  }
}

export default async function NoteDetailsPage({
    params,
}: NoteDetailsPageProps) {
    const queryClient = new QueryClient();

    // Явно ожидаем (await) на Promise
    const resolvedParams = await params;
    const { id } = resolvedParams;

    await queryClient.prefetchQuery({
        queryKey: ["note", id],
        queryFn: () => fetchSingleNote(id),
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <NoteDetailsClient />
        </HydrationBoundary>
    );
}

