# ✅ Supabase 설정 체크리스트

이 체크리스트를 따라하시면 Supabase 설정을 빠르게 완료할 수 있습니다.

## 📋 체크리스트

### 1단계: Supabase 프로젝트 생성
- [ ] [Supabase](https://supabase.com/) 접속 및 로그인
- [ ] "New Project" 클릭
- [ ] 프로젝트 이름 입력: `clipbridge`
- [ ] Database Password 설정 (기억해두세요!)
- [ ] Region 선택: `Northeast Asia (Seoul)`
- [ ] 프로젝트 생성 완료 대기 (약 2분)

### 2단계: 데이터베이스 테이블 생성
- [ ] Supabase 대시보드 > **SQL Editor** 클릭
- [ ] **"New query"** 클릭
- [ ] `supabase/setup.sql` 파일 열기
- [ ] 전체 SQL 복사하여 붙여넣기
- [ ] **"Run"** 버튼 클릭 (또는 Ctrl+Enter)
- [ ] 성공 메시지 확인

### 3단계: Realtime 활성화 확인
- [ ] Supabase 대시보드 > **Database** > **Replication** 메뉴 클릭
- [ ] `clips` 테이블 찾기
- [ ] Realtime 토글이 **ON**인지 확인
- [ ] OFF라면 토글을 ON으로 변경

### 4단계: API 키 가져오기
- [ ] Supabase 대시보드 > **⚙️ Settings** 클릭
- [ ] **"API"** 메뉴 클릭
- [ ] **Project URL** 복사
- [ ] **anon public** 키 복사

### 5단계: 환경 변수 설정
- [ ] 프로젝트 루트에 `.env.local` 파일 확인 (이미 생성됨)
- [ ] `.env.local` 파일 열기
- [ ] `NEXT_PUBLIC_SUPABASE_URL`에 Project URL 붙여넣기
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`에 anon key 붙여넣기
- [ ] 파일 저장

### 6단계: 테스트
- [ ] 터미널에서 `pnpm dev` 실행
- [ ] 브라우저에서 [http://localhost:3000](http://localhost:3000) 접속
- [ ] 브라우저 콘솔(F12)에서 오류 확인
- [ ] 텍스트 복사하여 저장 테스트
- [ ] Supabase 대시보드 > **Table Editor** > `clips` 테이블에서 데이터 확인

## 🎯 완료 확인

모든 체크리스트를 완료했다면:
- ✅ 텍스트를 복사하면 Toast 알림이 나타남
- ✅ 10초 후 자동 저장 또는 "즉시 저장" 버튼으로 저장 가능
- ✅ 저장된 클립이 화면에 표시됨
- ✅ Supabase Table Editor에서 데이터 확인 가능

## 🆘 문제가 발생한 경우

### 연결 오류
1. `.env.local` 파일의 값이 올바른지 확인
2. 개발 서버 재시작 (`Ctrl+C` 후 `pnpm dev`)
3. 브라우저 콘솔에서 오류 메시지 확인

### 테이블이 보이지 않음
1. SQL Editor에서 SQL이 성공적으로 실행되었는지 확인
2. Table Editor에서 `clips` 테이블 확인
3. 필요시 `supabase/setup.sql` 다시 실행

### Realtime이 작동하지 않음
1. Database > Replication에서 `clips` 테이블의 Realtime 확인
2. SQL Editor에서 `ALTER PUBLICATION supabase_realtime ADD TABLE clips;` 실행

## 📚 참고 문서

- 빠른 설정 가이드: [SUPABASE_QUICK_SETUP.md](./SUPABASE_QUICK_SETUP.md)
- 상세 설정 가이드: [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)


