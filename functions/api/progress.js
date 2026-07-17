import { json, errorResponse } from '../_utils.js'

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url)
  const userId = url.searchParams.get('userId')
  const bookId = url.searchParams.get('bookId')

  if (!userId) return errorResponse('userId가 필요합니다', 400)

  if (bookId) {
    const row = await env.DB.prepare(
      `SELECT up.book_id, up.current_page, up.updated_at, b.title, b.subject, b.total_pages
       FROM user_progress up JOIN books b ON b.id = up.book_id
       WHERE up.user_id = ? AND up.book_id = ?`
    ).bind(userId, Number(bookId)).first()
    return json(row || null)
  }

  const { results } = await env.DB.prepare(
    `SELECT up.book_id, up.current_page, up.updated_at, b.title, b.subject, b.total_pages
     FROM user_progress up JOIN books b ON b.id = up.book_id
     WHERE up.user_id = ?
     ORDER BY up.updated_at DESC`
  ).bind(userId).all()

  return json(results)
}

export async function onRequestPost({ request, env }) {
  const body = await request.json().catch(() => null)
  if (!body) return errorResponse('잘못된 요청 본문입니다', 400)

  const { userId, bookId, currentPage } = body
  if (!userId || !bookId || currentPage == null) {
    return errorResponse('userId, bookId, currentPage가 필요합니다', 400)
  }

  await env.DB.prepare(
    `INSERT INTO user_progress (user_id, book_id, current_page, updated_at)
     VALUES (?, ?, ?, datetime('now'))
     ON CONFLICT (user_id, book_id)
     DO UPDATE SET current_page = excluded.current_page, updated_at = excluded.updated_at`
  ).bind(userId, Number(bookId), Number(currentPage)).run()

  return json({ ok: true })
}
