export function scrollToSection(id: string) {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

export function handleSectionNav(e: React.MouseEvent, id: string) {
  e.preventDefault()
  scrollToSection(id)
}
