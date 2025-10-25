'use client'

import css from './CreateNote.module.css';
import NoteForm from '../NoteForm/NoteForm';
import { useRouter } from 'next/navigation';

 

export default function CreateNote () {
    const router = useRouter();
    return (
        <main className={css.main}>
            <div className={css.container}>
                <h1 className={css.title}>Create note</h1>
                {/* NoteForm component */}
                
                <NoteForm onCancel={() => router.back()} />
            </div>
        </main>
    )
}

