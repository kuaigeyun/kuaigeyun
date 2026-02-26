# 构建阶段
FROM node:22-alpine AS builder

WORKDIR /app

# 复制依赖文件及 patches（postinstall 的 patch-package 需要）
COPY package.json package-lock.json ./
COPY patches ./patches/

# 将 lock 文件中的 npmmirror 替换为 npm 官方源，确保 GitHub Actions 可拉取
RUN sed -i 's|registry.npmmirror.com|registry.npmjs.org|g' package-lock.json

RUN npm config set fetch-retries 5 && npm config set fetch-timeout 300000 && \
    npm ci --legacy-peer-deps

COPY . .
RUN npm run build

# 生产阶段
FROM nginx:alpine

# 复制构建产物（Vite 默认输出到 dist）
COPY --from=builder /app/dist /usr/share/nginx/html

# 复制 nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
