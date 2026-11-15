import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.resolve(__dirname, '../public');
const sitemapPath = path.join(publicDir, 'sitemap.xml');

const HOST = 'www.arkyedu.com';
const INDEXNOW_KEY = 'a7f4e9c281b54d3e9f6a0c4b2e8d1a5c';
const KEY_LOCATION = `https://${HOST}/${INDEXNOW_KEY}.txt`;
const keyFilePath = path.join(publicDir, `${INDEXNOW_KEY}.txt`);
const MAX_BATCH_SIZE = 10000;

interface SitemapBreakdown {
  total: number;
  courses: number;
  blog: number;
  glossary: number;
  hubsAndFeeds: number;
}

function validateKeyFile(): void {
  if (!fs.existsSync(keyFilePath)) {
    console.error(`IndexNow verification key file missing: public/${INDEXNOW_KEY}.txt`);
    process.exit(1);
  }
  const contents = fs.readFileSync(keyFilePath, 'utf-8').trim();
  if (contents !== INDEXNOW_KEY) {
    console.error(`IndexNow key file mismatch: expected "${INDEXNOW_KEY}", got "${contents}"`);
    process.exit(1);
  }
}

function extractSitemapUrls(): { urls: string[]; breakdown: SitemapBreakdown } {
  if (!fs.existsSync(sitemapPath)) {
    console.error('sitemap.xml not found in public/. Run npm run build first.');
    process.exit(1);
  }

  const xml = fs.readFileSync(sitemapPath, 'utf-8');
  const matches = Array.from(xml.matchAll(/<loc>(https:\/\/[^<\s]+)<\/loc>/g));
  const rawUrls = matches.map((m) => m[1]);
  const urls = Array.from(new Set(rawUrls));

  if (urls.length === 0) {
    console.error('No valid HTTPS URLs found in public/sitemap.xml.');
    process.exit(1);
  }

  const invalidHostUrls = urls.filter((u) => !u.startsWith(`https://${HOST}/`));
  if (invalidHostUrls.length > 0) {
    console.error(`Found URLs not matching https://${HOST}/:`, invalidHostUrls.slice(0, 5));
    process.exit(1);
  }

  const breakdown: SitemapBreakdown = {
    total: urls.length,
    courses: urls.filter((u) => u.includes('/cursuri/')).length,
    blog: urls.filter((u) => u.includes('/blog/')).length,
    glossary: urls.filter((u) => u.includes('/glosar/')).length,
    hubsAndFeeds: urls.filter(
      (u) => !u.includes('/cursuri/') && !u.includes('/blog/') && !u.includes('/glosar/')
    ).length,
  };

  return { urls, breakdown };
}

async function submitBatch(urlBatch: string[], batchIndex: number, totalBatches: number): Promise<void> {
  const response = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({
      host: HOST,
      key: INDEXNOW_KEY,
      keyLocation: KEY_LOCATION,
      urlList: urlBatch,
    }),
  });

  if (response.ok || response.status === 202) {
    console.log(
      `[Batch ${batchIndex + 1}/${totalBatches}] IndexNow accepted ${urlBatch.length} URLs (HTTP ${response.status}).`
    );
  } else {
    const body = await response.text();
    console.error(`[Batch ${batchIndex + 1}/${totalBatches}] IndexNow HTTP ${response.status}: ${body}`);
    process.exit(1);
  }
}

async function main(): Promise<void> {
  const isDryRun = process.argv.includes('--dry-run');

  validateKeyFile();
  const { urls, breakdown } = extractSitemapUrls();

  console.log(`IndexNow key verified: ${KEY_LOCATION}`);
  console.log(
    `Sitemap verified (${breakdown.total} unique URLs): ` +
      `${breakdown.hubsAndFeeds} hubs/AI/sandbox, ` +
      `${breakdown.courses} courses, ` +
      `${breakdown.blog} blog guides, ` +
      `${breakdown.glossary} glossary pages.`
  );

  if (isDryRun) {
    console.log('Dry-run complete (no network submission). Key sample URLs:');
    urls.slice(0, 8).forEach((u) => console.log(`  - ${u}`));
    return;
  }

  const totalBatches = Math.ceil(urls.length / MAX_BATCH_SIZE);
  console.log(`Submitting ${urls.length} URLs to IndexNow (${HOST}) in ${totalBatches} batch(es)...`);

  for (let i = 0; i < totalBatches; i++) {
    const batch = urls.slice(i * MAX_BATCH_SIZE, (i + 1) * MAX_BATCH_SIZE);
    await submitBatch(batch, i, totalBatches);
  }
}

main().catch((err) => {
  console.error('IndexNow verification/submission failed:', err);
  process.exit(1);
});
