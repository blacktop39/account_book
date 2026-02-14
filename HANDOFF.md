# 작업 인계 문서

## 프로젝트 개요
Next.js 16 + NextAuth.js v5 기반 인증 시스템 + 가계부 기능 (Vercel 스타일 UI)
**PostgreSQL + Prisma 데이터베이스 연동 완료**

---

## 완료된 작업

### 2차 카테고리(서브카테고리) 기능 (최신)
- [x] Prisma 스키마 수정 (parentId, parent, children 자기참조 관계)
- [x] 기본 서브카테고리 데이터 정의 (식비, 교통, 쇼핑, 여가, 공과금)
- [x] API 수정 (GET - children include, POST - 2단계 깊이 제한)
- [x] CategorySelect 컴포넌트 생성 (2단계 선택 UI)
- [x] 설정 페이지 서브카테고리 관리 UI
- [x] TransactionForm에 CategorySelect 적용
- [x] TypeScript 타입 체크 통과
- [x] 빌드 성공

### 카테고리 커스텀 기능
- [x] Prisma Category 모델 추가
- [x] Category API 엔드포인트 (GET, POST, PATCH, DELETE)
- [x] useCategories 훅
- [x] 설정 페이지 UI (`/dashboard/settings`)
- [x] 아이콘 선택기 (38개 아이콘)
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

## 서브카테고리 구조

```
식비
├── 주식
├── 부식
├── 간식
└── 외식

교통
├── 대중교통
├── 택시
├── 주유
└── 차량유지

쇼핑
├── 의류
├── 생활용품
└── 전자제품

여가
├── 영화/공연
├── 게임
├── 취미
└── 운동

공과금
├── 전기
├── 수도
├── 가스
└── 통신
```

---

## 새로 추가/수정된 파일

### 신규 파일
```
src/components/ui/category-select.tsx    # 2단계 카테고리 선택 컴포넌트
```

### 수정된 파일
```
prisma/schema.prisma                     # parentId, parent, children 관계 추가
src/app/api/categories/route.ts          # children include, 계층 생성
src/app/api/categories/[id]/route.ts     # 같은 부모 아래 중복 검사
src/lib/hooks/use-categories.ts          # 계층 구조 지원, flatCategories
src/lib/budget/types.ts                  # Category에 parentId, children 추가
src/lib/budget/categories.ts             # 기본 서브카테고리 데이터
src/components/budget/transaction-form.tsx  # CategorySelect 사용
src/app/dashboard/budget/page.tsx        # useCategories 훅 적용
src/app/dashboard/settings/page.tsx      # 서브카테고리 관리 UI
src/components/settings/category-item.tsx   # onAddSub, isSubCategory 지원
src/components/settings/category-form.tsx   # hideType prop 추가
src/components/settings/icon-picker.tsx     # 새 아이콘 추가 (38개)
```

---

## Git 상태

- **브랜치**: main
- **상태**: 미커밋 변경사항 있음 (13개 파일 수정, 1개 신규)

### 커밋 대기 파일
```
prisma/schema.prisma
src/app/api/categories/
src/app/dashboard/budget/page.tsx
src/app/dashboard/settings/page.tsx
src/components/budget/transaction-form.tsx
src/components/settings/
src/components/ui/category-select.tsx
src/lib/budget/categories.ts
src/lib/budget/types.ts
src/lib/hooks/use-categories.ts
```

### 커밋 제안
```bash
git add .
git commit -m "[feat] 2차 카테고리(서브카테고리) 기능 추가

- Prisma 자기참조 관계로 계층 구조 구현
- CategorySelect 2단계 선택 UI 컴포넌트
- 기본 서브카테고리 (식비, 교통, 쇼핑, 여가, 공과금)
- 설정 페이지에서 서브카테고리 관리
- 2단계 깊이 제한 (부모 → 자식)"
```

---

## 다음에 해야 할 작업

1. **커밋 및 PR 생성** - 현재 변경사항 커밋
2. **DB 마이그레이션** - 프로덕션에서 `npx prisma db push` 실행
3. **기존 사용자 처리** - 설정에서 서브카테고리 직접 추가 필요

---

## 주의사항

- **Prisma generate 필수**: 스키마 변경 후 `npx prisma generate` 실행
- **2단계 깊이 제한**: 서브카테고리 아래에 추가 카테고리 생성 불가
- **기존 사용자**: 서브카테고리 기본값은 새 사용자에게만 자동 생성
- **Docker 필수**: `postgres-budget` 컨테이너 실행 필요

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
- **작업**: 2차 카테고리(서브카테고리) 기능 구현 완료
- **빌드**: 성공
- **타입 체크**: 통과
