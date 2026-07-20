import { expect, test } from '@playwright/test';

const API_BASE = 'http://localhost:8000';

async function mockAdminApi(page: Parameters<typeof test>[0]['page']) {
  await page.route(`${API_BASE}/**`, async (route) => {
    const request = route.request();
    const url = request.url();
    const method = request.method();

    if (url.includes('/users/me/')) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: '1',
          email: 'admin@tec.mx',
          is_admin: true,
          theme: 'dark',
          is_active: true,
        }),
      });
      return;
    }

    if (url.includes('/rental/announcements/')) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      });
      return;
    }

    if (url.includes('/rental/games/') && method === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: 1,
            name: 'FIFA',
            show: true,
            start_time: '2026-01-01T12:00:00.000Z',
            image: '/media/fifa.png',
            plays: [],
            needsUpdate: false,
          },
        ]),
      });
      return;
    }

    if (url.includes('/rental/plays/') && method === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ results: [] }),
      });
      return;
    }

    if (method === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      });
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({}),
    });
  });
}

async function dismissVisibleCloseButtons(page: Parameters<typeof test>[0]['page']) {
  const closeButtons = page.getByRole('button', { name: /close/i });
  const count = await closeButtons.count();
  for (let i = 0; i < count; i += 1) {
    const button = closeButtons.nth(i);
    if (await button.isVisible()) {
      await button.click();
    }
  }
}

test.describe('admin workflows', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.clear();
      window.sessionStorage.clear();
      window.localStorage.setItem(
        'user',
        JSON.stringify({
          id: '1',
          email: 'admin@tec.mx',
          isAdmin: true,
          theme: 'dark',
          isActive: true,
        }),
      );
      window.localStorage.setItem(
        'tokens',
        JSON.stringify({ access_token: 'test-token', refresh_token: 'test-refresh' }),
      );
    });

    await mockAdminApi(page);
  });

  test('allows admin to access admin page and expand students section', async ({ page }) => {
    await page.goto('/admin');

    await expect(page).toHaveURL(/\/admin$/);
    await expect(page.getByText('Panel')).toBeVisible();
    await expect(page.getByRole('button', { name: 'ADMIN', exact: true }).first()).toBeVisible();
  });

  test('opens admin tutorials walkthrough', async ({ page }) => {
    await page.goto('/admin');

    await expect(page.getByText('Guías y tutoriales')).toBeVisible();
    await dismissVisibleCloseButtons(page);

    await page.locator('button:has(svg[data-testid="HelpIcon"])').click();

    await expect(page.locator('#driver-popover-title')).toContainText('Tutoriales');
    await expect(page.getByRole('button', { name: 'Siguiente' })).toBeVisible();
  });
});