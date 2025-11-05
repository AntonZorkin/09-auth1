'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useDebouncedCallback } from 'use-debounce';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { Toaster, toast } from 'react-hot-toast';
import css from './NotesPage.module.css';
import { fetchNotes } from '@/lib/api/clientApi';
import NoteList from '@/components/NoteList/NoteList';
import SearchBox from '@/components/SearchBox/SearchBox';
import Pagination from '@/components/Pagination/Pagination';
import Loading from '@/app/loading';
import Error from './error';

interface NotesClientProps {
  tag: string;
}

export default function NotesClient({ tag }: NotesClientProps) {
  const [search, setSearch] = useState<string>('');
  const [page, setPage] = useState<number>(1);

  const { data, error, isSuccess, isError, isLoading } = useQuery({
    queryKey: ['notes', search, page, tag],
    queryFn: () => fetchNotes(search, page, tag),
    placeholderData: keepPreviousData,
  });

  const totalPages = data?.totalPages ?? 0;
  const totalNotes = data?.notes?.length ?? 0;

  useEffect(() => {
    if (isSuccess && totalNotes === 0) {
      toast.error('No notes found for your request.', { duration: 1000 });
    }
  }, [isSuccess, totalNotes]);

  const updateSearchQuery = useDebouncedCallback((value: string) => {
    setPage(1);
    setSearch(value);
  }, 400);


  return (
    <div className={css.app}>
      <Toaster />
      <div className={css.toolbar}>
        <SearchBox value={search} onChange={updateSearchQuery} />
        {isSuccess && totalPages > 1 && (
          <Pagination page={page} totalPages={totalPages} setPage={setPage} />
        )}
        <Link href='/notes/action/create'
          className={css.button}
        >
          Create note +
        </Link>
      </div>
      {isLoading && <Loading />}
      {isError && (
        <Error error={error} reset={() => fetchNotes(search, page, tag)} />
      )}
      {data?.notes && totalNotes > 0 && <NoteList notes={data?.notes} />}
    </div>
  );
}
