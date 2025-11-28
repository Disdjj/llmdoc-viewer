# 认证模块

## 文件位置

- `src/lib/auth.ts` - 客户端认证工具
- `src/hooks/useAuth.ts` - React Hook
- `functions/api/auth.ts` - 服务端 Token 交换

## API

### getAuthState()
获取当前认证状态（从 LocalStorage 读取）

```typescript
function getAuthState(): AuthState {
  // 返回 { isAuthenticated, token?, user? }
}
```

### setAuthState(token, user)
保存认证状态到 LocalStorage

### clearAuthState()
清除认证状态（登出）

### getLoginUrl(redirectPath?)
生成 GitHub OAuth 授权 URL

### exchangeCodeForToken(code)
调用服务端 API 交换 access_token

### fetchCurrentUser(token)
获取当前登录用户信息

## useAuth Hook

```typescript
const {
  isAuthenticated,  // 是否已登录
  token,            // access token
  user,             // 用户信息
  isLoading,        // 是否正在处理
  login,            // 触发登录
  logout,           // 登出
  handleCallback,   // 处理 OAuth 回调
} = useAuth()
```
