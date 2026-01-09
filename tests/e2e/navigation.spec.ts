import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should display site title in navigation', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'agentconfig.org' })).toBeVisible()
  })

  test.describe('Desktop', () => {
    test.use({ viewport: { width: 1280, height: 720 } })

    test('should display all navigation links', async ({ page }) => {
      await expect(page.getByRole('button', { name: 'File Tree' })).toBeVisible()
      await expect(page.getByRole('button', { name: 'Primitives' })).toBeVisible()
      await expect(page.getByRole('button', { name: 'Recipes' })).toBeVisible()
      await expect(page.getByRole('button', { name: 'Comparison' })).toBeVisible()
    })

    test('should scroll to section when nav link is clicked', async ({ page }) => {
      const navButton = page.getByRole('button', { name: 'Primitives' })
      await navButton.click()

      // Wait for scroll to complete
      await page.waitForTimeout(500)

      // Check that the section is in view
      const section = page.locator('#primitives')
      await expect(section).toBeInViewport()
    })
  })

  test.describe('Mobile', () => {
    test.use({ viewport: { width: 375, height: 667 } })

    test('should display menu button', async ({ page }) => {
      await expect(page.getByRole('button', { name: 'Open menu' })).toBeVisible()
    })

    test('should open mobile menu when menu button is clicked', async ({ page }) => {
      const menuButton = page.getByRole('button', { name: 'Open menu' })
      await menuButton.click()

      await expect(page.getByRole('button', { name: 'File Tree' })).toBeVisible()
      await expect(page.getByRole('button', { name: 'Close menu' })).toBeVisible()
    })

    test('should close mobile menu when nav link is clicked', async ({ page }) => {
      const menuButton = page.getByRole('button', { name: 'Open menu' })
      await menuButton.click()

      const navButton = page.getByRole('button', { name: 'Recipes' })
      await navButton.click()

      // Menu should close
      await expect(page.getByRole('button', { name: 'Open menu' })).toBeVisible()
    })
  })
})
