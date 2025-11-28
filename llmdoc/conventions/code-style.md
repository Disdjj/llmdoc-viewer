# 代码风格规范

## TypeScript

- 使用 TypeScript 严格模式
- 优先使用 `interface` 而非 `type`
- 导出类型使用 `export type`

```typescript
// Good
export interface UserProps {
  name: string
  age: number
}

// Avoid
export type UserProps = {
  name: string
  age: number
}
```

## React 组件

- 使用函数组件 + Hooks
- Props 接口命名：`ComponentNameProps`
- 组件文件使用 PascalCase

```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary'
  children: React.ReactNode
}

export function Button({ variant = 'primary', children }: ButtonProps) {
  return <button className={variant}>{children}</button>
}
```

## 文件命名

- 组件文件：PascalCase，如 `FileTree.tsx`
- 工具/Hook 文件：camelCase，如 `useAuth.ts`
- 类型文件：camelCase，如 `index.ts`

## 导入顺序

1. React/第三方库
2. 项目内部模块（绝对路径）
3. 相对路径导入
4. 类型导入

```typescript
import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

import type { UserProps } from './types'
```

## CSS/Tailwind

- 使用 Tailwind CSS 类
- 复杂样式使用 `cn()` 合并
- 避免内联 style

```tsx
// Good
<div className={cn(
  "flex items-center",
  isActive && "bg-blue-500"
)} />

// Avoid
<div style={{ display: 'flex' }} />
```
