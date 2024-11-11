import { expect, test } from '@playwright/test'

test.describe('Home page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('has title', async ({ page }) => {
    await expect(
      page
        .getByRole('heading', { level: 1 })
        .filter({ hasText: /datadive docs/i }),
    ).toBeVisible()
  })
})
