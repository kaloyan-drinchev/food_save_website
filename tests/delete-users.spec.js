// @ts-check
import { test, expect } from '@playwright/test';

/**
 * Admin "Users" table uses in-memory mock data (UserManagement.vue + generateMockUsers).
 * Deleting a user only mutates the Vue ref in the browser — no API calls, no database.
 */

async function loginAsAdmin(page) {
  await page.goto('/admin');
  await page.getByLabel('Username').fill('admin');
  await page.getByLabel('Password').fill('guiadmin');
  await page.getByRole('button', { name: 'Sign In' }).click();
  await expect(page.getByRole('heading', { name: 'Admin Dashboard' })).toBeVisible();
}

async function openOperationsUsers(page) {
  await page.goto('/admin/operations');
  await expect(page.getByPlaceholder('Search by name, email, or ID...')).toBeVisible();
  await expect(page.getByRole('button', { name: /Users/ })).toHaveClass(/active/);
}

/**
 * @param {import('@playwright/test').Page} page
 * @param {string} userId e.g. USR-1001
 * @param {string} expectedName for toast assertion
 */
async function deleteUserById(page, userId, expectedName) {
  const row = page.locator('tbody tr').filter({ hasText: userId });
  await expect(row).toBeVisible();

  await row.locator('button.kebab-btn').click();
  await page.getByRole('button', { name: 'Delete', exact: true }).click();

  await expect(page.getByRole('heading', { name: 'Delete User' })).toBeVisible();
  await expect(page.getByText(`Are you sure you want to permanently delete`)).toBeVisible();
  await page.getByRole('button', { name: 'Yes, Delete' }).click();

  await expect(page.locator('.ops-toast')).toContainText(`${expectedName} has been deleted`);
  await expect(page.locator('tbody tr').filter({ hasText: userId })).toHaveCount(0);
}

test.beforeEach(async ({ page }) => {
  await loginAsAdmin(page);
  await openOperationsUsers(page);
});

test('deletes one mock user from the table', async ({ page }) => {
  // generateMockUsers: index 1 → USR-1001, Maria Koleva (deterministic)
  await deleteUserById(page, 'USR-1001', 'Maria Koleva');
});

test('deletes another mock user from the table', async ({ page }) => {
  // index 4 → USR-1004, Nikolay Todorov
  await deleteUserById(page, 'USR-1004', 'Nikolay Todorov');
});
