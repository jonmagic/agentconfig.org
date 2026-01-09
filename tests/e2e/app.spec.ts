import { test, expect } from '@playwright/test'

test.describe('App', () => {
  test('should load the home page', async ({ page }) => {
    await page.goto('/')

    await expect(page).toHaveTitle(/Vite \+ React/)
  })

  test('should render the main heading', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByRole('heading', { name: 'Vite + React' })).toBeVisible()
  })
})
