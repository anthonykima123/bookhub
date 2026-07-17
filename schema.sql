DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS user_progress;
DROP TABLE IF EXISTS books;

CREATE TABLE books (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  author TEXT,
  publisher TEXT,
  subject TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('상', '중', '하')),
  total_pages INTEGER NOT NULL
);

CREATE TABLE user_progress (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  book_id INTEGER NOT NULL REFERENCES books(id),
  current_page INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE (user_id, book_id)
);

CREATE TABLE reviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  book_id INTEGER NOT NULL REFERENCES books(id),
  user_id TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  review_text TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_books_subject ON books(subject);
CREATE INDEX idx_progress_user ON user_progress(user_id);
CREATE INDEX idx_reviews_book ON reviews(book_id);

INSERT INTO books (title, author, publisher, subject, difficulty, total_pages) VALUES
('수학의 정석 (수학 1)', '홍성대', '성지출판', '수학', '중', 320),
('개념원리 수학 (상)', '이홍섭', '개념원리수학연구소', '수학', '하', 288),
('마더텅 수능기출 국어영역', '마더텅 편집부', '마더텅', '국어', '상', 480),
('자이스토리 국어', '자이스토리 편집부', '수경출판사', '국어', '중', 392),
('워드마스터 수능 2000', '이용재', '이투스북', '영어', '하', 256),
('수능특강 영어독해연습', 'EBS', 'EBS', '영어', '중', 264),
('하이탑 물리학 I', '박찬영 외', '동아출판', '과학', '상', 344),
('완자 통합과학', '이석록 외', '비상교육', '과학', '하', 312),
('한국사능력검정시험 기본서', '큰별쌤 최태성', '이투스북', '사회', '중', 368),
('개념완성 생활과 윤리', '정종민', '메가스터디북스', '사회', '하', 224);
