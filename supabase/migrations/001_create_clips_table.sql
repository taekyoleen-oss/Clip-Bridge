-- ClipBridge clips 테이블 생성 마이그레이션

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

-- 개발용: 모든 사용자가 읽고 쓸 수 있도록 설정
-- 프로덕션에서는 인증 기반 RLS 정책 사용 권장
CREATE POLICY "Allow all operations for development"
ON public.clips
FOR ALL
USING (true)
WITH CHECK (true);

-- Realtime 활성화
ALTER PUBLICATION supabase_realtime ADD TABLE clips;

