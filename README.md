# 📋 ClipBridge (클립브릿지)

PC와 모바일 간의 끊김 없는 텍스트 데이터 공유 앱

## ✨ 주요 기능

- **자동 감지**: PC에서 복사한 텍스트를 자동으로 감지
- **안전한 저장**: 10초 지연 전송을 통해 실수 방지 (비밀번호 등)
- **실시간 동기화**: Supabase PostgreSQL + Realtime을 통한 즉시 동기화
- **모바일 지원**: 모바일에서도 접근 가능하며 복사/공유 기능 제공
- **심플한 UI**: 텍스트 전용으로 가볍고 빠른 인터페이스

## 🚀 시작하기

### 1. 의존성 설치

```bash
pnpm install
```

### 2. Supabase 설정

1. [Supabase](https://supabase.com/)에서 새 프로젝트 생성
2. 데이터베이스 테이블 생성 (SQL Editor 사용)
3. Realtime 기능 활성화
4. `.env.local.example`을 `.env.local`로 복사하고 Supabase 설정 값 입력

```bash
cp .env.local.example .env.local
```

자세한 설정 방법은 [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)를 참고하세요.

### 3. 개발 서버 실행

```bash
pnpm dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 📱 사용 방법

### PC에서

1. 웹 브라우저에서 앱을 열고 클립보드 읽기 권한을 허용
2. 텍스트를 복사하면 자동으로 감지됨
3. 10초 카운트다운이 시작되며, "즉시 저장" 또는 "취소" 버튼으로 제어 가능
4. 저장된 클립은 실시간으로 Supabase에 업로드됨

### 모바일에서

1. 모바일 브라우저에서 앱 접속
2. 저장된 클립 목록 확인
3. 클립을 터치하여 복사하거나 공유 기능 사용

## 🛠 기술 스택

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Realtime)
- **Authentication**: 로컬 스토리지 기반 사용자 ID

## 📝 주의사항

- 클립보드 읽기 기능은 HTTPS 환경에서만 작동합니다 (로컬 개발은 localhost에서 가능)
- 브라우저에서 클립보드 접근 권한을 허용해야 합니다
- 모바일에서는 클립보드 자동 감지가 제한적일 수 있습니다 (보안 정책)

## 🔒 보안

- 로컬 스토리지 기반 사용자 ID로 사용자별 데이터 분리
- Supabase Row Level Security (RLS) 설정 권장
- 민감한 정보(비밀번호 등)는 10초 지연을 통해 실수 방지

## 🔄 Firebase에서 전환

이 프로젝트는 Supabase를 사용합니다. Firebase에서 전환한 경우 [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)를 참고하세요.

## 📄 라이선스

MIT License

