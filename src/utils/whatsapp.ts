import { WHATSAPP_NUMBER, STORE } from '../config/constants'

export interface ContactFormData {
  nome: string
  telefone: string
  email: string
  servico: string
  preferencia: string
  mensagem: string
}

export function validateContactForm(data: ContactFormData): Record<string, string> {
  const errors: Record<string, string> = {}

  if (!data.nome.trim()) errors.nome = 'Informe seu nome.'
  if (!data.telefone.trim()) errors.telefone = 'Informe seu telefone.'
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'E-mail inválido.'
  }
  if (!data.servico) errors.servico = 'Selecione um serviço.'
  if (!data.preferencia) errors.preferencia = 'Selecione como prefere ser atendido.'

  return errors
}

export function buildWhatsAppMessage(data: ContactFormData): string {
  const lines = [
    `Olá! Gostaria de informações sobre serviços na ${STORE.name}.`,
    '',
    `*Nome:* ${data.nome.trim()}`,
    `*Telefone:* ${data.telefone.trim()}`,
  ]

  if (data.email.trim()) lines.push(`*E-mail:* ${data.email.trim()}`)
  lines.push(`*Serviço de interesse:* ${data.servico}`)
  lines.push(`*Preferência:* ${data.preferencia}`)
  if (data.mensagem.trim()) lines.push(`*Mensagem:* ${data.mensagem.trim()}`)

  return lines.join('\n')
}

export function buildWhatsAppUrl(data: ContactFormData): string {
  const message = buildWhatsAppMessage(data)
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}

export function buildQuickWhatsAppUrl(text: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`
}
