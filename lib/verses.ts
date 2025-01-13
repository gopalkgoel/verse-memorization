import { readFileSync } from 'fs';
import { join } from 'path';
import yaml from 'yaml';
import type { Verse } from '../types';

export function getAllVerses(): Verse[] {
  const filePath = join(process.cwd(), 'data/verses.yaml');
  const fileContents = readFileSync(filePath, 'utf8');
  return yaml.parse(fileContents);
}

export function getVerseByNumber(number: string): Verse | null {
  const verses = getAllVerses();
  return verses.find(verse => verse.numbers.includes(number)) || null;
}