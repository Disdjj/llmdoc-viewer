# GitHub API 模块

## 文件位置

- `src/lib/github.ts` - API 封装
- `src/hooks/useRepo.ts` - React Hook

## API 函数

### fetchRepoInfo(owner, repo, options?)
获取仓库基本信息，主要用于获取默认分支

```typescript
const info = await fetchRepoInfo("facebook", "react", { token })
// { owner, repo, defaultBranch, description }
```

### fetchRepoTree(owner, repo, branch, options?)
获取仓库完整文件树（递归）

```typescript
const tree = await fetchRepoTree("facebook", "react", "main", { token })
// GitNode[]
```

### filterLLMDocs(tree)
过滤出 LLM 相关文档

```typescript
const { claudeMd, agentsMd, docsTree } = filterLLMDocs(tree)
```

### buildTreeStructure(nodes)
将扁平的 GitNode 数组转换为树结构，并按照文件夹优先级和显示规则排序

**排序规则：**
1. `index.md` 永远排在最前
2. `overview` 相关文件排在前面
3. 文件和文件夹分组显示（文件先，文件夹后）
4. 根级别的文件夹按照优先级排序：
   - `architecture` (优先级 1)
   - `guides` (优先级 2)
   - `features` (优先级 3)
   - `modules` (优先级 4)
   - `conventions` (优先级 5)
   - `sop` (优先级 6)
   - 其他文件夹 (优先级 99)

```typescript
const treeNodes = buildTreeStructure(docsTree)
// TreeNode[]
```

源码位置：`src/lib/github.ts:93-180` (FOLDER_PRIORITY 常量 + buildTreeStructure 函数)

### fetchFileContent(owner, repo, sha, options?)
获取文件内容（Base64 解码）

```typescript
const content = await fetchFileContent("facebook", "react", "abc123", { token })
// string
```

## useRepo Hook

```typescript
const {
  isLoading,
  error,
  hasContent,
  tabs,           // { claudeMd?, agentsMd?, docsTree }
  tree,           // TreeNode[]
  selectedFile,
  fileContent,
  isLoadingFile,
  selectFile,
} = useRepo({ owner, repo, token })
```
