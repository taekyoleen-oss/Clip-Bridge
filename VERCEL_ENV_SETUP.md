# 🔧 Vercel 환경 변수 설정 가이드

Vercel에서 Supabase 환경 변수를 설정하는 단계별 가이드입니다.

## ⚠️ 현재 문제

브라우저 콘솔에 다음 오류가 표시됩니다:
```
⚠️ Supabase 환경 변수가 설정되지 않았습니다!
NEXT_PUBLIC_SUPABASE_URL: 없음
NEXT_PUBLIC_SUPABASE_ANON_KEY: 없음
```

이는 Vercel에 환경 변수가 설정되지 않았기 때문입니다.

## 📋 해결 방법

### 1단계: Supabase 설정 값 가져오기

1. [Supabase Dashboard](https://supabase.com/dashboard) 접속
2. 프로젝트 선택
3. 왼쪽 하단 **⚙️ Settings** 클릭
4. **"API"** 메뉴 클릭
5. 다음 값들을 복사:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public** 키: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### 2단계: Vercel에 환경 변수 설정

#### 방법 A: Vercel 대시보드에서 설정 (권장)

1. **Vercel 대시보드 접속**
   - [Vercel Dashboard](https://vercel.com/dashboard) 접속
   - **clip-bridge** 프로젝트 선택

2. **Settings 메뉴로 이동**
   - 상단 메뉴에서 **"Settings"** 클릭
   - 왼쪽 사이드바에서 **"Environment Variables"** 클릭

3. **첫 번째 환경 변수 추가**
   - **"Add New"** 버튼 클릭
   - **Key**: `NEXT_PUBLIC_SUPABASE_URL`
   - **Value**: Supabase에서 복사한 Project URL (예: `https://abcdefghijklmnop.supabase.co`)
   - **Environment**: 
     - ✅ Production
     - ✅ Preview  
     - ✅ Development
   - **"Save"** 클릭

4. **두 번째 환경 변수 추가**
   - **"Add New"** 버튼 다시 클릭
   - **Key**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Value**: Supabase에서 복사한 anon public 키
   - **Environment**: 
     - ✅ Production
     - ✅ Preview
     - ✅ Development
   - **"Save"** 클릭

5. **재배포 실행**
   - 상단 메뉴에서 **"Deployments"** 클릭
   - 최신 배포의 **"..."** 메뉴 클릭
   - **"Redeploy"** 선택
   - 확인 메시지에서 **"Redeploy"** 클릭

#### 방법 B: Vercel CLI로 설정

```bash
# Vercel CLI 설치 (없는 경우)
npm i -g vercel

# 프로젝트 디렉토리로 이동
cd "C:\cursor\Clip Bridge"

# Vercel에 로그인
vercel login

# 환경 변수 추가
vercel env add NEXT_PUBLIC_SUPABASE_URL
# 프롬프트에 Supabase URL 입력
# Environment: Production, Preview, Development 모두 선택

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
# 프롬프트에 Supabase anon key 입력
# Environment: Production, Preview, Development 모두 선택

# 프로덕션에 재배포
vercel --prod
```

### 3단계: 확인

1. **재배포 완료 대기**
   - Vercel 대시보드에서 배포 상태 확인
   - 배포가 완료될 때까지 대기 (약 1-2분)

2. **브라우저에서 확인**
   - 배포된 사이트 접속
   - F12 > Console 탭 열기
   - 다음 메시지 확인:
     ```
     ✅ Supabase 클라이언트 초기화 완료
     ```
   - 오류 메시지가 없어야 합니다

3. **기능 테스트**
   - 텍스트 복사 (Ctrl+C)
   - Toast 알림 확인
   - 10초 후 자동 저장 확인
   - Supabase Table Editor에서 데이터 확인

## ✅ 완료 확인

다음이 모두 확인되면 성공입니다:

- ✅ 브라우저 콘솔에 `✅ Supabase 클라이언트 초기화 완료` 메시지
- ✅ 텍스트 복사 시 Toast 알림 표시
- ✅ 10초 후 자동 저장
- ✅ Supabase Table Editor에서 데이터 확인 가능

## 🔍 문제 해결

### 환경 변수를 설정했는데도 오류가 발생하는 경우

1. **재배포 확인**
   - 환경 변수 설정 후 반드시 재배포 필요
   - Deployments 탭에서 "Redeploy" 실행

2. **환경 변수 이름 확인**
   - 정확히 `NEXT_PUBLIC_SUPABASE_URL` (대소문자 구분)
   - 정확히 `NEXT_PUBLIC_SUPABASE_ANON_KEY` (대소문자 구분)
   - `NEXT_PUBLIC_` 접두사 필수

3. **값 확인**
   - URL에 `https://` 포함되어 있는지 확인
   - anon key에 공백이나 줄바꿈이 없는지 확인
   - 따옴표 없이 입력

4. **캐시 클리어**
   - 브라우저 캐시 삭제
   - 시크릿 모드에서 테스트

## 📞 추가 도움말

- [Vercel 환경 변수 문서](https://vercel.com/docs/concepts/projects/environment-variables)
- [Supabase 설정 가이드](./SUPABASE_SETUP.md)


