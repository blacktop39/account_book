# 작업 인계 문서

## 프로젝트 개요
Next.js 16 + NextAuth.js v5 기반 인증 시스템 + 가계부 기능 (Vercel 스타일 UI)
**PostgreSQL + Prisma 데이터베이스 연동 완료**

---

## 완료된 작업

### 카테고리 커스텀 기능 (최신)
- [x] Prisma Category 모델 추가
- [x] Category API 엔드포인트 (GET, POST, PATCH, DELETE)
- [x] useCategories 훅
- [x] 설정 페이지 UI (`/dashboard/settings`)
- [x] 아이콘 선택기 (30개 아이콘)
- [x] 색상 선택기 (12개 색상)
- [x] 기존 코드 연동 (transaction-form, category-badge)

### 거래 기능
- [x] 거래 추가/조회/수정/삭제 API
- [x] 거래 수정 UI (모달 폼)
- [x] 페이지네이션 지원

### 인증 시스템
- [x] NextAuth.js v5 + Credentials + Google OAuth
- [x] Prisma 기반 사용자 저장소

### 가계부 UI
- [x] 목록/캘린더 뷰 전환
- [x] 월별 요약 및 통계 페이지
- [x] 45개 테스트 통과

---

## 새로 추가된 파일

```
prisma/schema.prisma              # Category 모델 추가
src/app/api/categories/
├── route.ts                      # GET, POST
└── [id]/route.ts                 # PATCH, DELETE
src/app/dashboard/settings/
└── page.tsx                      # 설정 페이지
src/components/settings/
├── category-form.tsx             # 카테고리 추가/수정 폼
├── category-item.tsx             # 카테고리 목록 아이템
├── color-picker.tsx              # 색상 선택기
└── icon-picker.tsx               # 아이콘 선택기
src/lib/hooks/
└── use-categories.ts             # 카테고리 관리 훅
```

---

## 수정된 파일

```
src/app/dashboard/page.tsx        # 설정 링크 추가
src/components/budget/
├── transaction-form.tsx          # 카테고리 props 추가, 아이콘 확장
└── category-badge.tsx            # 카테고리 props 추가, 아이콘 확장
```

---

## API 엔드포인트

### 카테고리 API (신규)
| 메소드 | 경로 | 용도 |
|--------|------|------|
| GET | `/api/categories` | 사용자 카테고리 조회 |
| POST | `/api/categories` | 카테고리 추가 |
| PATCH | `/api/categories/[id]` | 카테고리 수정 |
| DELETE | `/api/categories/[id]` | 카테고리 삭제 (커스텀만) |

### 거래 API
| 메소드 | 경로 | 용도 |
|--------|------|------|
| GET | `/api/budget/transactions` | 거래 조회 |
| POST | `/api/budget/transactions` | 거래 추가 |
| PATCH | `/api/budget/transactions/[id]` | 거래 수정 |
| DELETE | `/api/budget/transactions/[id]` | 거래 삭제 |

---

## Git 상태

- **브랜치**: main
- **상태**: 미커밋 변경사항 있음

### 커밋 대기 파일
```
prisma/schema.prisma
src/app/api/categories/
src/app/dashboard/page.tsx
src/app/dashboard/settings/
src/components/budget/category-badge.tsx
src/components/budget/transaction-form.tsx
src/components/settings/
src/lib/hooks/use-categories.ts
```

### 커밋 제안
```bash
git add .
git commit -m "[feat] 카테고리 커스텀 기능 추가

- Category 모델 및 API 구현
- 설정 페이지 UI (아이콘/색상 선택기)
- 기본 카테고리 수정만 가능, 커스텀 카테고리 삭제 가능
- 30개 아이콘, 12개 색상 지원"
```

---

## 데이터베이스 설정

### DB 동기화 필요
```bash
docker start postgres-budget
npx prisma db push
```

### 환경 변수 (.env.local)
```
AUTH_SECRET="your_secret_key"
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/budget"
```

---

## 다음에 해야 할 작업 (선택)

1. **커밋/푸시** - 현재 변경사항
2. **데이터 내보내기/가져오기** - CSV/Excel 지원
3. **통계 대시보드 강화** - 더 다양한 차트/분석
4. **middleware deprecation 해결** - proxy로 마이그레이션

---

## 주의사항

- **Docker 필수**: `postgres-budget` 컨테이너 실행 필요
- **DB 동기화**: 카테고리 기능 사용 전 `npx prisma db push` 필요
- **기본 카테고리**: 첫 API 호출 시 자동 생성됨

---

## 명령어
```bash
npm install           # 의존성 설치
npm run dev           # 개발 서버 (http://localhost:3000)
npm run build         # 빌드
npm test              # 테스트

npx prisma generate   # Prisma 클라이언트 생성
npx prisma db push    # 스키마 동기화
npx prisma studio     # DB GUI

docker start postgres-budget  # DB 시작
```

---

## 마지막 업데이트
- **일시**: 2026-02-13
- **작업**: 카테고리 커스텀 기능 구현 완료
- **테스트**: 45개 통과
