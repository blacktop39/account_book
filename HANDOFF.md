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
- **일시**: 2026-02-21
- **작업**: Google AdSense 광고 시스템 구현 및 배포 완료
- **빌드**: 성공
- **배포**: 프로덕션 배포 완료

---

## 최신 작업: Google AdSense 광고 시스템 (2026-02-21)

### 완료된 작업
- [x] 회원가입 약관 체크박스 제거
  - 실제 약관이 없어 불필요한 체크박스 제거
  - 빌드 성공 및 Vercel 배포 완료

- [x] Google AdSense 광고 시스템 구현
  - 개인정보 처리방침 페이지 생성 (/privacy)
  - AdSense Script 추가 (layout.tsx)
  - 재사용 가능한 광고 컴포넌트 (AdSenseBanner)
  - 3개 주요 페이지에 광고 배치 (통계, 가계부, 설정)
  - 환경 변수 설정 (NEXT_PUBLIC_ADSENSE_ID)
  - Vercel 환경 변수 추가
  - 프로덕션 배포 완료

### 새로 추가된 파일
```
src/app/privacy/page.tsx              # 개인정보 처리방침
src/components/ads/adsense-banner.tsx # AdSense 광고 컴포넌트
```

### 수정된 파일
```
src/app/layout.tsx                    # AdSense Script 추가
src/app/signup/page.tsx               # 약관 체크박스 제거
src/app/budget/stats/page.tsx         # 통계 페이지 광고
src/app/budget/page.tsx               # 가계부 페이지 광고
src/app/settings/page.tsx             # 설정 페이지 광고
.env.local                            # AdSense ID 설정
```

### 환경 변수
```bash
NEXT_PUBLIC_ADSENSE_ID=ca-pub-8192196990908412
```

### Git 상태
- **브랜치**: main
- **최신 커밋**: de59e35 - "[feat] Google AdSense 광고 추가"
- **배포**: 프로덕션 배포 완료 (https://accountbook-vert.vercel.app)

### 광고가 표시되는 페이지
- 통계: /budget/stats
- 가계부: /budget
- 설정: /settings
- 개인정보 처리방침: /privacy

### 다음 단계
1. **AdSense 승인 대기**
   - Google AdSense 대시보드에서 승인 상태 확인
   - 승인 후 자동으로 광고 표시 시작
   - 수익 모니터링: https://adsense.google.com

2. **AdMob 모바일 광고 (선택사항)**
   - Capacitor AdMob 플러그인 설치
   - Android 앱에 배너 광고 추가
   - 모바일 수익화

### AdSense 관련 명령어
```bash
# 로컬에서 테스트
npm run dev

# 환경 변수 확인
vercel env ls

# 재배포
vercel --prod
```

---

## 이전 작업: Capacitor 모바일 지원 (2026-02-20)

### 완료된 작업
- [x] Capacitor Android 모바일 지원 추가
  - Capacitor 패키지 설치 (@capacitor/android 8.1.0, @capacitor/core, @capacitor/cli)
  - Android 프로젝트 구조 및 Gradle 설정 생성
  - Android 앱 아이콘 및 스플래시 화면 리소스 추가
  - Capacitor 관련 npm 스크립트 추가 (cap:sync, cap:open:android, android)
  - Prisma generate를 postinstall 및 build 스크립트에 통합

- [x] Git 워크플로우 완료
  - feature/capacitor-mobile 브랜치 생성
  - .gitignore 업데이트 (Android 빌드 파일, IDE 설정)
  - 58개 파일 커밋 (+1949줄)
  - 원격 브랜치로 푸시 완료
  - **PR #6 생성 완료**: https://github.com/blacktop39/account_book/pull/6

### 새로 추가된 파일
```
capacitor.config.ts                  # Capacitor 메인 설정
android/                             # Android 프로젝트 전체 디렉토리
├── app/
│   ├── build.gradle                # Android 앱 빌드 설정
│   ├── src/main/
│   │   ├── AndroidManifest.xml     # 앱 매니페스트
│   │   ├── java/com/accountbook/app/MainActivity.java
│   │   └── res/                    # 아이콘, 스플래시 리소스
├── build.gradle                    # 프로젝트 빌드 설정
└── gradle/                         # Gradle 래퍼
```

### 수정된 파일
```
.gitignore                          # Android 빌드 파일, .idea/ 추가
package.json                        # Capacitor 의존성 및 스크립트
package-lock.json                   # 의존성 잠금 파일
```

### Git 상태
- **브랜치**: feature/capacitor-mobile
- **마지막 커밋**: 32bebf5 - "[feat] Capacitor 모바일 지원 추가"
- **PR**: #6 (Open, 리뷰 대기)
- **원격**: origin/feature/capacitor-mobile (푸시 완료)

### 다음 단계
1. **PR #6 리뷰 및 머지**
2. **Android 앱 테스트**
   ```bash
   npm install
   npm run cap:sync
   npm run cap:open:android
   ```
3. **필수 요구사항**
   - Android SDK 설치 (Android Studio 권장)
   - Java 11 이상
4. **향후 계획**
   - iOS 플랫폼 추가 고려
   - Capacitor 플러그인 추가 (카메라, 파일 시스템 등)
   - 모바일 최적화 (반응형 디자인, 터치 이벤트)

### Capacitor 관련 명령어
```bash
# Capacitor 동기화 (웹 앱 → 네이티브 앱)
npm run cap:sync

# Android Studio에서 프로젝트 열기
npm run cap:open:android

# 또는 한 번에
npm run android
```

---

## 이전 작업 기록
