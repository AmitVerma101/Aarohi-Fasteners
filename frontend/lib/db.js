import path from 'path';
import fs from 'fs/promises';

const DB_PATH = path.join(process.cwd(), 'data', 'db.json');

function normalizeHomeSvg(svg) {
  return typeof svg === 'string' ? svg.trim() : '';
}

function defaultProductDescription(name, category) {
  return `${name} is a dependable ${category.toLowerCase()} solution designed for daily industrial use, with consistent performance and reliable fitment.`;
}

function normalizeCategoryName(name) {
  return typeof name === 'string' ? name.trim() : '';
}

function normalizeCategoryObject(input) {
  const name = normalizeCategoryName(typeof input === 'string' ? input : input?.name);
  return {
    name,
    isRecommended: Boolean(input?.isRecommended),
    homeSvg: normalizeHomeSvg(input?.homeSvg),
  };
}

function parseDbRaw(raw) {
  const parsed = JSON.parse(raw);

  const categories = Array.isArray(parsed.categories)
    ? parsed.categories.map((c) => normalizeCategoryObject(c)).filter((c) => c.name)
    : [];

  const products = Array.isArray(parsed.products)
    ? parsed.products
        .map((p, idx) => ({
          id: Number(p.id) || idx + 1,
          name: typeof p.name === 'string' ? p.name.trim() : '',
          category: typeof p.category === 'string' ? p.category.trim() : '',
          imageSrc: typeof p.imageSrc === 'string' ? p.imageSrc.trim() : '',
          isBestChoice: Boolean(p.isBestChoice ?? p.featured),
          description: typeof p.description === 'string' ? p.description.trim() : '',
          homeSvg: normalizeHomeSvg(p.homeSvg),
        }))
        .filter((p) => p.name && p.category)
        .map((p) => ({
          ...p,
          description: p.description || defaultProductDescription(p.name, p.category),
        }))
    : [];

  const uniqueCategories = [];
  const seenCategoryNames = new Set();
  for (const category of categories) {
    const key = category.name.toLowerCase();
    if (seenCategoryNames.has(key)) continue;
    seenCategoryNames.add(key);
    uniqueCategories.push(category);
  }

  return { categories: uniqueCategories, products };
}

export async function readDb() {
  try {
    const raw = await fs.readFile(DB_PATH, 'utf8');
    return parseDbRaw(raw);
  } catch {
    return { categories: [], products: [] };
  }
}
