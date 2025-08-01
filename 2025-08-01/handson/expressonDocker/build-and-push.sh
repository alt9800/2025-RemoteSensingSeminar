#!/bin/bash

# 環境変数の設定
REGISTRY_URL=${REGISTRY_URL:-"your-registry.com"}
IMAGE_NAME="field-survey-app"
TAG=${TAG:-"latest"}

# カラー出力用
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Building multi-platform image for App Run...${NC}"

# ビルドとプッシュを同時に実行（--push オプション）
docker buildx build \
  --platform linux/amd64 \
  --tag ${REGISTRY_URL}/${IMAGE_NAME}:${TAG} \
  --tag ${REGISTRY_URL}/${IMAGE_NAME}:latest \
  --file Dockerfile.prod \
  --push \
  .

if [ $? -eq 0 ]; then
    echo -e "${GREEN}Successfully built and pushed image!${NC}"
    echo -e "${GREEN}Image: ${REGISTRY_URL}/${IMAGE_NAME}:${TAG}${NC}"
else
    echo -e "${RED}Build failed!${NC}"
    exit 1
fi

# オプション: ローカルでテストしたい場合
# --load オプションでローカルにもロード
# docker buildx build \
#   --platform linux/amd64 \
#   --tag ${REGISTRY_URL}/${IMAGE_NAME}:${TAG} \
#   --file Dockerfile.prod \
#   --load \
#   .