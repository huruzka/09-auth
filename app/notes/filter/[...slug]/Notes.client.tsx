'use client'

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import css from './Notes.module.css';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useDebounce } from 'use-debounce';
import Link from 'next/link';

import { fetchNotes } from '@/lib/api';
import Loader from '@/components/Loader/Loader';
import NoteList from '@/components/NoteList/NoteList';
import Pagination from '@/components/Pagination/Pagination';
import SearchBox from '@/components/SearchBox/SearchBox';

const NotesClient = ({tag}:{tag:string})=> {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery] = useDebounce(searchQuery, 500);

  useEffect(() => {
    setPage(1);
  }, [debouncedQuery, tag]);

  const { data: notesData, isLoading } = useQuery({
    queryKey: ["notes", page, debouncedQuery, tag],
    queryFn: () => fetchNotes({ page, query: debouncedQuery, tag }),
    placeholderData: keepPreviousData,
  })


  const handlePageClick = (e: { selected: number }): void => {
    setPage(e.selected + 1);
  };

  const handleDeleted = () => {
    toast.success('Note deleted');
  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={searchQuery} onChange={setSearchQuery} />
        {notesData && notesData.totalPages > 1 && (
          <Pagination
            totalPages={notesData.totalPages}
            currentPage={page}
            onPageChange={handlePageClick}
          />
        )}
        <Link href="/notes/action/create" className={css.button}>
                    Create note +
                </Link>
      </header>

      <main>
        {isLoading && <Loader />}
          {notesData && (
          <NoteList notes={notesData.notes} onDeleted={handleDeleted} />
        )}
      </main>

    </div>
  );
}

export default NotesClient;