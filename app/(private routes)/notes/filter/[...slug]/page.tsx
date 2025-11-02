// app/notes/filter/[...slug]/page.tsx

import { Metadata } from 'next';
import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api/serverApi';
import NotesClient from './Notes.client';

interface NotesProps {
  params: Promise<{ slug: string[] }>;
}

export async function generateMetadata({
  params,
}: NotesProps): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `${slug[0][0].toUpperCase() + slug[0].slice(1)} Notes`,
    description: `A list of ${slug[0]} notes`,
    openGraph: {
      title: `${slug[0][0].toUpperCase() + slug[0].slice(1)} Notes`,
      description: `A list of ${slug[0]} notes`,
      url: `https://notehub.com/notes/filter/${slug[0]}`,
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
          width: 1200,
          height: 630,
          alt: 'NoteHub',
        },
      ],
    },
  };
}

const Notes = async ({ params }: NotesProps) => {
  const queryClient = new QueryClient();
  const { slug } = await params;
  const tag = slug[0] === 'all' ? '' : slug[0];
  const search = '';
  const page = 1;

  await queryClient.prefetchQuery({
    queryKey: ['notes', tag],
    queryFn: () => fetchNotes(search, page, tag),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={tag} />
    </HydrationBoundary>
  );
};

export default Notes;
