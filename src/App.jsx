import { useEffect, useState } from 'react'
import Search from './pages/Search.jsx'
import BookDetail from './pages/BookDetail.jsx'
import Progress from './pages/Progress.jsx'

function getOrCreateUserId() {
  let id = localStorage.getItem('bookhub_user_id')
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem('bookhub_user_id', id)
  }
  return id
}

export default function App() {
  const [userId] = useState(getOrCreateUserId)
  const [tab, setTab] = useState('search')
  const [selectedBookId, setSelectedBookId] = useState(null)

  useEffect(() => {
    if (tab !== 'detail') setSelectedBookId(null)
  }, [tab])

  function openBook(bookId) {
    setSelectedBookId(bookId)
    setTab('detail')
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>BookHub</h1>
        <p className="tagline">수험생을 위한 문제집 검색 &amp; 진도 관리</p>
      </header>

      <nav className="tabs">
        <button
          className={tab === 'search' ? 'tab active' : 'tab'}
          onClick={() => setTab('search')}
        >
          책 검색
        </button>
        <button
          className={tab === 'progress' ? 'tab active' : 'tab'}
          onClick={() => setTab('progress')}
        >
          내 진도
        </button>
      </nav>

      <main className="app-main">
        {tab === 'search' && <Search onSelectBook={openBook} />}
        {tab === 'progress' && <Progress userId={userId} onSelectBook={openBook} />}
        {tab === 'detail' && selectedBookId && (
          <BookDetail
            bookId={selectedBookId}
            userId={userId}
            onBack={() => setTab('search')}
          />
        )}
      </main>
    </div>
  )
}
