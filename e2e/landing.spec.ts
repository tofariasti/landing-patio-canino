import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('Landing page', () => {
  test('loads hero and navigation', async ({ page }, testInfo) => {
    await page.goto('./')
    await expect(page.getByRole('heading', { level: 1 })).toContainText('livre de gaiolas')

    if (testInfo.project.name === 'desktop') {
      await expect(page.getByRole('navigation', { name: 'Navegação principal' })).toBeVisible()
    } else {
      await expect(page.getByRole('button', { name: /menu/i })).toBeVisible()
      await expect(page.getByRole('navigation', { name: 'Navegação rápida' })).toBeVisible()
    }
  })

  test('price calculator works', async ({ page }) => {
    await page.goto('./')
    await page.getByRole('button', { name: 'Calcular orçamento' }).scrollIntoViewIfNeeded()
    await page.getByRole('button', { name: 'Calcular orçamento' }).click()
    await expect(page.getByRole('status')).toBeVisible()
  })

  test('contact form validates required fields', async ({ page }) => {
    await page.goto('./')
    await page.getByLabel('Nome completo *').scrollIntoViewIfNeeded()
    await page.getByRole('button', { name: 'Enviar via WhatsApp' }).click()
    await expect(page.getByRole('alert').first()).toBeVisible()
  })

  test('should not have critical accessibility violations on landing', async ({ page }) => {
    await page.goto('./')
    const results = await new AxeBuilder({ page }).analyze()
    const critical = results.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious',
    )
    expect(critical).toEqual([])
  })
})
