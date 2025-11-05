import { User } from '@/types/user';
import { nextServer } from './api';

import { Note } from '@/types/note';
interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface CreateNoteData {
  title: string;
  tag: 'Todo' | 'Work' | 'Personal' | 'Meeting' | 'Shopping';
  content: string;
}

export interface RegistrationDetails {
  email: string;
  password: string;
}

export interface LoginDetails {
  email: string;
  password: string;
}

interface CheckSessionRequest {
  success: boolean;
}

export interface UpdateUserRequest {
  username: string;
}

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

  const response = await nextServer.get<FetchNotesResponse>('/notes', {
    params,
  });
  return response.data;
};

export const fetchNoteById = async (id: Note['id']): Promise<Note> => {
  const response = await nextServer.get<Note>(`/notes/${id}`);
  return response.data;
};

export const createNote = async (newNote: CreateNoteData): Promise<Note> => {
  const response = await nextServer.post<Note>('/notes', newNote);
  return response.data;
};

export const deleteNote = async (id: Note['id']): Promise<Note> => {
  const response = await nextServer.delete<Note>(`/notes/${id}`);
  return response.data;
};

export const register = async (registrationDetails: RegistrationDetails) => {
  const response = await nextServer.post<User>(
    '/auth/register',
    registrationDetails
  );
  return response.data;
};

export const login = async (loginDetails: LoginDetails) => {
  const response = await nextServer.post<User>('/auth/login', loginDetails);
  return response.data;
};

export const logout = async (): Promise<void> => {
  await nextServer.post('/auth/logout');
};

export const checkSession = async () => {
  const response = await nextServer.get<CheckSessionRequest>('auth/session');
  return response.data.success;
};

export const getMe = async () => {
  const { data } = await nextServer.get<User>('/users/me');
  return data;
};

export const updateMe = async (payload: UpdateUserRequest) => {
  const response = await nextServer.patch<User>('/users/me', payload);
  return response.data;
};
