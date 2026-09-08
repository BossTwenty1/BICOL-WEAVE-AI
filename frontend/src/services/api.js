const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'

async function parseError(response) {
  try {
    const body = await response.json()
    return body.detail || `Request failed with status ${response.status}.`
  } catch {
    return `Request failed with status ${response.status}.`
  }
}

export async function getHealth(timeoutMs = 60000) {
  const controller = new AbortController()
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs)

  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      signal: controller.signal,
    })
    if (!response.ok) {
      throw new Error(await parseError(response))
    }
    return response.json()
  } finally {
    window.clearTimeout(timeoutId)
  }
}

export async function predictImage(file) {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch(`${API_BASE_URL}/predict`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    const error = new Error(await parseError(response))
    error.status = response.status
    throw error
  }

  return response.json()
}

export { API_BASE_URL }
