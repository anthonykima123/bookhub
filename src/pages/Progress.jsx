import { useEffect, useState } from 'react'
import { getProgress } from '../api.js'

export default function Progress({ userId, onSelectBook }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    getProgress({ userId })
      .then((data) => { if (!cancelled) setItems(data) })
      .catch((err) => { if (!cancelled) setError(err.message) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [userId])

  if (loading) return <p className="hint">불러오는 중...</p>
  if (error) return <p className="error">{error}</p>
  if (items.length === 0) {
    return <p className="hint">아직 추적 중인 책이 없어요. 검색 탭에서 책을 찾아 진도를 기록해보세요.</p>
  }

  return (
    <ul className="book-list">
      {items.map((item) => {
        const percent = item.total_pages
          ? Math.min(100, Math.round((item.current_page / item.total_pages) * 100))
          : 0
        return (
          <li key={item.book_id} className="book-card" onClick={() => onSelectBook(item.book_id)}>
            <div className="book-card-main">
              <strong>{item.title}</strong>
              <span className="book-meta">{item.subject}</span>
            </div>
            <div className="progress-bar">
              <div className="progress-bar-fill" style={{ width: `${percent}%` }} />
            </div>
            <p className="hint">{item.current_page} / {item.total_pages}페이지 ({percent}%)</p>
          </li>
        )
      })}
    </ul>
  )
}
