import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// Main routes; add new ones here when created.
const RUTAS = ['/', '/aviso-legal', '/privacidad'];

for (const ruta of RUTAS) {
  test(`WCAG AA sin infracciones: ${ruta}`, async ({ page }) => {
    await page.goto(ruta);
    await page.waitForLoadState('networkidle');
    const { violations } = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(violations).toEqual([]);
  });
}

test('WCAG AA sin infracciones: resultados de búsqueda', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Buscar artículo').fill('leche');
  await page.waitForLoadState('networkidle');
  const { violations } = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
    .analyze();
  expect(violations).toEqual([]);
});
