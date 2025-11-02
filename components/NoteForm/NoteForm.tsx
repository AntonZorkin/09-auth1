'use client';

import { useState, useId } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { initialDraft, useDraftNoteStore } from '@/lib/store/noteStore';
import css from './NoteForm.module.css';
import { createNote, CreateNoteData } from '@/lib/api/clientApi';
import Loading from '@/app/loading';

const tagsList = ['Work', 'Personal', 'Meeting', 'Shopping', 'Todo'];

export default function NoteForm() {
  const [isDisabled, setIsDisabled] = useState(false);
  const fieldId = useId();
  const queryClient = useQueryClient();
  const router = useRouter();
  const { draft, setDraft, clearDraft } = useDraftNoteStore();

  const handleInput = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setDraft({
      ...draft,
      [e.target.name]: e.target.value,
    });
  };

  const newNote = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      toast.success('Note added!', { position: 'bottom-center' });
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      clearDraft();
      router.push('/notes/filter/all');
    },
  });

  const handleSubmit = (formData: FormData) => {
    if (formData) {
      const values = Object.fromEntries(formData) as unknown as CreateNoteData;
      setIsDisabled(!isDisabled);
      newNote.mutate(values);
    }
  };

  const handleCancel = () => router.push('/notes/filter/all');

  return (
    <>
      <form className={css.form} action={handleSubmit}>
        <div className={css.formGroup}>
          <label htmlFor={`${fieldId}-title`}>Title</label>
          <input
            id={`${fieldId}-title`}
            type="text"
            name="title"
            className={css.input}
            value={draft?.title ?? initialDraft.title}
            onChange={handleInput}
            minLength={3}
            maxLength={50}
            required
          />
        </div>

        <div className={css.formGroup}>
          <label htmlFor={`${fieldId}-content`}>Content</label>
          <textarea
            id={`${fieldId}-content`}
            name="content"
            rows={8}
            className={css.textarea}
            value={draft?.content ?? initialDraft.content}
            onChange={handleInput}
            maxLength={500}
          />
        </div>

        <div className={css.formGroup}>
          <label htmlFor={`${fieldId}-tag`}>Tag</label>
          <select
            id={`${fieldId}-tag`}
            name="tag"
            className={css.select}
            value={draft.tag ?? initialDraft.tag}
            onChange={handleInput}
            required
          >
            {tagsList.map((tag, i) => (
              <option key={i} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </div>

        <div className={css.actions}>
          <button
            type="button"
            className={css.cancelButton}
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={css.submitButton}
            disabled={isDisabled}
          >
            Create note
          </button>
        </div>
      </form>
      {newNote.isPending && <Loading />}
    </>
  );
}
