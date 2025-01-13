import VerseDisplay from '@/components/VerseDisplay';
import { getAllVerses } from '@/lib/verses';

export default function Home() {
  const verses = getAllVerses();
  
  return (
    <main className="min-h-screen p-4 bg-slate-50">
      <h1 className="text-2xl font-bold text-center mb-8">Verse Memorization</h1>
      {verses.length > 0 && <VerseDisplay verse={verses[0]} />}
    </main>
  );
}