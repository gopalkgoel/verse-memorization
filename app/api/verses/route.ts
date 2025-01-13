import { writeFile } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import { join } from 'path';
import yaml from 'yaml';
import { getAllVerses } from '@/lib/verses';
import type { Verse } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const verse: Verse = await req.json();
    const verses = getAllVerses();
    verses.push(verse);
    
    const yamlString = yaml.stringify(verses);
    const filePath = join(process.cwd(), 'data/verses.yaml');
    await writeFile(filePath, yamlString, 'utf8');
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error adding verse:', error);
    return NextResponse.json({ success: false, error: 'Failed to add verse' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { verse, index }: { verse: Verse, index: number } = await req.json();
    const verses = getAllVerses();
    
    if (index < 0 || index >= verses.length) {
      return NextResponse.json({ success: false, error: 'Invalid verse index' }, { status: 400 });
    }
    
    verses[index] = verse;
    const yamlString = yaml.stringify(verses);
    const filePath = join(process.cwd(), 'data/verses.yaml');
    await writeFile(filePath, yamlString, 'utf8');
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating verse:', error);
    return NextResponse.json({ success: false, error: 'Failed to update verse' }, { status: 500 });
  }
}