const BASE = '/api'

async function request(path, options) {
  const res = await fetch(`${BASE}${path}`, options)
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || `요청 실패 (${res.status})`)
  }
  return res.json()
}

export function searchBooks({ query = '', subject = '', difficulty = '' } = {}) {
  const params = new URLSearchParams()
  if (query) params.set('query', query)
  if (subject) params.set('subject', subject)
  if (difficulty) params.set('difficulty', difficulty)
  return request(`/search?${params.toString()}`)
}

export function getBookDetail(bookId) {
  return request(`/books/${bookId}`)
}

export function saveProgress({ userId, bookId, currentPage }) {
  return request('/progress', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, bookId, currentPage })
  })
}

export function getProgress({ userId, bookId } = {}) {
  const params = new URLSearchParams({ userId })
  if (bookId) params.set('bookId', bookId)
  return request(`/progress?${params.toString()}`)
}

export function addReview({ bookId, userId, rating, reviewText }) {
  return request('/reviews', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ bookId, userId, rating, reviewText })
  })
}

export function getReviews(bookId) {
  return request(`/reviews?bookId=${bookId}`)
}
