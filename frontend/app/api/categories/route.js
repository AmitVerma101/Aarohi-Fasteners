import { NextResponse } from 'next/server';
import { readDb, writeDb, normalizeCategoryObject } from '@/lib/db';

const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'change-me';

function isAdmin(request) {
  const token = request.headers.get('x-admin-token');
  return token && token === ADMIN_TOKEN;
}

export async function GET() {
  const db = await readDb();
  return NextResponse.json({ categories: db.categories });
}

export async function POST(request) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized. Provide x-admin-token header.' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const category = normalizeCategoryObject(body);
    if (!category.name) {
      return NextResponse.json({ error: 'Category name is required.' }, { status: 400 });
    }

    const db = await readDb();
    const exists = db.categories.some((c) => c.name.toLowerCase() === category.name.toLowerCase());
    if (exists) {
      return NextResponse.json({ error: 'Category already exists.' }, { status: 409 });
    }

    db.categories.push(category);
    await writeDb(db);
    return NextResponse.json({ category }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }
}
