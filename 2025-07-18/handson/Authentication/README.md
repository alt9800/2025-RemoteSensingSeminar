#

サーバの起動
npm run dev

このフォルダをDLしたばっかりの場合


npm install express dotenv cors helmet
npm install jsonwebtoken bcrypt express-validator
npm install sqlite3
npm install --save-dev nodemon

node scripts/init-db.js



$ curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "user_id": "testuser"
  }'
{"message":"ユーザー登録が完了しました","token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcl9pZCI6InRlc3R1c2VyIiwiZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIiwiaWF0IjoxNzUzMzg5MTc1LCJleHAiOjE3NTM5OTM5NzV9.aohqI0r4aqf_is3d5xHjO5UNYDjbbcwC1nRxJesAGyE","user":{"id":1,"email":"test@example.com","user_id":"testuser"}}%


$ curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "testuser",
    "password": "password123"
  }'
{"message":"ログインに成功しました","token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcl9pZCI6InRlc3R1c2VyIiwiZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIiwiaWF0IjoxNzUzMzg5MTg2LCJleHAiOjE3NTM5OTM5ODZ9.bRQgPOhRXxWt6fZTNGjKZR-tA6StIGqNjDmznSoR4yk","user":{"id":1,"email":"test@example.com","user_id":"testuser"}}%


$ TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"user_id": "testuser", "password": "password123"}' \
  | grep -o '"token":"[^"]*' | grep -o '[^"]*$')


$ echo $TOKEN
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcl9pZCI6InRlc3R1c2VyIiwiZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIiwiaWF0IjoxNzUzMzg5MjA4LCJleHAiOjE3NTM5OTQwMDh9.JZekScj4ca7Q_ohPfVYxvC_f1zCdEAnCptWT5YtVvzI