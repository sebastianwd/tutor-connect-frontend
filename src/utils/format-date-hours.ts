export function formatDateToDay(date: Date) {
  const formatter = new Intl.DateTimeFormat('es-ES', {
    weekday: 'long',
  })

  return formatter.format(date)
}
