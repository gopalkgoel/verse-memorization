'use client';

import type { Verse } from '@/types';
import { supabase } from '@/lib/supabaseClient';

export async function getAllVerses(): Promise<Verse[]> {
  const { data, error } = await supabase
    .from('verses')
    .select('*')
    .order('id', { ascending: true }); // or any other column for ordering

  if (error) {
    console.error('Error fetching verses:', error);
    throw new Error(error.message);
  }

  return (data as Verse[]) || [];
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

export const revalidate = 0;