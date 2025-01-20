export const revalidate = 0;  

import VerseNavigator from '../components/VerseNavigator';
import { getAllVerses } from '@/lib/verses';

export default async function Home() {
  const verses = await getAllVerses();
  
  return (
    <main className="min-h-screen p-4 bg-slate-50">
      <h1 className="text-2xl font-bold text-center mb-8">Verse Memorization</h1>
      <VerseNavigator verses={verses} />
    </main>
  );
}