# Socket.IO Chat Example

Node.js, Express, Socket.IO로 만든 간단한 실시간 채팅 예제입니다.

## 요구 사항

- Node.js 18 이상

## 설치

```bash
npm install
```

## 실행

```bash
npm start
```

브라우저에서 `http://localhost:3000`으로 접속하세요.

개발 중 파일 변경을 감지하려면:

```bash
npm run dev
```

## 주요 파일

- `server.js`: Express 서버와 Socket.IO 이벤트 처리
- `public/index.html`: 채팅 화면
- `public/app.js`: 브라우저 Socket.IO 클라이언트
- `public/styles.css`: 화면 스타일
