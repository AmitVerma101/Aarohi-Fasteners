const http = require('http');
const path = require('path');
const fs = require('fs/promises');
const fsSync = require('fs');

function loadEnvFile() {
  const envPath = path.join(__dirname, '..', '.env');
  if (!fsSync.existsSync(envPath)) return;

  const raw = fsSync.readFileSync(envPath, 'utf8');
  raw.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;

    const eqIndex = trimmed.indexOf('=');
    if (eqIndex === -1) return;

    const key = trimmed.slice(0, eqIndex).trim();
    if (!key || process.env[key] !== undefined) return;

    let value = trimmed.slice(eqIndex + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    process.env[key] = value;
  });
}

loadEnvFile();

const PORT = Number(process.env.PORT) || 4000;
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'change-me';
const SMTP_HOST = process.env.SMTP_HOST || '';
const SMTP_PORT = Number(process.env.SMTP_PORT) || 587;
const SMTP_SECURE = String(process.env.SMTP_SECURE || 'false').toLowerCase() === 'true';
const SMTP_USER = process.env.SMTP_USER || '';
const SMTP_PASS = process.env.SMTP_PASS || '';
const CONTACT_TO_EMAIL = process.env.CONTACT_TO_EMAIL || '';
const CONTACT_FROM_EMAIL = process.env.CONTACT_FROM_EMAIL || '';
const DB_PATH = path.join(__dirname, '..', 'data', 'db.json');
const BACKEND_ROOT = path.join(__dirname, '..');
const ASSETS_ROOT = path.join(BACKEND_ROOT, 'assets');
const PRODUCT_ASSETS_ROOT = path.join(ASSETS_ROOT, 'products');

const DEFAULT_CATEGORIES = [
  'Bolts',
  'Special Part',
  'Nuts',
  'Turning Component',
  'Dowel Pin',
  'Grub Screw',
  'Machine Screw',
  'Security Screw',
  'Sems Screw',
  'Washers',
];

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

function defaultCategorySvg(name) {
  return CATEGORY_SVG_MAP[name] || '<svg viewBox="0 0 24 24" aria-hidden="true"><polygon points="12,3 21,8 21,16 12,21 3,16 3,8"/><circle cx="12" cy="12" r="3"/></svg>';
}

const IMAGE_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif']);

function slugify(text) {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'misc';
}

function sanitizeFileName(name) {
  return String(name || 'image')
    .replace(/\.[a-zA-Z0-9]+$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '') || 'image';
}

function defaultProductDescription(name, category) {
  return `${name} is a dependable ${category.toLowerCase()} solution designed for daily industrial use, with consistent performance and reliable fitment.`;
}

function isImageFile(fileName) {
  const ext = path.extname(fileName).toLowerCase();
  return IMAGE_EXTENSIONS.has(ext);
}

function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === '.png') return 'image/png';
  if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg';
  if (ext === '.webp') return 'image/webp';
  if (ext === '.gif') return 'image/gif';
  return 'application/octet-stream';
}

function sendJson(res, status, payload) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type,x-admin-token',
  });
  res.end(JSON.stringify(payload));
}

