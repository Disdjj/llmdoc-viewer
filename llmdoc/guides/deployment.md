# 部署指南

## Cloudflare Pages 部署

### 1. 安装 Wrangler CLI

```bash
npm install -g wrangler
wrangler login
```

### 2. 创建 Pages 项目

```bash
wrangler pages project create llmdoc-viewer
```

### 3. 配置环境变量

在 Cloudflare Dashboard 中配置：

1. 进入 Pages 项目设置
2. 找到 "Environment variables"
3. 添加以下变量：

| 变量名 | 类型 | 说明 |
|-------|------|------|
| `GITHUB_CLIENT_ID` | 普通变量 | OAuth App Client ID |
| `GITHUB_CLIENT_SECRET` | 加密变量 | OAuth App Secret |

### 4. 更新 GitHub OAuth App

将 OAuth App 的 URL 更新为生产域名：

- Homepage URL: `https://your-project.pages.dev`
- Callback URL: `https://your-project.pages.dev/callback`

### 5. 部署

```bash
npm run build
wrangler pages deploy dist
```

## 自定义域名

1. 在 Cloudflare Dashboard 中添加自定义域名
2. 配置 DNS 记录
3. 更新 GitHub OAuth App 的 URL

## CI/CD 配置

可以配置 GitHub Actions 自动部署：

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build
      - uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          command: pages deploy dist --project-name=llmdoc-viewer
```
