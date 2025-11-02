// app/notes/filter/layout.tsx
import css from './LayoutNotes.module.css';

interface NotesLayoutProps {
  sidebar: React.ReactNode;
  children: React.ReactNode;
}

const NotesLayout = ({ sidebar, children }: NotesLayoutProps) => {
  return (
    <section className={css.container}>
      <aside className={css.sidebar}>{sidebar}</aside>
      <div className={css.notesWrapper}>{children}</div>
    </section>
  );
};

export default NotesLayout;