function sendFile(res, status, contentType, payload) {
  res.writeHead(status, {
    'Content-Type': contentType,
    'Access-Control-Allow-Origin': '*',
  });
  res.end(payload);
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

async function sendContactEmail(payload) {
  let nodemailer;
  try {
    nodemailer = require('nodemailer');
  } catch {
    throw new Error('Mail library not installed. Run npm install in backend.');
  }

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !CONTACT_TO_EMAIL) {
    throw new Error('SMTP config missing. Set SMTP_HOST, SMTP_USER, SMTP_PASS, CONTACT_TO_EMAIL.');
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_SECURE,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  const senderName = `${payload.firstName} ${payload.lastName}`.trim();
  const fromAddress = CONTACT_FROM_EMAIL || SMTP_USER;
  const subject = `Website Contact: ${payload.subject}`;
  const text = [
    `Name: ${senderName}`,
    `Email: ${payload.email}`,
    `Subject: ${payload.subject}`,
    '',
    'Message:',
    payload.message,
  ].join('\n');

  const html = `
    <h2>New Contact Form Submission</h2>
    <p><strong>Name:</strong> ${escapeHtml(senderName)}</p>
    <p><strong>Email:</strong> ${escapeHtml(payload.email)}</p>
    <p><strong>Subject:</strong> ${escapeHtml(payload.subject)}</p>
    <p><strong>Message:</strong></p>
    <p>${escapeHtml(payload.message).replace(/\n/g, '<br/>')}</p>
  `;

  await transporter.sendMail({
    from: fromAddress,
    to: CONTACT_TO_EMAIL,
    replyTo: payload.email,
    subject,
    text,
    html,
  });
}

async function readDb() {
  try {
    const raw = await fs.readFile(DB_PATH, 'utf8');
    const parsed = JSON.parse(raw);

    const categories = Array.isArray(parsed.categories)
      ? parsed.categories
        .map((c) => normalizeCategoryObject(c))
        .filter((c) => c.name)
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

async function writeDb(db) {
  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2), 'utf8');
}

async function parseBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString('utf8');
  if (!raw) return {};
  return JSON.parse(raw);
}

function requireAdmin(req, res) {
  const token = req.headers['x-admin-token'];
  if (!token || token !== ADMIN_TOKEN) {
    sendJson(res, 401, { error: 'Unauthorized. Provide x-admin-token header.' });
    return false;
  }
  return true;
}

