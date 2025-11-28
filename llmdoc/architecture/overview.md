# 架构概述

## 技术栈

| 模块 | 技术栈 | 选型理由 |
| :--- | :--- | :--- |
| **基础设施** | Cloudflare Pages | 同时托管静态前端 + Serverless Functions，全球分发 |
| **后端逻辑** | CF Pages Functions | 唯一的后端代码，用于保护 OAuth Client Secret |
| **前端框架** | React + Vite | 生态成熟，开发速度快 |
| **样式** | Tailwind CSS + shadcn/ui | 组件化设计，开发效率高 |
| **路由** | TanStack Router | 类型安全的现代路由方案 |
| **状态管理** | React Hooks | 足够轻量，无需 Redux/Zustand |
| **GitHub 调用** | Native `fetch` | 只需调用几个 API，无需 Octokit |

## 架构模式

采用 **"Stateless Proxy (无状态代理)"** 模式：

- Cloudflare Functions 仅作为"密钥保管员"完成一次性 OAuth 握手
- 握手完成后，客户端接管所有 GitHub API 调用
- 服务端不存储任何 Session、User 数据或 Token

## 目录结构

```
/
├── functions/                  # [后端] Cloudflare 运行环境
│   └── api/
│       └── auth.ts             # 唯一接口：Code 换 Token
├── src/                        # [前端] 浏览器运行环境
│   ├── components/             # UI 组件
│   │   ├── ui/                 # shadcn/ui 基础组件
│   │   ├── FileTree.tsx        # 文件树组件
│   │   ├── MarkdownView.tsx    # Markdown 渲染器
│   │   └── ...
│   ├── lib/
│   │   ├── auth.ts             # 认证工具
│   │   └── github.ts           # GitHub API 封装
│   ├── hooks/
│   │   ├── useAuth.ts          # 认证状态 Hook
│   │   └── useRepo.ts          # 仓库数据 Hook
│   ├── routes/                 # TanStack Router 路由
│   └── types/                  # TypeScript 类型定义
├── wrangler.toml               # CF 部署配置
└── package.json
```
