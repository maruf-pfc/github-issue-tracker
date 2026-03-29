/**
 * Gets a contrasting text color (black or white) for a given hex background color.
 * Uses the sRGB Luma method.
 * 
 * @param {string} hexColor - Hex color string (with or without #)
 * @returns {string} '#000000' or '#ffffff'
 */
export function getContrastColor(hexColor) {
  if (!hexColor) return '#000000'
  
  // Remove hash if present
  const hex = hexColor.replace('#', '')
  
  // Parse RGB
  const r = parseInt(hex.substr(0, 2), 16)
  const g = parseInt(hex.substr(2, 2), 16)
  const b = parseInt(hex.substr(4, 2), 16)
  
  // Calculate relative luminance (sRGB luminance)
  // According to ITU-R BT.709
  const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b
  
  // Threshold can be tweaked, 128 is middle
  return luma < 128 ? '#ffffff' : '#000000'
}
