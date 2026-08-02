# Checklist de Acessibilidade — Pátio Canino Demo

## Navegação e estrutura

- [x] `lang="pt-BR"` no HTML
- [x] Skip link para conteúdo principal
- [x] Landmarks: `header`, `main`, `footer`, `nav`
- [x] Hierarquia de headings (h1 → h2 → h3)

## Teclado e foco

- [x] Todos os interativos acessíveis via Tab
- [x] Focus visible em botões, links e inputs
- [x] FAQ accordion com `aria-expanded`
- [x] Menu mobile com `aria-expanded`
- [x] Simulador com `role="status"` no resultado

## Formulários

- [x] Labels explícitos em todos os campos
- [x] Erros com `role="alert"`
- [x] Campos obrigatórios indicados
- [x] Range slider com `aria-valuenow/min/max`

## Imagens e mídia

- [x] Alt text descritivo em imagens de conteúdo (Unsplash)
- [x] Imagens decorativas com `alt=""`

## Contraste e motion

- [x] Contraste WCAG AA (texto vs fundo)
- [x] `prefers-reduced-motion` desabilita animações Framer Motion
- [x] Bolhas do hero desabilitadas com reduced motion (via CSS global)

## Responsividade testada

| Dispositivo | Resolução | Status |
|-------------|-----------|--------|
| iPhone SE | 375×667 | ✅ |
| iPhone 14 | 390×844 | ✅ |
| iPad | 768×1024 | ✅ |
| Desktop | 1280×720 | ✅ |

## Testes automatizados

- Vitest: `pricing`, `whatsapp`, `useServices`, `useCustomers`
- Playwright + axe-core: landing sem violações critical/serious
