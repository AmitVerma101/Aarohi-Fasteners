import { NextResponse } from 'next/server';
import { readDb } from '@/lib/db';

export async function GET(request) {
  const db = await readDb();
  const { searchParams } = new URL(request.url);
  const bestChoiceOnly =
    searchParams.get('bestChoice') === 'true' || searchParams.get('featured') === 'true';
  const category = searchParams.get('category');

  let list = [...db.products];
  if (bestChoiceOnly) list = list.filter((p) => p.isBestChoice);
  if (category && category !== 'All') list = list.filter((p) => p.category === category);

  return NextResponse.json({ products: list });
}
