import { readFileSync } from 'node:fs';
import { test, expect } from '@playwright/test';

// Applies the security headers from vercel.json to the local SSR server
// responses, so the CSP is exercised before it reaches production.
const vercel = JSON.parse(readFileSync('vercel.json', 'utf8')) as {
  headers: { source: string; headers: { key: string; value: string }[] }[];
};
const HEADERS = Object.fromEntries(vercel.headers[0].headers.map((h) => [h.key, h.value]));

test('la CSP de vercel.json no bloquea la app ni la búsqueda', async ({ page, baseURL }) => {
  const violations: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error' && /Content Security Policy/i.test(msg.text())) {
      violations.push(msg.text());
    }
  });
  await page.route(`${baseURL}/**`, async (route) => {
    const response = await route.fetch();
    await route.fulfill({ response, headers: { ...response.headers(), ...HEADERS } });
  });

  await page.goto('/');
  await page.getByLabel('Buscar artículo').fill('leche');
  await expect(page.getByText(/[1-9]\d* ENCONTRADOS/)).toBeVisible({ timeout: 15_000 });

  expect(violations).toEqual([]);
});
