import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const sitemapPath = path.resolve(__dirname, '../public/sitemap.xml');

const HOST = 'www.arkyedu.com';
const INDEXNOW_KEY = 'a7f4e9c281b54d3e9f6a0c4b2e8d1a5c';
const KEY_LOCATION = `https://${HOST}/${INDEXNOW_KEY}.txt`;

async function notifyIndexNow() {
  if (!fs.existsSync(sitemapPath)) {
    console.error('sitemap.xml not found. Run npm run build first.');
    process.exit(1);
  }

  const xml = fs.readFileSync(sitemapPath, 'utf-8');
  const matches = Array.from(xml.matchAll(/<loc>(https:\/\/[^<]+)<\/loc>/g));
  const urlList = matches.map((m) => m[1]);

  if (urlList.length === 0) {
    console.error('No URLs found in sitemap.xml.');
    process.exit(1);
  }

  console.log(`Submitting ${urlList.length} URLs to IndexNow (${HOST})...`);

  const response = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({
      host: HOST,
      key: INDEXNOW_KEY,
      keyLocation: KEY_LOCATION,
      urlList,
    }),
  });

  if (response.ok || response.status === 202) {
    console.log(`IndexNow accepted ${urlList.length} URLs (HTTP ${response.status}).`);
  } else {
    const body = await response.text();
    console.error(`IndexNow returned HTTP ${response.status}: ${body}`);
    process.exit(1);
  }
}

notifyIndexNow().catch((err) => {
  console.error('IndexNow submission failed:', err);
  process.exit(1);
});
