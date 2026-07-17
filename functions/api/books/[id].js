import { json, errorResponse } from '../../_utils.js'

export async function onRequestGet({ params, env }) {
  const id = Number(params.id)
  if (!Number.isInteger(id)) return errorResponse('잘못된 책 ID입니다', 400)

  const book = await env.DB.prepare(
    'SELECT id, title, author, publisher, subject, difficulty, total_pages FROM books WHERE id = ?'
  ).bind(id).first()

  if (!book) return errorResponse('책을 찾을 수 없습니다', 404)

  const stats = await env.DB.prepare(
    'SELECT AVG(rating) as avg_rating, COUNT(*) as review_count FROM reviews WHERE book_id = ?'
  ).bind(id).first()

  return json({
    ...book,
    avg_rating: stats?.avg_rating ?? null,
    review_count: stats?.review_count ?? 0
  })
}
