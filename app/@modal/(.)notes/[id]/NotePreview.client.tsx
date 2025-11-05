// app/@modal/(.)notes/[id]/NotePreview.client.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import css from './NotePreview.module.css';
import { fetchNoteById } from '@/lib/api/clientApi';
import Modal from '@/components/Modal/Modal';
import Error from './error';
import Loading from '@/app/loading';

const NotePreviewClient = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const close = () => router.back();

  const { data: note, error, isLoading } = useQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  if (error) return <Error error={error} />;
  if (!note) return <p>Something went wrong.</p>;
  if (isLoading) return <Loading/>;

  const formattedDate = note.updatedAt
    ? `Updated at: ${note.updatedAt}`
    : `Created at: ${note.createdAt}`;

  return (
    <Modal onClose={close}>
      <div className={css.container}>
        <div className={css.item}>
          <div className={css.header}>
            <h2>{note.title}</h2>
          </div>
          <p className={css.content}>{note.content}</p>
          <p className={css.date}>{formattedDate}</p>
        </div>
      </div>
      <button onClick={close} className={css.backBtn}>
        Back
      </button>
    </Modal>
  );
};

export default NotePreviewClient;
