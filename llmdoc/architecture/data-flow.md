# 数据流程

## OAuth 登录流程

```
1. 用户点击 "Login with GitHub"
2. Browser 跳转到 GitHub OAuth 授权页面
3. 用户授权后，GitHub 回调到 /callback?code=XYZ
4. Browser 调用 POST /api/auth { code }
5. CF Function 使用 Client Secret 换取 access_token
6. Browser 将 token 存入 LocalStorage
```

## 仓库数据加载流程

```
1. 用户访问 /:owner/:repo
2. 调用 GET /repos/:owner/:repo 获取默认分支
3. 调用 GET /repos/:owner/:repo/git/trees/:branch?recursive=1
4. 客户端过滤出 claude.md、agents.md、llmdoc/ 文件
5. 构建文件树结构，渲染 UI
```

## 文件内容加载流程

```
1. 用户点击文件
2. 调用 GET /repos/:owner/:repo/git/blobs/:sha
3. Base64 解码内容
4. 渲染 Markdown
```

## 状态管理

- **AuthState**: 存储在 LocalStorage，通过 `useAuth` hook 访问
- **RepoState**: 存储在组件状态，通过 `useRepo` hook 管理
- **FileContent**: 按需加载，不做全局缓存
