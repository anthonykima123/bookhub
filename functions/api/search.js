import { json } from '../_utils.js'

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url)
  const query = url.searchParams.get('query')?.trim() || ''
  const subject = url.searchParams.get('subject')?.trim() || ''
  const difficulty = url.searchParams.get('difficulty')?.trim() || ''

  const conditions = []
  const params = []

  if (query) {
    conditions.push('(title LIKE ? OR author LIKE ?)')
    params.push(`%${query}%`, `%${query}%`)
  }
  if (subject) {
    conditions.push('subject = ?')
    params.push(subject)
  }
  if (difficulty) {
    conditions.push('difficulty = ?')
    params.push(difficulty)
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''
  const stmt = env.DB.prepare(
    `SELECT id, title, author, publisher, subject, difficulty, total_pages FROM books ${where} ORDER BY title`
  ).bind(...params)

  const { results } = await stmt.all()
  return json(results)
}
