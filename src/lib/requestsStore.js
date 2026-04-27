const ENDPOINT = '/api/requests'

export async function loadRequests() {
  const r = await fetch(ENDPOINT)
  if (!r.ok) throw new Error('שגיאה בטעינת הפניות')
  return r.json()
}

export async function saveRequest(payload) {
  const r = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!r.ok) {
    const err = await r.json().catch(() => ({}))
    throw new Error(err.error || 'שגיאה בשליחת הפנייה')
  }
  return r.json()
}

export async function deleteRequest(id) {
  const r = await fetch(`${ENDPOINT}?id=${encodeURIComponent(id)}`, { method: 'DELETE' })
  if (!r.ok) throw new Error('שגיאה במחיקת הפנייה')
}

export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result
      const base64 = String(result).split(',')[1] || ''
      resolve(base64)
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
