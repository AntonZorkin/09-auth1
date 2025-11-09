import { User } from '@/types/user';
import { nextClient, nextServer } from './api';
import { Note } from '@/types/note';
import axios from 'axios';

export interface FetchNotesResponse {
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
    ? { search: searchQuery, tag, page, perPage }
    : { search: searchQuery, page, perPage };

  const response = await nextServer.get<FetchNotesResponse>('/api/notes', {
    params,
  });
  return response.data;
};

export const fetchNoteById = async (id: Note['id']): Promise<Note> => {
  const response = await nextServer.get<Note>(`/api/notes/${id}`);
  return response.data;
};

export const getMe = async (): Promise<User> => {
  const { data } = await nextServer.get<User>('/api/users/me');
  return data;
};

export const updateMe = async (payload: UpdateUserRequest): Promise<User> => {
  const response = await nextServer.patch<User>('/api/users/me', payload);
  return response.data;
};

export const createNote = async (newNote: CreateNoteData): Promise<Note> => {
  const response = await nextClient.post<Note>('/api/notes', newNote);
  return response.data;
};

export const deleteNote = async (id: Note['id']): Promise<Note> => {
  const response = await nextClient.delete<Note>(`/api/notes/${id}`);
  return response.data;
};

export const register = async (
  registrationDetails: RegistrationDetails
): Promise<User> => {
  const response = await nextClient.post<User>(
    '/auth/register',
    registrationDetails
  );
  return response.data;
};

export const login = async (loginDetails: LoginDetails): Promise<User> => {
  const response = await nextClient.post<User>('/auth/login', loginDetails);
  return response.data;
};

export const logout = async (): Promise<void> => {
  await nextClient.post('/auth/logout');
};

export const checkSession = async (): Promise<User | null> => {
  try {
    const response = await nextClient.post<User>('/auth/current', {});
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      return null;
    }
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }
    throw error;
  }
};
