FROM node:18-alpine

WORKDIR /app

# パッケージファイルをコピー
COPY package*.json ./

# 依存関係をインストール（package-lock.jsonがない場合はnpm installを使用）
RUN npm install

# アプリケーションファイルをコピー
COPY . .

# 必要なディレクトリを作成
RUN mkdir -p uploads public/css public/js public/login public/signup public/mypage

# ポート公開
EXPOSE 3000

# 開発環境では nodemon を使用
CMD ["npm", "run", "dev"]