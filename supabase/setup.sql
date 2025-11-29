-- ============================================
-- ClipBridge Supabase 설정 SQL 스크립트
-- ============================================
-- 이 파일의 모든 SQL을 Supabase SQL Editor에서 한 번에 실행하세요.
-- ============================================

-- 1. clips 테이블 생성
CREATE TABLE IF NOT EXISTS public.clips (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  text TEXT NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  device TEXT NOT NULL,
  is_synced BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 인덱스 생성 (성능 향상)
CREATE INDEX IF NOT EXISTS idx_clips_user_id ON public.clips(user_id);
CREATE INDEX IF NOT EXISTS idx_clips_timestamp ON public.clips(timestamp DESC);

-- 3. RLS (Row Level Security) 활성화
ALTER TABLE public.clips ENABLE ROW LEVEL SECURITY;

-- 4. 개발용 RLS 정책 생성 (모든 사용자가 읽고 쓸 수 있음)
-- 프로덕션 환경에서는 더 엄격한 정책 사용 권장
DROP POLICY IF EXISTS "Allow all operations for development" ON public.clips;

CREATE POLICY "Allow all operations for development"
ON public.clips
FOR ALL
USING (true)
WITH CHECK (true);

-- 5. Realtime 기능 활성화
-- clips 테이블의 변경사항을 실시간으로 구독할 수 있도록 설정
ALTER PUBLICATION supabase_realtime ADD TABLE clips;

-- ============================================
-- 설정 완료!
-- ============================================
-- 다음 단계:
-- 1. Supabase 대시보드 > Settings > API에서 URL과 키 복사
-- 2. .env.local 파일에 환경 변수 설정
-- 3. pnpm dev로 개발 서버 실행
-- ============================================


