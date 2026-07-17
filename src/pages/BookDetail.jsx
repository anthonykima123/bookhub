import { useEffect, useState } from 'react'
import { getBookDetail, getProgress, saveProgress, getReviews, addReview } from '../api.js'

export default function BookDetail({ bookId, userId, onBack }) {
  const [book, setBook] = useState(null)
  const [progress, setProgress] = useState(null)
  const [pageInput, setPageInput] = useState('')
  const [reviews, setReviews] = useState([])
  const [rating, setRating] = useState(5)
  const [reviewText, setReviewText] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  async function loadAll() {
    setError('')
    try {
      const [bookData, progressData, reviewsData] = await Promise.all([
        getBookDetail(bookId),
        getProgress({ userId, bookId }),
        getReviews(bookId)
      ])
      setBook(bookData)
      setProgress(progressData)
      setPageInput(progressData ? String(progressData.current_page) : '0')
      setReviews(reviewsData)
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => {
    loadAll()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookId])

  async function handleSaveProgress(e) {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const currentPage = Number(pageInput)
      await saveProgress({ userId, bookId, currentPage })
      await loadAll()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleAddReview(e) {
    e.preventDefault()
    setError('')
    try {
      await addReview({ bookId, userId, rating, reviewText })
      setReviewText('')
      await loadAll()
    } catch (err) {
      setError(err.message)
    }
  }

  if (!book) {
    return (
      <section>
        <button className="link-button" onClick={onBack}>&larr; 검색으로</button>
        {error ? <p className="error">{error}</p> : <p className="hint">불러오는 중...</p>}
      </section>
    )
  }

  const percent = book.total_pages
    ? Math.min(100, Math.round(((progress?.current_page ?? 0) / book.total_pages) * 100))
    : 0

  return (
    <section>
      <button className="link-button" onClick={onBack}>&larr; 검색으로</button>

      <div className="book-detail-header">
        <h2>{book.title}</h2>
        <p className="book-meta">{book.author} · {book.publisher}</p>
        <div className="book-card-tags">
          <span className="tag">{book.subject}</span>
          <span className="tag">난이도 {book.difficulty}</span>
          <span className="tag">{book.total_pages}p</span>
          <span className="tag">
            평균 {book.avg_rating ? book.avg_rating.toFixed(1) : '-'}점 ({book.review_count}건)
          </span>
        </div>
      </div>

      {error && <p className="error">{error}</p>}

      <div className="panel">
        <h3>내 진도</h3>
        <div className="progress-bar">
          <div className="progress-bar-fill" style={{ width: `${percent}%` }} />
        </div>
        <p className="hint">{progress?.current_page ?? 0} / {book.total_pages}페이지 ({percent}%)</p>
        <form className="progress-form" onSubmit={handleSaveProgress}>
          <input
            type="number"
            min="0"
            max={book.total_pages}
            value={pageInput}
            onChange={(e) => setPageInput(e.target.value)}
          />
          <button type="submit" disabled={saving}>진도 저장</button>
        </form>
      </div>

      <div className="panel">
        <h3>리뷰 ({reviews.length})</h3>
        <form className="review-form" onSubmit={handleAddReview}>
          <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
            {[5, 4, 3, 2, 1].map((r) => (
              <option key={r} value={r}>{r}점</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="리뷰를 남겨주세요"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
          />
          <button type="submit">등록</button>
        </form>
        <ul className="review-list">
          {reviews.map((r) => (
            <li key={r.id} className="review-item">
              <span className="tag">{r.rating}점</span>
              <span>{r.review_text}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
