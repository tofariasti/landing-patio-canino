import { describe, it, expect } from 'vitest'
import { validateContactForm, buildWhatsAppMessage } from '../utils/whatsapp'

describe('whatsapp', () => {
  it('validates required fields', () => {
    const errors = validateContactForm({
      nome: '',
      telefone: '',
      email: '',
      servico: '',
      preferencia: '',
      mensagem: '',
    })
    expect(errors.nome).toBeDefined()
    expect(errors.telefone).toBeDefined()
    expect(errors.servico).toBeDefined()
    expect(errors.preferencia).toBeDefined()
  })

  it('builds structured message', () => {
    const msg = buildWhatsAppMessage({
      nome: 'Maria',
      telefone: '51999999999',
      email: 'maria@test.demo',
      servico: 'Hospedagem',
      preferencia: 'Visita ao pátio',
      mensagem: 'Thor, 4 dias',
    })
    expect(msg).toContain('*Nome:* Maria')
    expect(msg).toContain('Hospedagem')
    expect(msg).toContain('Thor, 4 dias')
    expect(msg).toContain('Pátio Canino')
  })
})
