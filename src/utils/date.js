import { formatDistanceToNow, format } from 'date-fns'

/**
 * Formats a date relatively (e.g. "3 days ago")
 * @param {string|Date|number} date 
 */
export function formatRelative(date) {
  if (!date) return ''
  try {
    return formatDistanceToNow(new Date(date), { addSuffix: true })
  } catch (e) {
    return ''
  }
}

/**
 * Formats a date absolutely (e.g. "Oct 12, 2023")
 * @param {string|Date|number} date 
 */
export function formatAbsolute(date) {
  if (!date) return ''
  try {
    return format(new Date(date), 'MMM d, yyyy')
  } catch (e) {
    return ''
  }
}
