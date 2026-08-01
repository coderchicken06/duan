export function showCartToast(message) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('carstore-toast', { detail: message }))
  }
}
