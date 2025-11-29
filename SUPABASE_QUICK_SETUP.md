# ⚡ Supabase 빠른 설정 가이드

이 가이드는 ClipBridge를 위한 Supabase 설정을 **5분 안에** 완료하는 방법을 안내합니다.

## 🚀 단계별 설정

### 1단계: Supabase 프로젝트 생성 (2분)

1. **[Supabase](https://supabase.com/) 접속**
   - "Start your project" 클릭
   - GitHub 계정으로 로그인 (또는 이메일 가입)

2. **새 프로젝트 생성**
   - "New Project" 클릭
   - 프로젝트 정보 입력:
     - **Name**: `clipbridge`
     - **Database Password**: 강력한 비밀번호 설정 (기억해두세요!)
     - **Region**: `Northeast Asia (Seoul)` 선택
   - "Create new project" 클릭
   - 프로젝트 생성 완료까지 대기 (약 2분)

### 2단계: 데이터베이스 테이블 생성 (1분)

1. **SQL Editor 열기**
   - Supabase 대시보드 왼쪽 메뉴에서 **"SQL Editor"** 클릭
   - **"New query"** 클릭

2. **SQL 스크립트 실행**
   - `supabase/setup.sql` 파일을 열어서 전체 내용 복사
   - 또는 아래 SQL을 복사하여 붙여넣기:

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

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_clips_user_id ON public.clips(user_id);
CREATE INDEX IF NOT EXISTS idx_clips_timestamp ON public.clips(timestamp DESC);

-- RLS 활성화
ALTER TABLE public.clips ENABLE ROW LEVEL SECURITY;

-- 개발용 정책 생성
DROP POLICY IF EXISTS "Allow all operations for development" ON public.clips;
CREATE POLICY "Allow all operations for development"
ON public.clips FOR ALL USING (true) WITH CHECK (true);

-- Realtime 활성화
ALTER PUBLICATION supabase_realtime ADD TABLE clips;
```

3. **"Run" 버튼 클릭** (또는 Ctrl+Enter)
   - 성공 메시지가 표시되면 완료!

### 3단계: API 키 가져오기 (1분)

1. **Settings 열기**
   - Supabase 대시보드 왼쪽 하단의 **⚙️ Settings** 클릭
   - **"API"** 메뉴 클릭

2. **설정 값 복사**
   - **Project URL** 복사 (예: `https://abcdefghijklmnop.supabase.co`)
   - **anon public** 키 복사 (긴 문자열)

### 4단계: 환경 변수 설정 (1분)

1. **프로젝트 루트에 `.env.local` 파일 생성**
   - 파일이 없으면 새로 생성
   - 파일이 있으면 열기

2. **아래 내용 입력** (복사한 값으로 교체):

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**예시:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjIzOTAyMiwiZXhwIjoxOTMxODE1MDIyfQ.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

3. **파일 저장**

### 5단계: 테스트 (1분)

1. **개발 서버 실행**
   ```bash
   pnpm dev
   ```

2. **브라우저에서 확인**
   - [http://localhost:3000](http://localhost:3000) 접속
   - 브라우저 콘솔(F12)에서 오류 확인
   - 텍스트 복사하여 저장 테스트

3. **데이터 확인**
   - Supabase 대시보드 > **Table Editor** > `clips` 테이블 확인
   - 저장된 데이터가 보이면 성공!

## ✅ 완료!

이제 ClipBridge가 Supabase와 연결되었습니다!

## 🔧 문제 해결

### 연결 오류가 발생하는 경우

1. **환경 변수 확인**
   - `.env.local` 파일이 프로젝트 루트에 있는지 확인
   - 파일 이름이 정확히 `.env.local`인지 확인 (앞의 점 포함)
   - 값에 따옴표나 공백이 없는지 확인

2. **개발 서버 재시작**
   ```bash
   # 서버 종료 (Ctrl+C)
   pnpm dev  # 다시 시작
   ```

3. **Supabase 프로젝트 상태 확인**
   - Supabase 대시보드에서 프로젝트가 활성 상태인지 확인
   - API 키가 올바른지 확인

### Realtime이 작동하지 않는 경우

1. **Replication 설정 확인**
   - Supabase 대시보드 > **Database** > **Replication** 메뉴
   - `clips` 테이블의 Realtime 토글이 **ON**인지 확인

2. **SQL로 다시 활성화**
   ```sql
   ALTER PUBLICATION supabase_realtime ADD TABLE clips;
   ```

### 테이블이 생성되지 않는 경우

- SQL Editor에서 오류 메시지 확인
- `supabase/setup.sql` 파일의 SQL을 다시 실행
- Table Editor에서 `clips` 테이블이 있는지 확인

## 📚 추가 정보

- 상세한 설정 가이드: [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
- 전환 가이드: [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)


