# ClipBridge 설정 가이드

## 1단계: 프로젝트 설정

### 의존성 설치

```bash
pnpm install
```

## 2단계: Firebase 프로젝트 생성

1. [Firebase Console](https://console.firebase.google.com/) 접속
2. "프로젝트 추가" 클릭
3. 프로젝트 이름 입력 (예: `clipbridge`)
4. Google Analytics 설정 (선택사항)

## 3단계: Firebase 서비스 활성화

### Realtime Database 활성화

1. Firebase Console에서 "Realtime Database" 메뉴 선택
2. "데이터베이스 만들기" 클릭
3. 위치 선택 (예: `asia-northeast3` - 서울)
4. **테스트 모드로 시작** 선택 (나중에 보안 규칙 설정)

### Authentication 활성화

1. Firebase Console에서 "Authentication" 메뉴 선택
2. "시작하기" 클릭
3. "Sign-in method" 탭에서 "익명" 활성화

## 4단계: Firebase 설정 값 가져오기

1. Firebase Console에서 프로젝트 설정(톱니바퀴 아이콘) 클릭
2. "내 앱" 섹션에서 웹 앱 추가 (</> 아이콘)
3. 앱 닉네임 입력 후 등록
4. 설정 값 복사:
   - `apiKey`
   - `authDomain`
   - `databaseURL`
   - `projectId`
   - `storageBucket`
   - `messagingSenderId`
   - `appId`

## 5단계: 환경 변수 설정

프로젝트 루트에 `.env.local` 파일 생성:

```bash
cp .env.local.example .env.local
```

`.env.local` 파일을 열고 Firebase 설정 값 입력:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key-here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your-project-default-rtdb.firebaseio.com/
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

## 6단계: Firebase 보안 규칙 설정

1. Firebase Console > Realtime Database > Rules 탭 이동
2. `app/firebase-rules.md` 파일의 규칙 복사하여 붙여넣기
3. "게시" 클릭

## 7단계: 개발 서버 실행

```bash
pnpm dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

## 8단계: 클립보드 권한 허용

1. 브라우저에서 클립보드 읽기 권한 요청 시 허용
2. Chrome/Edge: 주소창 왼쪽의 자물쇠 아이콘 클릭 > 권한 허용
3. Firefox: 설정 > 개인정보 및 보안 > 권한 > 클립보드

## 문제 해결

### 클립보드 읽기 권한 오류

- **HTTPS 필요**: 프로덕션 환경에서는 HTTPS가 필요합니다
- **로컬 개발**: `localhost`에서는 HTTP로도 작동합니다
- **권한 확인**: 브라우저 설정에서 클립보드 권한 확인

### Firebase 연결 오류

- 환경 변수가 올바르게 설정되었는지 확인
- Firebase Console에서 서비스가 활성화되었는지 확인
- 브라우저 콘솔에서 오류 메시지 확인

### 데이터가 동기화되지 않음

- Firebase 보안 규칙이 올바르게 설정되었는지 확인
- 익명 인증이 활성화되었는지 확인
- 네트워크 연결 상태 확인

