import {hasValue} from './condition'

export const requiredField = (v: string, field = 'This field') => {
  if (!hasValue(v)) {
    return `${field} is required.`
  }
  return ''
}
export const getInitials = (name: string) => {
  // supported formats: "John Doe", "John", "J. D.", "J.D.", "avinash.rathod"
  if (!name) return ''

  // Remove extra spaces and split by space or dot
  const parts = name
    .trim()
    .split(/[\s.]+/)
    .filter(part => part.length > 0)

  if (parts.length === 1) {
    // Handle single name like "John"
    return parts[0].charAt(0).toUpperCase()
  }

  // Handle multiple parts like "John Doe", "J. D.", or "avinash.rathod"
  let initials = ''
  for (const part of parts) {
    if (part.length > 0 && initials.length < 2) {
      // Take first letter of each part
      initials += part.charAt(0).toUpperCase()
    }
  }

  return initials.slice(0, 2)
}
