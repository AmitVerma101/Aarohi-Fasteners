import { NextResponse } from 'next/server';
import {
  readDb,
  writeDb,
  normalizeCategoryName,
  normalizeCategoryObject,
  normalizeHomeSvg,
  defaultProductDescription,
  nextProductId,
  saveProductImage,
  sanitizeFileName,
} from '@/lib/db';

const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'change-me';

function isAdmin(request) {
  const token = request.headers.get('x-admin-token');
  return token && token === ADMIN_TOKEN;
}

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

export async function POST(request) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized. Provide x-admin-token header.' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const category = normalizeCategoryName(body.category);
    const providedName = typeof body.name === 'string' ? body.name.trim() : '';
    const imageName = typeof body.imageName === 'string' ? body.imageName.trim() : '';
    const imageData = typeof body.imageData === 'string' ? body.imageData : '';
    const name = providedName || (imageName ? sanitizeFileName(imageName).replace(/-/g, ' ') : '');
    const description =
      typeof body.description === 'string' && body.description.trim()
        ? body.description.trim()
        : defaultProductDescription(name || 'This product', category || 'component');

    if (!name || !category) {
      return NextResponse.json({ error: 'Product name and category are required.' }, { status: 400 });
    }

    const db = await readDb();
    if (!db.categories.some((c) => c.name.toLowerCase() === category.toLowerCase())) {
      db.categories.push(normalizeCategoryObject({ name: category }));
    }

    const imageSrc = await saveProductImage({ categoryName: category, imageData, imageName: imageName || name });

    const product = {
      id: nextProductId(db.products),
      name,
      category,
      imageSrc: imageSrc || '',
      isBestChoice: Boolean(body.isBestChoice),
      description,
      homeSvg: normalizeHomeSvg(body.homeSvg),
    };

    db.products.push(product);
    await writeDb(db);
    return NextResponse.json({ product }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }
}
