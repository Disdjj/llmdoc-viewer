# LLMDoc Viewer

一个轻量级的 GitHub 仓库浏览器，专门用于展示开源项目中的 LLM 文档。

## 功能特点

- **智能视图**: 自动识别并展示 `claude.md`、`agents.md` 和 `llmdoc/` 目录
- **GitHub 集成**: 支持 GitHub OAuth 登录，获取更高的 API 配额
- **Markdown 渲染**: 支持 GFM 语法、代码高亮
- **极简架构**: Serverless 无状态设计，部署在 Cloudflare Pages

## 技术栈

- **前端**: React + TypeScript + Vite
- **样式**: Tailwind CSS + shadcn/ui
- **路由**: TanStack Router
- **Markdown**: react-markdown + rehype-highlight
- **部署**: Cloudflare Pages + Functions

## 本地开发

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制环境变量模板并填入实际值：

```bash
cp .env.example .env
cp .dev.vars.example .dev.vars
```

需要创建 GitHub OAuth App：
1. 访问 https://github.com/settings/developers
2. 创建新的 OAuth App
3. Homepage URL: `http://localhost:5173`
4. Callback URL: `http://localhost:5173/callback`

### 3. 启动开发服务器

```bash
npm run dev
```

## 部署到 Cloudflare

### 1. 创建 Cloudflare Pages 项目

```bash
npx wrangler pages project create llmdoc-viewer
```

### 2. 配置环境变量

在 Cloudflare Dashboard 中设置：
- `GITHUB_CLIENT_ID`
- `GITHUB_CLIENT_SECRET` (作为 Secret)

### 3. 部署

```bash
npm run build
npx wrangler pages deploy dist
```

## 项目结构

```
├── functions/           # Cloudflare Functions
│   └── api/
│       └── auth.ts      # OAuth Token 交换
├── src/
│   ├── components/      # UI 组件
│   ├── hooks/           # React Hooks
│   ├── lib/             # 工具函数
│   ├── routes/          # 路由组件
│   └── types/           # TypeScript 类型
└── wrangler.toml        # Cloudflare 配置
```

## License

MIT
