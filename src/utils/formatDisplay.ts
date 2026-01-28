export const formatDisplay = (value: unknown, fallback = '--'): string => {
  if (value === null || value === undefined) return fallback
  if (typeof value === 'string' && value.trim() === '') return fallback
  return String(value)
}
