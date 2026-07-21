import { expect, test } from '@playwright/test';

test.describe('admin access control', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.clear();
      window.sessionStorage.clear();
    });
  });

  test('redirects unauthenticated users away from the admin page', async ({ page }) => {
    await page.goto('/admin');

    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByText('Panel')).not.toBeVisible();
    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
  });
});