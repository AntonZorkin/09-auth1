'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast, Toaster } from 'react-hot-toast';
import { useState, useEffect } from 'react';
import css from './EditProfilePage.module.css';
import { useAuthStore } from '@/lib/store/authStore';
import { getMe, updateMe, UpdateUserRequest } from '@/lib/api/clientApi';
import Loading from './loading';

const EditProfile = () => {
  const { isAuthenticated } = useAuthStore();
  const setUser = useAuthStore(store => store.setUser);
  const [username, setUsername] = useState('');
  const [avatar, setAvatar] = useState('');
  const [email, setEmail] = useState('');
  const queryClient = useQueryClient();
  const router = useRouter();

  useEffect(() => {
    getMe().then(user => {
      setUsername(user.username ?? '');
      setAvatar(user.avatar ?? '');
      setEmail(user.email ?? '');
    });
  }, []);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const updatedUser = useMutation({
    mutationFn: (payload: UpdateUserRequest) => updateMe(payload),
    onSuccess: () => {
      toast.success('Username updated!', { position: 'top-center' });
      setUser({username, avatar, email});
      queryClient.invalidateQueries({ queryKey: ['username'] });
      router.push('/profile');
    },
  });

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updatedUser.mutate({ username });
  };

  const handleCancel = () => router.push('/profile');

  return (
    <main className={css.mainContent}>
      <Toaster />
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>

        <Image
          src={avatar}
          alt="User Avatar"
          width={120}
          height={120}
          className={css.avatar}
        />

        <form onSubmit={handleSave} className={css.profileInfo}>
          <div className={css.usernameWrapper}>
            <label htmlFor="username">Username: </label>
            <input
              id="username"
              name="username"
              type="text"
              value={username}
              onChange={handleInput}
              className={css.input}
            />
          </div>

          <p>Email: {email}</p>

          <div className={css.actions}>
            <button type="submit" className={css.saveButton}>
              Save
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className={css.cancelButton}
            >
              Cancel
            </button>
          </div>
        </form>
        {updatedUser.isPending && <Loading />}
      </div>
    </main>
  );
};

export default EditProfile;
