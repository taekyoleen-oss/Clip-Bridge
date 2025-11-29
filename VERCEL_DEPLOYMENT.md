# 🚀 Vercel 배포 가이드

Vercel에 ClipBridge를 배포하는 방법과 문제 해결 가이드입니다.

## 📋 배포 전 체크리스트

### 1. Supabase 프로젝트 설정 완료
- [ ] Supabase 프로젝트 생성 완료
- [ ] `clips` 테이블 생성 완료
- [ ] Realtime 기능 활성화 완료
- [ ] RLS 정책 설정 완료

### 2. 환경 변수 준비
- [ ] Supabase Project URL 복사
- [ ] Supabase anon key 복사

## 🔧 Vercel 환경 변수 설정

### 방법 1: Vercel 대시보드에서 설정

1. **Vercel 프로젝트 선택**
   - [Vercel Dashboard](https://vercel.com/dashboard) 접속
   - **clip-bridge** 프로젝트 선택

2. **환경 변수 설정**
   - **Settings** 탭 클릭
   - **Environment Variables** 섹션으로 이동
   - 다음 변수 추가:

   ```
   Name: NEXT_PUBLIC_SUPABASE_URL
   Value: https://your-project.supabase.co
   Environment: Production, Preview, Development (모두 선택)
   ```

   ```
   Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
   Value: your-anon-key-here
   Environment: Production, Preview, Development (모두 선택)
   ```

3. **저장 후 재배포**
   - 환경 변수 저장 후 **Deployments** 탭으로 이동
   - 최신 배포의 **"..."** 메뉴 클릭
   - **"Redeploy"** 선택

### 방법 2: Vercel CLI로 설정

```bash
# Vercel CLI 설치 (없는 경우)
npm i -g vercel

# 프로젝트에 로그인
vercel login

# 환경 변수 설정
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY

# 프로덕션에 적용
vercel --prod
```

## 🔍 문제 해결

### 저장이 안 되는 경우

#### 1. 환경 변수 확인

브라우저 콘솔(F12)에서 다음을 확인:

```javascript
// 콘솔에 입력하여 확인
console.log("URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log("Key:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "설정됨" : "없음");
```

**문제**: `undefined`가 표시되면 환경 변수가 설정되지 않은 것입니다.

**해결**:
- Vercel 대시보드에서 환경 변수 확인
- 환경 변수 이름이 정확한지 확인 (`NEXT_PUBLIC_` 접두사 필수)
- 재배포 실행

#### 2. Supabase 연결 확인

브라우저 콘솔에서 오류 메시지 확인:

- `Supabase 클라이언트가 초기화되지 않았습니다`: 환경 변수 문제
- `permission denied`: RLS 정책 문제
- `relation "clips" does not exist`: 테이블이 생성되지 않음

#### 3. RLS 정책 확인

Supabase 대시보드 > Table Editor > `clips` 테이블:
- RLS가 활성화되어 있는지 확인
- 개발용 정책이 올바르게 설정되었는지 확인

#### 4. 네트워크 확인

브라우저 개발자 도구 > Network 탭:
- Supabase API 요청이 있는지 확인
- 요청이 실패하는 경우 오류 코드 확인

### 일반적인 오류

#### 오류: "permission denied for table clips"
**원인**: RLS 정책이 너무 엄격함

**해결**: Supabase SQL Editor에서 다음 실행:

```sql
-- 개발용: 모든 사용자 접근 허용
DROP POLICY IF EXISTS "Allow all operations for development" ON public.clips;
CREATE POLICY "Allow all operations for development"
ON public.clips FOR ALL USING (true) WITH CHECK (true);
```

#### 오류: "relation clips does not exist"
**원인**: 테이블이 생성되지 않음

**해결**: `supabase/setup.sql` 파일의 SQL을 Supabase SQL Editor에서 실행

#### 오류: "Supabase 클라이언트가 초기화되지 않았습니다"
**원인**: 환경 변수가 설정되지 않음

**해결**:
1. Vercel 대시보드에서 환경 변수 확인
2. 환경 변수 이름 확인 (`NEXT_PUBLIC_` 접두사 필수)
3. 재배포 실행

## ✅ 배포 확인

배포 후 다음을 확인하세요:

1. **브라우저 콘솔 확인**
   - F12 > Console 탭
   - `✅ Supabase 클라이언트 초기화 완료` 메시지 확인
   - 오류 메시지가 없는지 확인

2. **기능 테스트**
   - 텍스트 복사
   - Toast 알림 확인
   - 10초 후 자동 저장 확인
   - Supabase Table Editor에서 데이터 확인

3. **네트워크 확인**
   - F12 > Network 탭
   - Supabase API 요청이 성공하는지 확인

## 📞 추가 도움말

- [Vercel 환경 변수 문서](https://vercel.com/docs/concepts/projects/environment-variables)
- [Supabase 공식 문서](https://supabase.com/docs)


