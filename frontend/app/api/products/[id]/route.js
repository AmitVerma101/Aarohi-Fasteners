import { NextResponse } from 'next/server';
import {
  readDb,
  writeDb,
  normalizeCategoryName,
  normalizeCategoryObject,
  normalizeHomeSvg,
  defaultProductDescription,
  saveProductImage,
} from '@/lib/db';

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
    const { id: rawId } = await params;
    const id = Number(rawId);
    const body = await request.json();
    const db = await readDb();

    const index = db.products.findIndex((p) => Number(p.id) === id);
    if (index === -1) {
      return NextResponse.json({ error: 'Product not found.' }, { status: 404 });
    }

    const existing = db.products[index];
    const category = normalizeCategoryName(body.category || existing.category);
    const providedName = typeof body.name === 'string' ? body.name.trim() : existing.name;
    const imageName = typeof body.imageName === 'string' ? body.imageName.trim() : providedName;
    const imageData = typeof body.imageData === 'string' ? body.imageData : '';
    const imageSrc = await saveProductImage({ categoryName: category, imageData, imageName });
    const description =
      typeof body.description === 'string' && body.description.trim()
        ? body.description.trim()
        : existing.description || defaultProductDescription(providedName, category);

    if (!category || !providedName) {
      return NextResponse.json({ error: 'Product name and category are required.' }, { status: 400 });
    }

    if (!db.categories.some((c) => c.name.toLowerCase() === category.toLowerCase())) {
      db.categories.push(normalizeCategoryObject({ name: category }));
    }

    db.products[index] = {
      ...existing,
      name: providedName,
      category,
      isBestChoice: body.isBestChoice === undefined ? existing.isBestChoice : Boolean(body.isBestChoice),
      imageSrc: imageSrc || existing.imageSrc || '',
      description,
      homeSvg: body.homeSvg === undefined ? existing.homeSvg || '' : normalizeHomeSvg(body.homeSvg),
    };

    await writeDb(db);
    return NextResponse.json({ product: db.products[index] });
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized. Provide x-admin-token header.' }, { status: 401 });
  }

  const { id: rawId } = await params;
  const id = Number(rawId);
  const db = await readDb();
  const index = db.products.findIndex((p) => Number(p.id) === id);

  if (index === -1) {
    return NextResponse.json({ error: 'Product not found.' }, { status: 404 });
  }

  const [removed] = db.products.splice(index, 1);
  await writeDb(db);
  return NextResponse.json({ product: removed });
}
