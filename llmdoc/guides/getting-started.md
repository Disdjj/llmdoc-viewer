# 快速开始

## 环境要求

- Node.js >= 18
- npm >= 9

## 安装步骤

### 1. 克隆项目

```bash
git clone <repo-url>
cd llmdoc-reader
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

```bash
cp .env.example .env
cp .dev.vars.example .dev.vars
```

### 4. 创建 GitHub OAuth App

1. 访问 https://github.com/settings/developers
2. 点击 "New OAuth App"
3. 填写信息：
   - Application name: LLMDoc Viewer (Dev)
   - Homepage URL: `http://localhost:5173`
   - Authorization callback URL: `http://localhost:5173/callback`
4. 创建后复制 Client ID 和 Client Secret
5. 填入 `.env` 和 `.dev.vars` 文件

### 5. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:5173

## 常用命令

```bash
npm run dev      # 启动开发服务器
npm run build    # 构建生产版本
npm run preview  # 预览生产版本
npm run lint     # 代码检查
```
