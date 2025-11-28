# 组件模块

## UI 基础组件 (src/components/ui/)

基于 shadcn/ui 的组件：

- `button.tsx` - 按钮组件
- `input.tsx` - 输入框组件
- `tabs.tsx` - 标签页组件
- `scroll-area.tsx` - 滚动区域组件
- `skeleton.tsx` - 骨架屏组件

## 业务组件 (src/components/)

### Header
顶部导航栏，包含 Logo、仓库信息、登录/用户信息

```tsx
<Header
  owner="facebook"
  repo="react"
  user={user}
  onLogin={login}
  onLogout={logout}
/>
```

### Layout
页面布局组件，包含 Header 和主内容区

```tsx
<Layout user={user} onLogin={login} onLogout={logout}>
  {children}
</Layout>
```

### FileTree
递归渲染文件树

```tsx
<FileTree
  nodes={treeNodes}
  selectedPath={selectedFile}
  onSelect={(path, sha) => selectFile(path, sha)}
/>
```

### MarkdownView
Markdown 渲染器，支持 GFM 和代码高亮

```tsx
<MarkdownView content={content} isLoading={isLoading} />
```

### EmptyState
空状态/错误提示组件

```tsx
<EmptyState type="no-docs" />
<EmptyState type="not-found" owner="foo" repo="bar" />
<EmptyState type="rate-limit" onLogin={login} />
```
