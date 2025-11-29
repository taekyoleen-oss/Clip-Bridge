# 🔥 Firebase 설정 가이드 (단계별 상세 설명)

이 가이드는 ClipBridge 앱을 위한 Firebase 설정을 단계별로 안내합니다.

## 📋 목차
1. [Firebase 프로젝트 생성](#1-firebase-프로젝트-생성)
2. [Realtime Database 설정](#2-realtime-database-설정)
3. [Authentication 설정](#3-authentication-설정)
4. [웹 앱 등록 및 설정 값 가져오기](#4-웹-앱-등록-및-설정-값-가져오기)
5. [환경 변수 파일 생성](#5-환경-변수-파일-생성)
6. [보안 규칙 설정](#6-보안-규칙-설정)
7. [테스트](#7-테스트)

---

## 1. Firebase 프로젝트 생성

### 1-1. Firebase Console 접속
1. 웹 브라우저에서 [Firebase Console](https://console.firebase.google.com/) 접속
2. Google 계정으로 로그인 (없으면 계정 생성)

### 1-2. 프로젝트 추가
1. 화면 상단의 **"프로젝트 추가"** 또는 **"Add project"** 버튼 클릭
2. 프로젝트 이름 입력 (예: `clipbridge` 또는 `clip-bridge`)
   - 프로젝트 ID는 자동 생성되거나 수정 가능
3. **"계속"** 또는 **"Continue"** 클릭

### 1-3. Google Analytics 설정 (선택사항)
- Google Analytics 사용 여부 선택
- 사용하지 않으려면 **"이 프로젝트에 Google Analytics 사용 설정 안 함"** 선택
- **"프로젝트 만들기"** 클릭

### 1-4. 프로젝트 생성 완료
- 프로젝트 생성이 완료되면 **"계속"** 클릭하여 Firebase Console로 이동

---

## 2. Realtime Database 설정

### 2-1. Realtime Database 메뉴 접근
1. Firebase Console 왼쪽 메뉴에서 **"Realtime Database"** 클릭
   - 또는 **"Build"** > **"Realtime Database"** 선택

### 2-2. 데이터베이스 생성
1. **"데이터베이스 만들기"** 또는 **"Create Database"** 버튼 클릭

### 2-3. 위치 선택
1. 데이터베이스 위치 선택
   - **권장**: `asia-northeast3` (서울) - 한국 사용자에게 가장 빠름
   - 또는 `us-central1` (미국 중부)
2. **"다음"** 클릭

### 2-4. 보안 규칙 설정
1. **"테스트 모드로 시작"** 선택 ⚠️
   - 나중에 보안 규칙을 설정할 예정이므로 일단 테스트 모드로 시작
2. **"사용 설정"** 클릭

### 2-5. 데이터베이스 URL 확인
- 데이터베이스가 생성되면 상단에 **데이터베이스 URL**이 표시됩니다
- 예: `https://your-project-default-rtdb.firebaseio.com/`
- 이 URL을 복사해두세요 (나중에 사용)

---

## 3. Authentication 설정

### 3-1. Authentication 메뉴 접근
1. Firebase Console 왼쪽 메뉴에서 **"Authentication"** 클릭
2. **"시작하기"** 또는 **"Get started"** 클릭 (처음 사용하는 경우)

### 3-2. 익명 인증 활성화
1. 상단의 **"Sign-in method"** 탭 클릭
2. 제공업체 목록에서 **"익명"** 또는 **"Anonymous"** 찾기
3. **"익명"** 클릭하여 설정 열기
4. **"사용 설정"** 토글을 **ON**으로 변경
5. **"저장"** 클릭

✅ 익명 인증이 활성화되었습니다!

---

## 4. 웹 앱 등록 및 설정 값 가져오기

### 4-1. 프로젝트 설정 열기
1. Firebase Console 왼쪽 상단의 **⚙️ 톱니바퀴 아이콘** 클릭
2. **"프로젝트 설정"** 또는 **"Project settings"** 선택

### 4-2. 웹 앱 추가
1. 설정 페이지에서 **"내 앱"** 또는 **"Your apps"** 섹션 찾기
2. 웹 앱 아이콘 **`</>`** 클릭
3. 앱 닉네임 입력 (예: `ClipBridge Web`)
4. **"앱 등록"** 또는 **"Register app"** 클릭

### 4-3. 설정 값 복사
앱이 등록되면 다음과 같은 설정 값이 표시됩니다:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "your-project.firebaseapp.com",
  databaseURL: "https://your-project-default-rtdb.firebaseio.com/",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

**각 값을 복사해두세요!** (다음 단계에서 사용)

---

## 5. 환경 변수 파일 생성

### 5-1. .env.local 파일 생성
프로젝트 루트 디렉토리(`Clip Bridge` 폴더)에 `.env.local` 파일을 생성합니다.

**Windows PowerShell에서:**
```powershell
# .env.local.example 파일을 복사하여 생성
Copy-Item .env.local.example .env.local
```

**또는 직접 생성:**
1. 프로젝트 루트 폴더에서 새 파일 생성
2. 파일 이름을 `.env.local`로 지정 (앞의 점 포함)

### 5-2. 환경 변수 값 입력
`.env.local` 파일을 열고 아래 형식에 맞춰 Firebase 설정 값을 입력하세요:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...여기에-apiKey-값-입력
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your-project-default-rtdb.firebaseio.com/
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

**⚠️ 중요:**
- `=` 기호 양쪽에 공백 없이 입력
- 값에 따옴표(`"`)나 세미콜론(`;`) 없이 입력
- `databaseURL` 끝에 슬래시(`/`) 포함

### 5-3. 파일 저장
파일을 저장하고 닫습니다.

---

## 6. 보안 규칙 설정

### 6-1. Realtime Database Rules 탭 이동
1. Firebase Console에서 **"Realtime Database"** 메뉴 클릭
2. 상단의 **"Rules"** 탭 클릭

### 6-2. 보안 규칙 입력
기본 규칙을 삭제하고 아래 규칙을 복사하여 붙여넣기:

```json
{
  "rules": {
    "users": {
      "$userId": {
        "clips": {
          "$clipId": {
            ".read": "auth != null && auth.uid == $userId",
            ".write": "auth != null && auth.uid == $userId",
            ".validate": "newData.hasChildren(['text', 'timestamp', 'device', 'isSynced']) && newData.child('text').isString() && newData.child('timestamp').isString() && newData.child('device').isString() && newData.child('isSynced').isBoolean()"
          }
        }
      }
    }
  }
}
```

### 6-3. 규칙 게시
1. **"게시"** 또는 **"Publish"** 버튼 클릭
2. 확인 메시지에서 **"게시"** 클릭

✅ 보안 규칙이 적용되었습니다!

---

## 7. 테스트

### 7-1. 개발 서버 실행
터미널에서 다음 명령어 실행:

```bash
pnpm dev
```

### 7-2. 브라우저에서 확인
1. 브라우저에서 [http://localhost:3000](http://localhost:3000) 접속
2. 콘솔(F12)에서 오류가 없는지 확인
3. 클립보드 권한 요청 시 **"허용"** 클릭

### 7-3. 기능 테스트
1. 텍스트 복사 (Ctrl+C)
2. 우측 하단에 Toast 알림이 나타나는지 확인
3. 10초 카운트다운이 작동하는지 확인
4. "즉시 저장" 버튼 클릭하여 저장 테스트
5. 저장된 클립이 화면에 나타나는지 확인

### 7-4. Firebase Console에서 데이터 확인
1. Firebase Console > Realtime Database > Data 탭 이동
2. `users` > `[사용자ID]` > `clips` 경로에 데이터가 저장되었는지 확인

---

## ✅ 설정 완료!

이제 ClipBridge 앱이 정상적으로 작동합니다!

## 🔧 문제 해결

### 환경 변수가 적용되지 않음
- 개발 서버를 재시작하세요: `Ctrl+C` 후 `pnpm dev` 다시 실행
- `.env.local` 파일이 프로젝트 루트에 있는지 확인
- 파일 이름이 정확히 `.env.local`인지 확인 (앞의 점 포함)

### Firebase 연결 오류
- 브라우저 콘솔(F12)에서 오류 메시지 확인
- `.env.local` 파일의 값이 올바른지 확인
- Firebase Console에서 서비스가 활성화되었는지 확인

### 인증 오류
- Authentication에서 익명 인증이 활성화되었는지 확인
- 브라우저 콘솔에서 인증 관련 오류 확인

### 데이터베이스 오류
- Realtime Database가 생성되었는지 확인
- 보안 규칙이 올바르게 설정되었는지 확인
- 데이터베이스 URL이 올바른지 확인

---

## 📞 추가 도움말

- [Firebase 공식 문서](https://firebase.google.com/docs)
- [Next.js 환경 변수 문서](https://nextjs.org/docs/basic-features/environment-variables)

