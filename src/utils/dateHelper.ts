export const toBoundaryIsoString = (date: Date, boundary: 'start' | 'end') => {
  const nextDate = new Date(date)
  if (boundary === 'start') {
    nextDate.setHours(0, 0, 0, 0)
  } else {
    nextDate.setHours(23, 59, 59, 999)
  }
  return nextDate.toISOString()
}

export const parseDateValue = (val: string): Date | null => {
  if (!val) return null
  if (val.includes('T')) return new Date(val)
  const parts = val.split('-').map(Number)
  if (parts.length !== 3) return new Date(val)
  return new Date(parts[0], parts[1] - 1, parts[2])
}
