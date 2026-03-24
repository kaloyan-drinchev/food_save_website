// @ts-check
import { test, expect } from '@playwright/test';

test('login succeeds with valid credentials', async ({ page }) => {
  await page.goto('/admin');
  await page.getByLabel('Username').fill('admin');
  await page.getByLabel('Password').fill('guiadmin');
  await page.getByRole('button', { name: 'Sign In' }).click();
  await expect(page.getByRole('heading', { name: 'Admin Dashboard' })).toBeVisible();
});

test('login shows error with wrong credentials', async ({ page }) => {
  await page.goto('/admin');
  await page.getByLabel('Username').fill('wronguser');
  await page.getByLabel('Password').fill('wrongpass');
  await page.getByRole('button', { name: 'Sign In' }).click();

  await expect(page.getByText('Invalid credentials')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Admin Dashboard' })).not.toBeVisible();
});
