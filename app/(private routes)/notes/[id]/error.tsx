// app/notes/[id]/error.tsx

'use client';

interface Props {
  error: Error;
}

const Error = ({ error }: Props) => {
  return (
    <div>
      <p>Could not fetch note details. {error.message}</p>
    </div>
  );
};

export default Error;
