import { useEffect, useState } from 'react'
import { searchBooks } from '../api.js'

const SUBJECTS = ['전체', '국어', '수학', '영어', '과학', '사회']
const DIFFICULTIES = ['전체', '하', '중', '상']

export default function Search({ onSelectBook }) {
  const [query, setQuery] = useState('')
  const [subject, setSubject] = useState('전체')
  const [difficulty, setDifficulty] = useState('전체')
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function runSearch() {
    setLoading(true)
    setError('')
    try {
      const results = await searchBooks({
        query,
        subject: subject === '전체' ? '' : subject,
        difficulty: difficulty === '전체' ? '' : difficulty
      })
      setBooks(results)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    runSearch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <section>
      <form
        className="search-form"
        onSubmit={(e) => {
          e.preventDefault()
          runSearch()
        }}
      >
        <input
          type="text"
          placeholder="책 제목이나 저자로 검색"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select value={subject} onChange={(e) => setSubject(e.target.value)}>
          {SUBJECTS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
          {DIFFICULTIES.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
        <button type="submit">검색</button>
      </form>

      {loading && <p className="hint">검색 중...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && books.length === 0 && (
        <p className="hint">검색 결과가 없어요.</p>
      )}

      <ul className="book-list">
        {books.map((book) => (
          <li key={book.id} className="book-card" onClick={() => onSelectBook(book.id)}>
            <div className="book-card-main">
              <strong>{book.title}</strong>
              <span className="book-meta">{book.author} · {book.publisher}</span>
            </div>
            <div className="book-card-tags">
              <span className="tag">{book.subject}</span>
              <span className="tag">난이도 {book.difficulty}</span>
              <span className="tag">{book.total_pages}p</span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
