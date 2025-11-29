# 🔄 Firebase에서 Supabase로 전환 가이드

이 문서는 ClipBridge 앱을 Firebase에서 Supabase로 전환하는 과정을 설명합니다.

## ✅ 전환 완료 사항

### 코드 변경
- ✅ `lib/firebase.ts` → `lib/supabase.ts`로 전환
- ✅ `lib/db.ts`를 Supabase 클라이언트 사용하도록 수정
- ✅ Firebase Realtime Database → Supabase PostgreSQL + Realtime
- ✅ Firebase Auth → 로컬 스토리지 기반 사용자 ID (익명 인증)

### 의존성 변경
- ✅ `firebase` 패키지 제거
- ✅ `@supabase/supabase-js` 패키지 추가

## 📋 전환 후 해야 할 작업

### 1. Supabase 프로젝트 생성
`SUPABASE_SETUP.md` 파일을 참고하여 Supabase 프로젝트를 생성하세요.

### 2. 데이터베이스 테이블 생성
Supabase SQL Editor에서 다음 SQL 실행:

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

-- RLS 활성화 (개발용: 모든 사용자 접근 허용)
ALTER TABLE public.clips ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations for development"
ON public.clips
FOR ALL
USING (true)
WITH CHECK (true);

-- Realtime 활성화
ALTER PUBLICATION supabase_realtime ADD TABLE clips;
```

### 3. 환경 변수 업데이트
`.env.local` 파일을 업데이트:

```env
# Supabase 설정
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Firebase 설정 제거 또는 주석 처리
```

### 4. 기존 Firebase 데이터 마이그레이션 (선택사항)
기존 Firebase 데이터가 있다면 마이그레이션 스크립트를 실행하세요.

## 🔍 주요 변경사항

### 데이터베이스 구조
**Firebase (NoSQL):**
```json
{
  "users": {
    "user_id": {
      "clips": {
        "clip_id": {
          "text": "...",
          "timestamp": "...",
          "device": "...",
          "isSynced": true
        }
      }
    }
  }
}
```

**Supabase (PostgreSQL):**
```sql
clips 테이블:
- id (UUID)
- user_id (TEXT)
- text (TEXT)
- timestamp (TIMESTAMPTZ)
- device (TEXT)
- is_synced (BOOLEAN)
```

### API 변경사항

**Firebase:**
```typescript
const clipsRef = ref(database, `users/${userId}/clips`);
await set(newClipRef, clipData);
```

**Supabase:**
```typescript
await supabase
  .from("clips")
  .insert(clipData)
  .select()
  .single();
```

### 실시간 구독

**Firebase:**
```typescript
onValue(clipsQuery, (snapshot) => {
  // 데이터 처리
});
```

**Supabase:**
```typescript
supabase
  .channel("clips_changes")
  .on("postgres_changes", {...}, (payload) => {
    // 데이터 처리
  })
  .subscribe();
```

## 🎯 Supabase의 장점

1. **PostgreSQL 기반**: 강력한 SQL 쿼리 지원
2. **오픈소스**: 자체 호스팅 가능
3. **더 나은 무료 티어**: 더 많은 리소스 제공
4. **Row Level Security**: 세밀한 보안 제어
5. **실시간 기능**: PostgreSQL 변경사항 실시간 구독

## ⚠️ 주의사항

1. **RLS 정책**: 프로덕션 환경에서는 적절한 RLS 정책 설정 필요
2. **인증**: 현재는 로컬 스토리지 기반 사용자 ID 사용, 필요시 Supabase Auth로 전환 가능
3. **데이터 마이그레이션**: 기존 Firebase 데이터가 있다면 별도 마이그레이션 필요

## 📞 도움말

- [Supabase 설정 가이드](./SUPABASE_SETUP.md)
- [Supabase 공식 문서](https://supabase.com/docs)