function extractImageData(dataUrl) {
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

async function saveProductImage({ categoryName, imageData, imageName }) {
  const parsed = extractImageData(imageData);
  if (!parsed) return null;

  const categorySlug = slugify(categoryName);
  const base = sanitizeFileName(imageName || `${Date.now()}`);
  const dir = path.join(PRODUCT_ASSETS_ROOT, categorySlug);
  await fs.mkdir(dir, { recursive: true });

  let fileName = `${base}${parsed.ext}`;
  let fullPath = path.join(dir, fileName);
  if (fsSync.existsSync(fullPath)) {
    fileName = `${base}-${Date.now()}${parsed.ext}`;
    fullPath = path.join(dir, fileName);
  }

  await fs.writeFile(fullPath, parsed.buffer);
  const rel = path.relative(BACKEND_ROOT, fullPath).split(path.sep).join('/');
  return `/${rel}`;
}

function normalizeCategoryName(name) {
  const value = typeof name === 'string' ? name.trim() : '';
  return value;
}

function normalizeHomeSvg(svg) {
  return typeof svg === 'string' ? svg.trim() : '';
}

function normalizeCategoryObject(input) {
  const name = normalizeCategoryName(typeof input === 'string' ? input : input?.name);
  return {
    name,
    isRecommended: Boolean(input?.isRecommended),
    homeSvg: normalizeHomeSvg(input?.homeSvg) || defaultCategorySvg(name),
  };
}

function categoryNames(categories) {
  return categories.map((c) => c.name);
}

function nextProductId(products) {
  return products.reduce((max, p) => Math.max(max, Number(p.id) || 0), 0) + 1;
}

function nameFromImageFile(fileName) {
  return path.parse(fileName).name;
}

async function autoSyncProductsFromFolders(db, options = {}) {
  const { createMissingProducts = false } = options;
  const categoryNameSet = new Set([...DEFAULT_CATEGORIES, ...categoryNames(db.categories)]);
  const categoryNameList = Array.from(categoryNameSet);
  const products = [...db.products];
  let changed = false;

  for (const category of categoryNameList) {
    const slug = slugify(category);
    const folder = path.join(PRODUCT_ASSETS_ROOT, slug);
    if (!fsSync.existsSync(folder)) continue;

    const files = await fs.readdir(folder);
    for (const file of files) {
      if (!isImageFile(file)) continue;
      const productName = nameFromImageFile(file);
      const imageSrc = `/assets/products/${slug}/${file}`;

      const existing = products.find(
        (p) => p.category.toLowerCase() === category.toLowerCase() && p.name.toLowerCase() === productName.toLowerCase()
      );

      if (existing) {
        if (existing.imageSrc !== imageSrc) {
          existing.imageSrc = imageSrc;
          changed = true;
        }
        continue;
      }

      if (createMissingProducts) {
        products.push({
          id: nextProductId(products),
          name: productName,
          category,
          imageSrc,
          isBestChoice: false,
          description: defaultProductDescription(productName, category),
          homeSvg: '',
        });
        changed = true;
      }
    }
  }

  if (changed) {
    db.products = products;
  }

  return changed;
}

async function ensureDbInitialized() {
  const db = await readDb();

  if (!db.categories.length) {
    db.categories = DEFAULT_CATEGORIES.map((name) => normalizeCategoryObject({ name }));
  } else {
    const existingNames = new Set(categoryNames(db.categories).map((name) => name.toLowerCase()));
    for (const name of DEFAULT_CATEGORIES) {
      if (existingNames.has(name.toLowerCase())) continue;
      db.categories.push(normalizeCategoryObject({ name }));
    }
  }

  const shouldSeedFromFolders = db.products.length === 0;
  const changedByScan = await autoSyncProductsFromFolders(db, { createMissingProducts: shouldSeedFromFolders });
  if (changedByScan || !fsSync.existsSync(DB_PATH)) {
    await writeDb(db);
  }
}

async function serveAsset(req, res, pathname) {
  const relativePath = decodeURIComponent(pathname.replace(/^\/assets\/?/, ''));
  const fullPath = path.resolve(ASSETS_ROOT, relativePath);
  const rootResolved = path.resolve(ASSETS_ROOT);

  if (!(fullPath === rootResolved || fullPath.startsWith(`${rootResolved}${path.sep}`))) {
    return sendJson(res, 403, { error: 'Forbidden.' });
  }

  try {
    const data = await fs.readFile(fullPath);
    return sendFile(res, 200, getMimeType(fullPath), data);
  } catch {
    return sendJson(res, 404, { error: 'Asset not found.' });
  }
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type,x-admin-token',
    });
    return res.end();
  }

  if (req.method === 'GET' && url.pathname.startsWith('/assets/')) {
    return serveAsset(req, res, url.pathname);
  }

  if (req.method === 'GET' && url.pathname === '/api/health') {
    return sendJson(res, 200, { ok: true });
  }

  if (req.method === 'POST' && url.pathname === '/api/contact') {
    try {
      const body = await parseBody(req);
      const payload = {
        firstName: typeof body.firstName === 'string' ? body.firstName.trim() : '',
        lastName: typeof body.lastName === 'string' ? body.lastName.trim() : '',
        email: typeof body.email === 'string' ? body.email.trim() : '',
        subject: typeof body.subject === 'string' ? body.subject.trim() : '',
        message: typeof body.message === 'string' ? body.message.trim() : '',
      };

      if (!payload.firstName || !payload.lastName || !payload.email || !payload.subject || !payload.message) {
        return sendJson(res, 400, { error: 'All fields are required.' });
      }

      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email);
      if (!emailOk) {
        return sendJson(res, 400, { error: 'Valid email is required.' });
      }

      await sendContactEmail(payload);
      return sendJson(res, 200, { ok: true, message: 'Message sent successfully.' });
    } catch (err) {
      const message = err && err.message ? err.message : 'Unable to send email.';
      return sendJson(res, 500, { error: message });
    }
  }

  if (req.method === 'GET' && url.pathname === '/api/products') {
    const db = await readDb();
    const bestChoiceOnly =
      url.searchParams.get('bestChoice') === 'true' ||
      url.searchParams.get('featured') === 'true';
    const category = url.searchParams.get('category');

    let list = [...db.products];
    if (bestChoiceOnly) list = list.filter((p) => p.isBestChoice);
    if (category && category !== 'All') list = list.filter((p) => p.category === category);

    return sendJson(res, 200, { products: list });
  }

  if (req.method === 'GET' && url.pathname === '/api/categories') {
    const db = await readDb();
    return sendJson(res, 200, { categories: db.categories });
  }

  if (req.method === 'POST' && url.pathname === '/api/categories') {
    if (!requireAdmin(req, res)) return;

    try {
      const body = await parseBody(req);
      const category = normalizeCategoryObject(body);
      if (!category.name) return sendJson(res, 400, { error: 'Category name is required.' });

      const db = await readDb();
      const exists = db.categories.some((c) => c.name.toLowerCase() === category.name.toLowerCase());
      if (exists) return sendJson(res, 409, { error: 'Category already exists.' });

      db.categories.push(category);
      await writeDb(db);
      return sendJson(res, 201, { category });
    } catch {
      return sendJson(res, 400, { error: 'Invalid JSON body.' });
    }
  }

  if (req.method === 'PUT' && /^\/api\/categories\/\d+$/.test(url.pathname)) {
    if (!requireAdmin(req, res)) return;

    try {
      const categoryIndex = Number(url.pathname.split('/').pop()) - 1;
      const body = await parseBody(req);
      const nextCategory = normalizeCategoryObject(body);

      const db = await readDb();
      const currentName = db.categories[categoryIndex];
      if (!currentName) return sendJson(res, 404, { error: 'Category not found.' });
      if (!nextCategory.name) return sendJson(res, 400, { error: 'Category name is required.' });

      const duplicate = db.categories.some(
        (category, idx) => idx !== categoryIndex && category.name.toLowerCase() === nextCategory.name.toLowerCase()
      );
      if (duplicate) return sendJson(res, 409, { error: 'Category already exists.' });

      db.categories[categoryIndex] = nextCategory;
      db.products = db.products.map((product) =>
        product.category === currentName.name ? { ...product, category: nextCategory.name } : product
      );

      await writeDb(db);
      return sendJson(res, 200, { category: nextCategory });
    } catch {
      return sendJson(res, 400, { error: 'Invalid JSON body.' });
    }
  }

  if (req.method === 'DELETE' && /^\/api\/categories\/\d+$/.test(url.pathname)) {
    if (!requireAdmin(req, res)) return;

    const categoryIndex = Number(url.pathname.split('/').pop()) - 1;
    const db = await readDb();
    const category = db.categories[categoryIndex];

    if (!category) {
      return sendJson(res, 404, { error: 'Category not found.' });
    }

    db.categories = db.categories.filter((_, idx) => idx !== categoryIndex);
    db.products = db.products.filter((product) => product.category !== category.name);
    await writeDb(db);
    return sendJson(res, 200, { category: category.name, deletedProducts: true });
  }

  if (req.method === 'POST' && url.pathname === '/api/products') {
    if (!requireAdmin(req, res)) return;

    try {
      const body = await parseBody(req);
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
        return sendJson(res, 400, { error: 'Product name and category are required.' });
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
      return sendJson(res, 201, { product });
    } catch {
      return sendJson(res, 400, { error: 'Invalid JSON body.' });
    }
  }

  if (req.method === 'PUT' && /^\/api\/products\/\d+$/.test(url.pathname)) {
    if (!requireAdmin(req, res)) return;

    try {
      const id = Number(url.pathname.split('/').pop());
      const body = await parseBody(req);
      const db = await readDb();

      const index = db.products.findIndex((p) => Number(p.id) === id);
      if (index === -1) return sendJson(res, 404, { error: 'Product not found.' });

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
        return sendJson(res, 400, { error: 'Product name and category are required.' });
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
      return sendJson(res, 200, { product: db.products[index] });
    } catch {
      return sendJson(res, 400, { error: 'Invalid JSON body.' });
    }
  }

  if (req.method === 'DELETE' && /^\/api\/products\/\d+$/.test(url.pathname)) {
    if (!requireAdmin(req, res)) return;

    const id = Number(url.pathname.split('/').pop());
    const db = await readDb();
    const index = db.products.findIndex((p) => Number(p.id) === id);

    if (index === -1) {
      return sendJson(res, 404, { error: 'Product not found.' });
    }

    const [removed] = db.products.splice(index, 1);
    await writeDb(db);
    return sendJson(res, 200, { product: removed });
  }

  return sendJson(res, 404, { error: 'Route not found.' });
});

ensureDbInitialized()
  .then(() => {
    server.listen(PORT, '0.0.0.0', () => {
      console.log(`API server running on http://127.0.0.1:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to initialize API server:', err);
    process.exit(1);
  });
