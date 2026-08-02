export function showCartToast(message, type = 'success') {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('carstore-toast', { detail: { message, type } }))
  }
}
