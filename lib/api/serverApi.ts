import { cookies } from 'next/headers';
import { nextServer } from './api';
import { User } from '../../types/user';
import { Note } from '@/types/note';

interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export const checkSession = async () => {
  const cookiesStore = await cookies();
  const response = await nextServer.get('auth/session', {
    headers: {
      Cookie: cookiesStore.toString(),
    },
  });
  return response;
};

export const getMe = async (): Promise<User> => {
  const cookiesStore = await cookies();
  const { data } = await nextServer.get('/users/me', {
    headers: {
      Cookie: cookiesStore.toString(),
    },
  });
  return data;
};

export const fetchNotes = async (
  search: string,
  page: number,
  tag: string,
  perPage: number = 12
): Promise<FetchNotesResponse> => {
  const searchQuery = search ? search : '';
  const params = tag
    ? {
        search: searchQuery,
        tag,
        page,
        perPage,
      }
    : {
        search: searchQuery,
        page,
        perPage,
      };
  const cookiesStore = await cookies();
  const response = await nextServer.get<FetchNotesResponse>('/notes', {
    params,
    headers: {
      Cookie: cookiesStore.toString(),
    },
  });
  return response.data;
};

export const fetchNoteById = async (id: Note['id']): Promise<Note> => {
  const cookiesStore = await cookies();
  const response = await nextServer.get<Note>(`/notes/${id}`, {
    headers: {
      Cookie: cookiesStore.toString(),
    },
  });
  return response.data;
};
