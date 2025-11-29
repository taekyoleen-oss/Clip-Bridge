# ClipBridge 빠른 시작 가이드

## 🚀 5분 안에 시작하기

### 1. Firebase 프로젝트 생성 (2분)

1. [Firebase Console](https://console.firebase.google.com/) 접속
2. "프로젝트 추가" → 이름 입력 → 생성
3. **Realtime Database** 활성화 (테스트 모드)
4. **Authentication** → 익명 인증 활성화

### 2. 환경 변수 설정 (1분)

1. Firebase 프로젝트 설정에서 웹 앱 추가
2. 설정 값 복사
3. `.env.local` 파일 생성 및 값 입력:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_DATABASE_URL=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

### 3. 실행 (1분)

```bash
pnpm dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

### 4. 테스트 (1분)

1. 브라우저에서 클립보드 권한 허용
2. 텍스트 복사 (Ctrl+C)
3. 10초 카운트다운 확인
4. "즉시 저장" 또는 자동 저장 확인

## ✅ 완료!

이제 PC에서 복사한 텍스트가 자동으로 감지되어 Firebase에 저장됩니다.

모바일에서 같은 URL을 열면 저장된 클립을 확인하고 복사/공유할 수 있습니다.

## 📱 모바일 접속

같은 Firebase 프로젝트를 사용하는 경우, 모바일 브라우저에서도 동일한 URL로 접속하면 실시간으로 동기화됩니다.

## 🔧 문제 해결

### 클립보드가 감지되지 않음
- 브라우저에서 클립보드 권한 확인
- HTTPS 환경인지 확인 (로컬은 localhost에서 작동)

### Firebase 연결 오류
- `.env.local` 파일의 값이 올바른지 확인
- Firebase Console에서 서비스 활성화 확인

더 자세한 내용은 `SETUP.md`를 참고하세요.


