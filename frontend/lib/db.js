import path from 'path';
import fs from 'fs/promises';
import fsSync from 'fs';

const DB_PATH = path.join(process.cwd(), 'data', 'db.json');
const DB_SEED_PATH = path.join(process.cwd(), 'data', 'db.seed.json');
const ASSETS_PRODUCTS_ROOT = path.join(process.cwd(), 'public', 'assets', 'products');

const IMAGE_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif']);

const CATEGORY_SVG_MAP = {
  Bolts: '<svg viewBox="0 0 24 24" aria-hidden="true"><line x1="12" y1="2" x2="12" y2="6"/><rect x="8" y="6" width="8" height="14" rx="1"/><line x1="10" y1="9" x2="14" y2="9"/><line x1="10" y1="12" x2="14" y2="12"/><line x1="12" y1="20" x2="12" y2="22"/></svg>',
  'Dowel Pin': '<svg viewBox="0 0 24 24" aria-hidden="true"><line x1="12" y1="2" x2="12" y2="22"/><circle cx="12" cy="8" r="3"/><line x1="9" y1="14" x2="15" y2="14"/></svg>',
  'Grub Screw': '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/><line x1="12" y1="2" x2="12" y2="7"/><line x1="12" y1="17" x2="12" y2="22"/></svg>',
  'Machine Screw': '<svg viewBox="0 0 24 24" aria-hidden="true"><line x1="12" y1="2" x2="12" y2="22"/><path d="M8 4 Q5 8 5 12 Q5 16 8 20"/><path d="M16 4 Q19 8 19 12 Q19 16 16 20"/></svg>',
  Nuts: '<svg viewBox="0 0 24 24" aria-hidden="true"><polygon points="12,3 21,8 21,16 12,21 3,16 3,8"/><circle cx="12" cy="12" r="3"/></svg>',
  Washers: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/></svg>',
  'Special Part': '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l7 4v10l-7 4-7-4V7z"/><path d="M12 9v6"/></svg>',
  'Turning Component': '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="7" width="16" height="10" rx="2"/><circle cx="8" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="16" cy="12" r="1.5"/></svg>',
  'Security Screw': '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l7 4v5c0 4-2.5 6.5-7 9-4.5-2.5-7-5-7-9V7z"/><circle cx="12" cy="11" r="2"/></svg>',
  'Sems Screw': '<svg viewBox="0 0 24 24" aria-hidden="true"><line x1="12" y1="3" x2="12" y2="17"/><circle cx="12" cy="19" r="3"/><circle cx="12" cy="8" r="2"/></svg>',
};

export function defaultCategorySvg(name) {
  return CATEGORY_SVG_MAP[name] || '<svg viewBox="0 0 24 24" aria-hidden="true"><polygon points="12,3 21,8 21,16 12,21 3,16 3,8"/><circle cx="12" cy="12" r="3"/></svg>';
}

export function slugify(text) {
  return String(text).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'misc';
}

export function sanitizeFileName(name) {
  return String(name || 'image')
    .replace(/\.[a-zA-Z0-9]+$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '') || 'image';
}

export function defaultProductDescription(name, category) {
  return `${name} is a dependable ${category.toLowerCase()} solution designed for daily industrial use, with consistent performance and reliable fitment.`;
}

export function normalizeCategoryName(name) {
  return typeof name === 'string' ? name.trim() : '';
}

export function normalizeHomeSvg(svg) {
  return typeof svg === 'string' ? svg.trim() : '';
}

export function normalizeCategoryObject(input) {
  const name = normalizeCategoryName(typeof input === 'string' ? input : input?.name);
  return {
    name,
    isRecommended: Boolean(input?.isRecommended),
    homeSvg: normalizeHomeSvg(input?.homeSvg) || defaultCategorySvg(name),
  };
}

export function categoryNames(categories) {
  return categories.map((c) => c.name);
}

export function nextProductId(products) {
  return products.reduce((max, p) => Math.max(max, Number(p.id) || 0), 0) + 1;
}

async function ensureDbFile() {
  if (!fsSync.existsSync(DB_PATH) && fsSync.existsSync(DB_SEED_PATH)) {
    await fs.copyFile(DB_SEED_PATH, DB_PATH);
  }
}

export async function readDb() {
  await ensureDbFile();
  try {
    const raw = await fs.readFile(DB_PATH, 'utf8');
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
  } catch {
    return { categories: [], products: [] };
  }
}

export async function writeDb(db) {
  const data = JSON.stringify(db, null, 2);
  // Write runtime db and keep seed in sync so fresh deployments have latest data
  await fs.writeFile(DB_PATH, data, 'utf8');
  await fs.writeFile(DB_SEED_PATH, data, 'utf8');
}

export function extractImageData(dataUrl) {
  if (typeof dataUrl !== 'string') return null;
  const match = dataUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
  if (!match) return null;

  const mime = match[1].toLowerCase();
  const base64 = match[2];
  let ext = '.png';
  if (mime === 'image/jpeg' || mime === 'image/jpg') ext = '.jpg';
  if (mime === 'image/webp') ext = '.webp';
  if (mime === 'image/gif') ext = '.gif';

  return { ext, buffer: Buffer.from(base64, 'base64') };
}

export async function saveProductImage({ categoryName, imageData, imageName }) {
  const parsed = extractImageData(imageData);
  if (!parsed) return null;

  const categorySlug = slugify(categoryName);
  const base = sanitizeFileName(imageName || `${Date.now()}`);
  // Save into public/assets/products/ so images are git-tracked and survive server wipes
  const dir = path.join(ASSETS_PRODUCTS_ROOT, categorySlug);
  await fs.mkdir(dir, { recursive: true });

  let fileName = `${base}${parsed.ext}`;
  let fullPath = path.join(dir, fileName);
  if (fsSync.existsSync(fullPath)) {
    fileName = `${base}-${Date.now()}${parsed.ext}`;
    fullPath = path.join(dir, fileName);
  }

  await fs.writeFile(fullPath, parsed.buffer);
  return `/assets/products/${categorySlug}/${fileName}`;
}
