import { defineConfig, devices } from '@playwright/test';

// Accessibility checks (docs/ system "Seguridad, coste y cumplimiento").
// Serves the production SSR bundle, so run `pnpm build` first.
export default defineConfig({
  testDir: 'e2e',
  forbidOnly: !!process.env['CI'],
  reporter: process.env['CI'] ? 'github' : 'list',
  use: {
    baseURL: 'http://localhost:4000',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'node dist/perro-sanxe-comparator/server/server.mjs',
    url: 'http://localhost:4000',
    reuseExistingServer: !process.env['CI'],
    env: { PORT: '4000', NG_ALLOWED_HOSTS: 'localhost' },
  },
});
