import { expect, test } from '@playwright/test';

const API_BASE = 'http://localhost:8000';

async function mockCommonApi(page: Parameters<typeof test>[0]['page']) {
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
          email: 'user@tec.mx',
          is_admin: false,
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
          {
            id: 2,
            name: 'Oculto',
            show: false,
            start_time: '2026-01-01T12:00:00.000Z',
            image: '/media/hidden.png',
            plays: [],
            needsUpdate: false,
          },
        ]),
      });
      return;
    }

    if (url.includes('/rental/plays/') && method === 'POST') {
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify('ok'),
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

test.describe('main page workflows', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.clear();
      window.sessionStorage.clear();
      window.localStorage.setItem(
        'user',
        JSON.stringify({
          id: '1',
          email: 'user@tec.mx',
          isAdmin: false,
          theme: 'dark',
          isActive: true,
        }),
      );
      window.localStorage.setItem(
        'tokens',
        JSON.stringify({ access_token: 'test-token', refresh_token: 'test-refresh' }),
      );
    });

    await mockCommonApi(page);
  });

  test('loads visible games and allows adding a student to a game', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByText('FIFA')).toBeVisible();
    await expect(page.getByText('Oculto')).not.toBeVisible();

    await page.locator('.cyber__card__inner').first().click();

    const studentInput = page.getByPlaceholder('Matricula de estudiante');
    await studentInput.fill('A01234567');

    await expect(page.getByText('Estudiante A01234567 agregado exitosamente')).toBeVisible();
  });

  test('opens main tutorials walkthrough', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('button', { name: 'Ver tutorial' }).first().click();

    await expect(page.locator('#driver-popover-title')).toContainText('Seleccionar');
    await expect(page.getByRole('button', { name: 'Siguiente' })).toBeVisible();
  });

  test('drags a student from one game card to another and updates play game id', async ({ page }) => {
    let patchPayload: Record<string, unknown> | null = null;

    await page.route(`${API_BASE}/rental/games/**`, async (route) => {
      if (route.request().method() !== 'GET') {
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({}) });
        return;
      }

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
            plays: [
              {
                id: 99,
                student: 'a01234567',
                game: 1,
                ended: false,
                time: '2026-01-01T12:05:00.000Z',
                notices: [],
                owed_materials: [],
              },
            ],
            needsUpdate: false,
          },
          {
            id: 2,
            name: 'Mario Kart',
            show: true,
            start_time: '2026-01-01T12:00:00.000Z',
            image: '/media/mario.png',
            plays: [],
            needsUpdate: false,
          },
        ]),
      });
    });

    await page.route(`${API_BASE}/rental/plays/**`, async (route) => {
      if (route.request().method() === 'PATCH') {
        patchPayload = route.request().postDataJSON() as Record<string, unknown>;
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({}) });
        return;
      }
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({}) });
    });

    await page.goto('/');

    await page.locator('.cyber__card__inner').first().click();

    const sourceStudent = page.locator('[id="99"]').first();
    const targetCard = page.locator('.cyber__card[data-cardgameid="2"]').first();

    await expect(sourceStudent).toBeVisible();
    await expect(targetCard).toBeVisible();

    const dataTransfer = await page.evaluateHandle(() => new DataTransfer());
    await sourceStudent.dispatchEvent('dragstart', { dataTransfer });
    await targetCard.dispatchEvent('dragover', { dataTransfer });
    await targetCard.dispatchEvent('drop', { dataTransfer });

    await expect
      .poll(() => patchPayload)
      .toEqual({ game: 2 });
  });

  test('shows error feedback when drag-and-drop play update fails', async ({ page }) => {
    await page.route(`${API_BASE}/rental/games/**`, async (route) => {
      if (route.request().method() !== 'GET') {
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({}) });
        return;
      }

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
            plays: [
              {
                id: 99,
                student: 'a01234567',
                game: 1,
                ended: false,
                time: '2026-01-01T12:05:00.000Z',
                notices: [],
                owed_materials: [],
              },
            ],
            needsUpdate: false,
          },
          {
            id: 2,
            name: 'Mario Kart',
            show: true,
            start_time: '2026-01-01T12:00:00.000Z',
            image: '/media/mario.png',
            plays: [],
            needsUpdate: false,
          },
        ]),
      });
    });

    await page.route(`${API_BASE}/rental/plays/**`, async (route) => {
      if (route.request().method() === 'PATCH') {
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ detail: 'server error' }),
        });
        return;
      }
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({}) });
    });

    await page.goto('/');
    await page.locator('.cyber__card__inner').first().click();

    const sourceStudent = page.locator('[id="99"]').first();
    const targetCard = page.locator('.cyber__card[data-cardgameid="2"]').first();

    await expect(sourceStudent).toBeVisible();
    await expect(targetCard).toBeVisible();

    const dataTransfer = await page.evaluateHandle(() => new DataTransfer());
    await sourceStudent.dispatchEvent('dragstart', { dataTransfer });
    await targetCard.dispatchEvent('dragover', { dataTransfer });
    await targetCard.dispatchEvent('drop', { dataTransfer });

    await expect(page.getByText('Error moviendo jugador, porfavor intenta de nuevo')).toBeVisible();
  });
});