import { NextResponse } from 'next/server';
import { readDb, writeDb, normalizeCategoryObject } from '@/lib/db';

const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'change-me';

function isAdmin(request) {
  const token = request.headers.get('x-admin-token');
  return token && token === ADMIN_TOKEN;
}

export async function PUT(request, { params }) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized. Provide x-admin-token header.' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const categoryIndex = Number(id) - 1;
    const body = await request.json();
    const nextCategory = normalizeCategoryObject(body);

    const db = await readDb();
    const currentCategory = db.categories[categoryIndex];
    if (!currentCategory) {
      return NextResponse.json({ error: 'Category not found.' }, { status: 404 });
    }
    if (!nextCategory.name) {
      return NextResponse.json({ error: 'Category name is required.' }, { status: 400 });
    }

    const duplicate = db.categories.some(
      (cat, idx) => idx !== categoryIndex && cat.name.toLowerCase() === nextCategory.name.toLowerCase()
    );
    if (duplicate) {
      return NextResponse.json({ error: 'Category already exists.' }, { status: 409 });
    }

    db.categories[categoryIndex] = nextCategory;
    db.products = db.products.map((product) =>
      product.category === currentCategory.name ? { ...product, category: nextCategory.name } : product
    );

    await writeDb(db);
    return NextResponse.json({ category: nextCategory });
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized. Provide x-admin-token header.' }, { status: 401 });
  }

  const { id } = await params;
  const categoryIndex = Number(id) - 1;
  const db = await readDb();
  const category = db.categories[categoryIndex];

  if (!category) {
    return NextResponse.json({ error: 'Category not found.' }, { status: 404 });
  }

  db.categories = db.categories.filter((_, idx) => idx !== categoryIndex);
  db.products = db.products.filter((product) => product.category !== category.name);
  await writeDb(db);
  return NextResponse.json({ category: category.name, deletedProducts: true });
}
