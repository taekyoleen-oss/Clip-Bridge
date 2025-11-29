# Firebase Realtime Database 보안 규칙

Firebase Console에서 Realtime Database > Rules 탭에 아래 규칙을 설정하세요:

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

## 규칙 설명

- **읽기 권한**: 인증된 사용자만 자신의 데이터를 읽을 수 있습니다
- **쓰기 권한**: 인증된 사용자만 자신의 데이터를 쓸 수 있습니다
- **검증**: 저장되는 데이터가 필수 필드를 포함하고 올바른 타입인지 확인합니다

