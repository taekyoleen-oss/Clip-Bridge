# 🚀 Supabase 설정 가이드

이 가이드는 ClipBridge 앱을 Supabase로 전환하기 위한 단계별 설정 방법을 안내합니다.

## 📋 목차
1. [Supabase 프로젝트 생성](#1-supabase-프로젝트-생성)
2. [데이터베이스 테이블 생성](#2-데이터베이스-테이블-생성)
3. [Row Level Security (RLS) 설정](#3-row-level-security-rls-설정)
4. [Realtime 기능 활성화](#4-realtime-기능-활성화)
5. [환경 변수 설정](#5-환경-변수-설정)
6. [의존성 설치](#6-의존성-설치)

---

## 1. Supabase 프로젝트 생성

### 1-1. Supabase 계정 생성
1. [Supabase](https://supabase.com/) 웹사이트 접속
2. "Start your project" 또는 "Sign in" 클릭
3. GitHub 계정으로 로그인 (또는 이메일로 가입)

### 1-2. 새 프로젝트 생성
1. 대시보드에서 **"New Project"** 클릭
2. 프로젝트 정보 입력:
   - **Name**: `clipbridge` (또는 원하는 이름)
   - **Database Password**: 강력한 비밀번호 설정 (나중에 필요)
   - **Region**: `Northeast Asia (Seoul)` 선택 (한국 사용자에게 빠름)
3. **"Create new project"** 클릭
4. 프로젝트 생성 완료까지 대기 (약 2분)

---

## 2. 데이터베이스 테이블 생성

### 2-1. SQL Editor 접근
1. Supabase 대시보드 왼쪽 메뉴에서 **"SQL Editor"** 클릭
2. **"New query"** 클릭

### 2-2. 테이블 생성 SQL 실행
아래 SQL을 복사하여 SQL Editor에 붙여넣고 **"Run"** 클릭:

```sql
-- clips 테이블 생성
CREATE TABLE IF NOT EXISTS public.clips (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  text TEXT NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  device TEXT NOT NULL,
  is_synced BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스 생성 (성능 향상)
CREATE INDEX IF NOT EXISTS idx_clips_user_id ON public.clips(user_id);
CREATE INDEX IF NOT EXISTS idx_clips_timestamp ON public.clips(timestamp DESC);

-- RLS (Row Level Security) 활성화
ALTER TABLE public.clips ENABLE ROW LEVEL SECURITY;
```

### 2-3. RLS 정책 생성
다음 SQL을 실행하여 사용자별 데이터 접근 정책 설정:

```sql
-- 사용자는 자신의 데이터만 읽을 수 있음
CREATE POLICY "Users can view own clips"
ON public.clips
FOR SELECT
USING (user_id = current_setting('app.user_id', true));

-- 사용자는 자신의 데이터만 삽입할 수 있음
CREATE POLICY "Users can insert own clips"
ON public.clips
FOR INSERT
WITH CHECK (user_id = current_setting('app.user_id', true));

-- 사용자는 자신의 데이터만 삭제할 수 있음
CREATE POLICY "Users can delete own clips"
ON public.clips
FOR DELETE
USING (user_id = current_setting('app.user_id', true));
```

**⚠️ 참고**: 현재 구현은 로컬 스토리지 기반 사용자 ID를 사용하므로, RLS 정책을 조정해야 합니다. 아래 "RLS 대안 설정" 참고.

### 2-4. RLS 대안 설정 (로컬 스토리지 기반 사용자 ID 사용 시)

로컬 스토리지 기반 사용자 ID를 사용하는 경우, RLS를 비활성화하고 애플리케이션 레벨에서 필터링합니다:

```sql
-- RLS 비활성화 (개발용 - 프로덕션에서는 인증 기반 RLS 사용 권장)
ALTER TABLE public.clips DISABLE ROW LEVEL SECURITY;

-- 또는 모든 사용자가 읽고 쓸 수 있도록 설정 (개발용)
DROP POLICY IF EXISTS "Users can view own clips" ON public.clips;
DROP POLICY IF EXISTS "Users can insert own clips" ON public.clips;
DROP POLICY IF EXISTS "Users can delete own clips" ON public.clips;

CREATE POLICY "Allow all operations for development"
ON public.clips
FOR ALL
USING (true)
WITH CHECK (true);
```

---

## 3. Realtime 기능 활성화

### 3-1. Realtime 설정
1. Supabase 대시보드에서 **"Database"** > **"Replication"** 메뉴 클릭
2. `clips` 테이블 찾기
3. `clips` 테이블의 **Realtime** 토글을 **ON**으로 변경

또는 SQL로 활성화:

```sql
-- Realtime 활성화
ALTER PUBLICATION supabase_realtime ADD TABLE clips;
```

---

## 4. API 키 및 URL 확인

### 4-1. 프로젝트 설정 접근
1. Supabase 대시보드에서 **⚙️ Settings** (왼쪽 하단) 클릭
2. **"API"** 메뉴 클릭

### 4-2. 설정 값 복사
다음 값들을 복사해두세요:

- **Project URL**: `https://xxxxx.supabase.co`
- **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

---

## 5. 환경 변수 설정

### 5-1. .env.local 파일 생성
프로젝트 루트에 `.env.local` 파일을 생성하고 아래 내용을 입력:

```env
# Supabase 설정
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**예시:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjIzOTAyMiwiZXhwIjoxOTMxODE1MDIyfQ.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 5-2. 기존 Firebase 환경 변수 제거
`.env.local` 파일에서 Firebase 관련 변수를 제거하거나 주석 처리:

```env
# Firebase 설정 (사용하지 않음)
# NEXT_PUBLIC_FIREBASE_API_KEY=...
# NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
```

---

## 6. 의존성 설치

터미널에서 다음 명령어 실행:

```bash
pnpm install
```

이 명령어는 `@supabase/supabase-js` 패키지를 설치하고 기존 Firebase 패키지를 제거합니다.

---

## 7. 테스트

### 7-1. 개발 서버 실행
```bash
pnpm dev
```

### 7-2. 브라우저에서 확인
1. [http://localhost:3000](http://localhost:3000) 접속
2. 브라우저 콘솔(F12)에서 오류 확인
3. 텍스트 복사하여 저장 테스트
4. Supabase 대시보드 > Table Editor에서 데이터 확인

---

## ✅ 전환 완료!

이제 ClipBridge가 Supabase를 사용하여 작동합니다!

## 🔧 문제 해결

### Supabase 연결 오류
- `.env.local` 파일의 URL과 키가 올바른지 확인
- Supabase 프로젝트가 활성 상태인지 확인
- 브라우저 콘솔에서 오류 메시지 확인

### Realtime이 작동하지 않음
- Database > Replication에서 `clips` 테이블의 Realtime이 활성화되었는지 확인
- SQL Editor에서 `ALTER PUBLICATION supabase_realtime ADD TABLE clips;` 실행

### RLS 정책 오류
- Table Editor에서 RLS가 활성화되어 있는지 확인
- 정책이 올바르게 설정되었는지 확인
- 개발 단계에서는 RLS를 비활성화하고 애플리케이션 레벨에서 필터링 사용 가능

---

## 📊 Supabase vs Firebase 비교

| 기능 | Firebase | Supabase |
|------|----------|----------|
| 데이터베이스 | Realtime Database (NoSQL) | PostgreSQL (SQL) |
| 실시간 | ✅ | ✅ |
| 인증 | ✅ | ✅ |
| 오픈소스 | ❌ | ✅ |
| SQL 쿼리 | ❌ | ✅ |
| 무료 티어 | 제한적 | 더 관대함 |

---

## 📞 추가 도움말

- [Supabase 공식 문서](https://supabase.com/docs)
- [Supabase JavaScript 클라이언트](https://supabase.com/docs/reference/javascript/introduction)
- [Row Level Security 가이드](https://supabase.com/docs/guides/auth/row-level-security)


