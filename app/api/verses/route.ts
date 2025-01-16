import { NextRequest, NextResponse } from 'next/server';
import { normalizeVerse } from '@/lib/verses';
import type { Verse } from '@/types';
import { supabase } from '@/lib/supabaseClient';

// POST /api/verses
export async function POST(req: NextRequest) {
  try {
    const verse: Verse = await req.json();
    
    // Add normalizedVerse if not provided
    if (!verse.normalizedVerse && verse.verse) {
      verse.normalizedVerse = normalizeVerse(verse.verse);
    }

    const { error } = await supabase
      .from('verses')
      .insert([verse]); // Insert an array of rows

    if (error) {
      console.error('Error inserting verse:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error adding verse:', error);
    return NextResponse.json({ success: false, error: 'Failed to add verse' }, { status: 500 });
  }
}

// PUT /api/verses
// We assume the request body includes: { verse: Verse }
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const verse: Verse = body.verse;

    if (!verse.id) {
      return NextResponse.json({ 
        success: false, 
        error: 'No verse "id" provided' 
      }, { status: 400 });
    }

    // Make sure verse is normalized
    if (!verse.normalizedVerse && verse.verse) {
      verse.normalizedVerse = normalizeVerse(verse.verse);
    }

    // Attempt to update the row by id
    const { error } = await supabase
      .from('verses')
      .update(verse)
      .eq('id', verse.id);

    if (error) {
      console.error('Error updating verse:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating verse:', error);
    return NextResponse.json({ success: false, error: 'Failed to update verse' }, { status: 500 });
  }
}