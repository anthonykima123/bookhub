import { json, errorResponse } from '../_utils.js'

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url)
  const bookId = url.searchParams.get('bookId')
  if (!bookId) return errorResponse('bookId가 필요합니다', 400)

  const { results } = await env.DB.prepare(
    'SELECT id, book_id, user_id, rating, review_text, created_at FROM reviews WHERE book_id = ? ORDER BY created_at DESC'
  ).bind(Number(bookId)).all()

  return json(results)
}

export async function onRequestPost({ request, env }) {
  const body = await request.json().catch(() => null)
  if (!body) return errorResponse('잘못된 요청 본문입니다', 400)

  const { bookId, userId, rating, reviewText } = body
  if (!bookId || !userId || !rating) {
    return errorResponse('bookId, userId, rating이 필요합니다', 400)
  }
  if (rating < 1 || rating > 5) {
    return errorResponse('rating은 1~5 사이여야 합니다', 400)
  }

  const result = await env.DB.prepare(
    `INSERT INTO reviews (book_id, user_id, rating, review_text, created_at)
     VALUES (?, ?, ?, ?, datetime('now'))`
  ).bind(Number(bookId), userId, Number(rating), reviewText || '').run()

  return json({ id: result.meta.last_row_id, ok: true }, { status: 201 })
}
