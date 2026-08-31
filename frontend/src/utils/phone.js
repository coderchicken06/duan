const VIETNAMESE_PHONE_PATTERN = /^0[35789]\d{8}$/

function cleanPhone(value) {
  return String(value || '').replace(/[\s.()\-]/g, '')
}

export function normalizePhone(value) {
  const phone = cleanPhone(value)
  if (phone.startsWith('+84')) return `0${phone.slice(3)}`
  if (phone.startsWith('84')) return `0${phone.slice(2)}`
  return phone
}

export function isValidPhone(value) {
  return VIETNAMESE_PHONE_PATTERN.test(normalizePhone(value))
}

export function formatPhone(value) {
  const phone = normalizePhone(value)
  return isValidPhone(phone)
    ? `${phone.slice(0, 4)} ${phone.slice(4, 7)} ${phone.slice(7)}`
    : phone
}

// Keep the existing imports stable while forms migrate to the shared names.
export const normalizeVietnamesePhone = normalizePhone
export const isValidVietnamesePhone = isValidPhone
