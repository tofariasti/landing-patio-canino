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

  test('registers pet and care log', async ({ page }) => {
    await page.goto('./#/app/pets')
    await expect(page.getByRole('heading', { name: 'Pets' })).toBeVisible()
    await page.getByRole('button', { name: '+ Novo pet' }).click()
    await page.getByLabel('Nome *').fill('E2E Rex')
    await page.getByLabel('Tutor *').selectOption({ index: 1 })
    await page.getByRole('button', { name: 'Salvar' }).click()
    await expect(page.getByRole('heading', { name: 'E2E Rex' })).toBeVisible()

    await page.goto('./#/app/rotina')
    await page.getByRole('button', { name: '+ Novo registro' }).click()
    await page.getByLabel('Título *').fill('E2E passeio')
    await page.getByRole('button', { name: 'Salvar' }).click()
    await expect(page.getByText('E2E passeio')).toBeVisible()
  })

  test('gallery admin page loads upload controls', async ({ page }) => {
    await page.goto('./#/app/galeria')
    await expect(page.getByRole('heading', { name: 'Galeria' })).toBeVisible()
    await expect(page.getByText('Upload foto')).toBeVisible()
    await expect(page.getByLabel('Ou cole um link do YouTube')).toBeVisible()
  })

  test('settings page defaults to light and can toggle theme', async ({ page }) => {
    await page.goto('./#/app')
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')

    await page.goto('./#/app/configuracoes')
    await expect(page.getByRole('heading', { name: 'Configurações' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Claro' })).toHaveClass(/is-active/)

    await page.getByRole('button', { name: 'Escuro' }).click()
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')

    await page.getByRole('button', { name: 'Claro' }).click()
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
  })

  test('edits brand identity and whatsapp', async ({ page }) => {
    await page.goto('./#/app/configuracoes')
    await page.getByLabel('Nome da marca *').fill('Pátio Demo Brand')
    await page.getByLabel('WhatsApp (com DDI) *').fill('5551988776655')
    await page.getByLabel('Instagram').fill('https://instagram.com/patiodemo')
    await page.getByRole('button', { name: 'Salvar identidade' }).click()
    await expect(page.getByText(/Configurações salvas/)).toBeVisible()

    await page.goto('./')
    await expect(page.getByText('Pátio Demo Brand').first()).toBeVisible()
    const wa = page.locator('a[href*="wa.me/5551988776655"]').first()
    await expect(wa).toBeVisible()
  })
})

test.describe('Mini-app mobile', () => {
  test.use({ viewport: { width: 390, height: 844 } })

  test('bottom nav and sidebar work at 390px', async ({ page }) => {
    await page.goto('./#/app')
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible()

    const bottomNav = page.locator('.app-bottom-nav')
    await expect(bottomNav).toBeVisible()
    await expect(bottomNav.getByRole('link', { name: 'Pets' })).toBeVisible()

    const bodyWidth = await page.evaluate(() => document.documentElement.scrollWidth)
    expect(bodyWidth).toBeLessThanOrEqual(400)

    await bottomNav.getByRole('link', { name: 'Reservas' }).click()
    await expect(page.getByRole('heading', { name: 'Reservas' })).toBeVisible()

    await page.getByRole('button', { name: 'Abrir menu' }).click()
    await expect(page.locator('.app-sidebar.is-open')).toBeVisible()
    await page.getByRole('navigation', { name: 'Navegação do painel' })
      .getByRole('link', { name: 'Galeria' })
      .click()
    await expect(page.getByRole('heading', { name: 'Galeria' })).toBeVisible()
  })

  test('pets grid usable on mobile', async ({ page }) => {
    await page.goto('./#/app/pets')
    await expect(page.locator('.pets-grid .pet-card').first()).toBeVisible()
    await page.getByRole('button', { name: '+ Novo pet' }).click()
    await expect(page.getByRole('dialog')).toBeVisible()
    await page.getByRole('button', { name: 'Cancelar' }).click()
  })
})
