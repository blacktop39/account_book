# 작업 인계 문서

## 프로젝트 개요
Next.js 16 + NextAuth.js v5 기반 인증 시스템 + 가계부 기능 (Vercel 스타일 UI)
**PostgreSQL + Prisma 데이터베이스 연동 완료**

---

## 완료된 작업

### 데이터베이스 연동 (최근 작업)
- [x] Prisma 7 + PostgreSQL 설정
- [x] Docker PostgreSQL 컨테이너 구성
- [x] Prisma 스키마 정의 (User, Transaction, ResetToken)
- [x] 사용자 저장소 마이그레이션 (메모리 → Prisma)
- [x] 거래 API 엔드포인트 생성 (GET, POST, DELETE)
- [x] use-transactions 훅 마이그레이션 (LocalStorage → API fetch)
- [x] GitHub OAuth 제거 (Google OAuth만 유지)

### 인증 시스템
- [x] NextAuth.js v5 설정 (`src/auth.ts`)
- [x] 로그인/회원가입/비밀번호 재설정 페이지
- [x] Credentials Provider (이메일/비밀번호)
- [x] Google OAuth 설정
- [x] Prisma 기반 사용자 저장소 (`src/lib/users.ts`)
- [x] crypto.randomBytes 기반 보안 토큰 생성

### 가계부 기능
- [x] 데이터 레이어 (`src/lib/budget/`)
- [x] 공통 UI 컴포넌트 (`src/components/ui/`)
- [x] 가계부 컴포넌트 (`src/components/budget/`)
- [x] API 기반 거래 훅 (`src/lib/hooks/use-transactions.ts`)
- [x] 가계부 페이지 및 통계 페이지

### 테스트 환경
- [x] Vitest + jsdom 설정
- [x] 45개 테스트 통과

---

## 데이터베이스 설정

### Docker PostgreSQL 실행
```bash
# 이미 실행 중인 경우 확인
docker ps | grep postgres-budget

# 새로 실행
docker run -d --name postgres-budget \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=budget \
  -p 5432:5432 \
  postgres:16-alpine
```

### Prisma 명령어
```bash
npx prisma db push      # 스키마 동기화
npx prisma generate     # 클라이언트 생성
npx prisma studio       # DB GUI
```

### 환경 변수 (.env.local)
```
AUTH_SECRET="your_secret_key"
AUTH_GOOGLE_ID=""
AUTH_GOOGLE_SECRET=""
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/budget"
```

---

## 프로젝트 구조
```
src/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts
│   │   ├── signup/route.ts
│   │   ├── forgot-password/route.ts
│   │   ├── reset-password/route.ts
│   │   └── budget/
│   │       └── transactions/
│   │           ├── route.ts          # GET, POST
│   │           └── [id]/route.ts     # DELETE
│   └── dashboard/budget/
├── auth.ts
├── lib/
│   ├── prisma.ts                     # Prisma 클라이언트 (어댑터 패턴)
│   ├── users.ts                      # Prisma 기반 사용자 CRUD
│   ├── budget/
│   └── hooks/use-transactions.ts     # API fetch 기반
└── components/
prisma/
├── schema.prisma                     # DB 스키마
└── migrations/
prisma.config.ts                      # Prisma 설정 (.env.local 로드)
```

---

## 주요 파일 변경 내역

### Prisma 관련 (신규)
- `prisma/schema.prisma` - User, Transaction, ResetToken 모델
- `prisma.config.ts` - .env.local 환경 변수 로드
- `src/lib/prisma.ts` - PrismaPg 어댑터 사용 싱글톤

### 마이그레이션된 파일
- `src/lib/users.ts` - 메모리 배열 → Prisma 쿼리
- `src/lib/hooks/use-transactions.ts` - LocalStorage → API fetch

### API 엔드포인트 (신규)
- `src/app/api/budget/transactions/route.ts` - GET (월별 조회), POST (추가)
- `src/app/api/budget/transactions/[id]/route.ts` - DELETE (삭제)

### OAuth 변경
- `src/auth.ts` - GitHub 제거
- `src/app/page.tsx` - GitHub 버튼 제거
- `src/app/signup/page.tsx` - GitHub 버튼 제거

---

## 다음에 해야 할 작업 (선택사항)

### 커밋 & PR
1. 데이터베이스 연동 변경사항 커밋
2. PR 생성 또는 기존 PR 업데이트

### 기능 확장
1. 거래 수정 기능 (PUT /api/budget/transactions/:id)
2. 카테고리 커스텀 추가 기능
3. 데이터 내보내기/가져오기

### 배포 준비
1. 프로덕션 PostgreSQL 설정 (Supabase, Neon 등)
2. 환경 변수 설정

---

## 주의사항
- **Docker 필수**: 개발 시 `postgres-budget` 컨테이너 실행 필요
- **Prisma 7 어댑터**: `@prisma/adapter-pg` 필수 (schema에 url 직접 설정 불가)
- **prisma.config.ts**: .env.local 로드를 위해 필수

---

## 마지막 상태
- 브랜치: `feature/auth-system`
- 최근 커밋: `f9e086c` - [docs] HANDOFF.md 업데이트
- 테스트: 45개 통과
- 빌드: 통과
- 린트: 통과 (1개 경고 - coverage 폴더)

---

## 명령어
```bash
# 개발
npm run dev

# 검증
npm run lint
npm test
npm run build

# Prisma
npx prisma db push
npx prisma studio

# Docker PostgreSQL
docker start postgres-budget
docker stop postgres-budget
```

---

## 참고 계획 파일
- `~/.claude/plans/harmonic-sparking-frost.md` - 데이터베이스 연동 계획
