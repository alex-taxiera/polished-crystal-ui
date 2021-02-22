export function getWindow () {
  if (typeof window !== 'undefined' && window.document) {
    return window
  }
}
