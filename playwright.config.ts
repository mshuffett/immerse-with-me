import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 30000,
  use: {
    baseURL: 'http://localhost:4173',
    screenshot: 'on',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'npx vite --port 4173',
    port: 4173,
    reuseExistingServer: false,
    timeout: 15000,
  },
});
