import { test, expect } from '@playwright/test'

test.describe('Mini-app', () => {
  test('navigates to dashboard and creates service', async ({ page }) => {
    await page.goto('./#/app')
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible()

    await page.goto('./#/app/servicos')
    await expect(page.getByRole('heading', { name: 'Serviços' })).toBeVisible()

    await page.getByRole('button', { name: '+ Novo serviço' }).click()
    await page.getByLabel('Nome *').fill('E2E Hospedagem Teste')
    await page.getByLabel('Preço (R$)').fill('90')
    await page.getByRole('button', { name: 'Salvar' }).click()

    await expect(page.getByText('E2E Hospedagem Teste')).toBeVisible()
  })

  test('creates tutor and reservation', async ({ page }) => {
    await page.goto('./#/app/clientes')
    await page.getByRole('button', { name: '+ Novo tutor' }).click()
    await page.getByLabel('Nome *').fill('E2E Tutor Pátio')
    await page.getByRole('button', { name: 'Salvar' }).click()

    await expect(page.getByRole('heading', { name: 'E2E Tutor Pátio' })).toBeVisible()

    await page.getByRole('button', { name: '+ Nova reserva' }).click()
    await page.getByLabel('Serviço *').selectOption({ index: 1 })
    await page.getByRole('button', { name: 'Salvar reserva' }).click()

    await expect(page.getByText('Agendado')).toBeVisible()
  })

  test('settings page toggles theme', async ({ page }) => {
    await page.goto('./#/app/configuracoes')
    await expect(page.getByRole('heading', { name: 'Configurações' })).toBeVisible()
    await page.getByRole('button', { name: 'Escuro' }).click()
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  })
})
