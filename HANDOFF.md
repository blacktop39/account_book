# 작업 인계 문서

## 프로젝트 개요
Next.js 16 + NextAuth.js v5 기반 인증 시스템 + 가계부 기능 (Vercel 스타일 UI)
**PostgreSQL + Prisma 데이터베이스 연동 완료**

---

## 완료된 작업

### API 개선 (최근 작업 - 미커밋)
- [x] 거래 수정 API 추가 (PATCH /api/budget/transactions/[id])
- [x] 페이지네이션 구현 (page, limit 파라미터)
- [x] 에러 응답 유틸리티 (`src/lib/api/errors.ts`)
- [x] `updateTransaction` 훅 함수 추가

### 데이터베이스 연동
- [x] Prisma 7 + PostgreSQL 설정
- [x] Docker PostgreSQL 컨테이너 구성
- [x] Prisma 스키마 정의 (User, Transaction, ResetToken)
- [x] 사용자 저장소 마이그레이션 (메모리 → Prisma)
- [x] 거래 API 엔드포인트 (GET, POST, PATCH, DELETE)
- [x] Edge Runtime 호환 수정 (auth.config.ts 분리)
- [x] GitHub OAuth 제거 (Google OAuth만 유지)

### 인증 시스템
- [x] NextAuth.js v5 설정
- [x] Credentials Provider + Google OAuth
- [x] Prisma 기반 사용자 저장소
- [x] Web Crypto API 기반 보안 토큰 생성

### 가계부 기능
- [x] 데이터 레이어 (`src/lib/budget/`)
- [x] 가계부 컴포넌트 (`src/components/budget/`)
- [x] API 기반 거래 훅
- [x] 45개 테스트 통과

---

## 미커밋 변경사항

```bash
git status
# M src/app/api/budget/transactions/[id]/route.ts  # PATCH 추가
# M src/app/api/budget/transactions/route.ts       # 페이지네이션
# M src/lib/hooks/use-transactions.ts              # updateTransaction
# ?? src/lib/api/                                  # 에러 유틸리티
```

**커밋 제안:**
```bash
git add .
git commit -m "[feat] API 개선 - 거래 수정, 페이지네이션, 에러 표준화"
git push
```

---

## API 엔드포인트

| 메소드 | 경로 | 용도 |
|--------|------|------|
| GET | `/api/budget/transactions` | 거래 조회 (페이지네이션 지원) |
| POST | `/api/budget/transactions` | 거래 추가 |
| PATCH | `/api/budget/transactions/[id]` | 거래 수정 |
| DELETE | `/api/budget/transactions/[id]` | 거래 삭제 |

**페이지네이션 사용:**
```
GET /api/budget/transactions?page=1&limit=20&month=2026-01
```

---

## 데이터베이스 설정

### Docker PostgreSQL 실행
```bash
docker start postgres-budget
# 또는 새로 생성
docker run -d --name postgres-budget \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=budget \
  -p 5432:5432 \
  postgres:16-alpine
```

### 환경 변수 (.env.local)
```
AUTH_SECRET="your_secret_key"
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/budget"
```

---

## 프로젝트 구조
```
src/
├── app/api/budget/transactions/
│   ├── route.ts           # GET (페이지네이션), POST
│   └── [id]/route.ts      # PATCH, DELETE
├── auth.ts                # NextAuth 설정 (Node.js Runtime)
├── auth.config.ts         # Edge Runtime 호환 설정
├── middleware.ts          # Edge 미들웨어
├── lib/
│   ├── prisma.ts          # Prisma 클라이언트
│   ├── users.ts           # 사용자 CRUD
│   ├── api/errors.ts      # 에러 응답 유틸리티
│   └── hooks/use-transactions.ts
└── components/
```

---

## 다음에 해야 할 작업

### 즉시
1. 미커밋 변경사항 커밋/푸시

### 선택사항
1. 거래 수정 UI 추가 (현재 API만 구현됨)
2. 카테고리 커스텀 기능
3. 데이터 내보내기/가져오기
4. 프로덕션 PostgreSQL 설정

---

## 주의사항
- **Docker 필수**: `postgres-budget` 컨테이너 실행 필요
- **Edge Runtime**: `auth.config.ts`와 `auth.ts` 분리 유지
- **Prisma 7**: `@prisma/adapter-pg` 어댑터 패턴 필수

---

## 마지막 상태
- 브랜치: `feature/auth-system`
- 최근 커밋: `7b0b8ae` - [feat] PostgreSQL + Prisma 데이터베이스 연동
- PR: https://github.com/blacktop39/account_book/pull/3
- 빌드: 통과
- 미커밋 변경: API 개선 (PATCH, 페이지네이션, 에러 유틸)

---

## 명령어
```bash
npm run dev           # 개발 서버
npm run build         # 빌드
npm test              # 테스트

npx prisma db push    # 스키마 동기화
npx prisma studio     # DB GUI

docker start postgres-budget  # DB 시작
```
