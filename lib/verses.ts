import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import yaml from 'yaml';
import type { Verse } from '../types';

export function getAllVerses(): Verse[] {
  const filePath = join(process.cwd(), 'data/verses.yaml');
  const fileContents = readFileSync(filePath, 'utf8');
  const verses: Verse[] = yaml.parse(fileContents);
  
  // Check if any verses need normalization
  let needsUpdate = false;
  verses.forEach(verse => {
    if (!verse.normalizedVerse && verse.verse) {
      verse.normalizedVerse = normalizeVerse(verse.verse);
      needsUpdate = true;
    }
  });

  // Update the YAML file if changes were made
  if (needsUpdate) {
    const updatedYaml = yaml.stringify(verses);
    writeFileSync(filePath, updatedYaml, 'utf8');
  }

  return verses;
}

export function normalizeVerse(text: string): string {
  return text
    .toLowerCase()
    // Decompose diacritics from base characters
    .normalize('NFD')
    // Remove all combining diacritical marks
    .replace(/[\u0300-\u036f]/g, '')
    // Replace dashes and multiple spaces with single space
    .replace(/[-\s]+/g, ' ')
    .trim();
}