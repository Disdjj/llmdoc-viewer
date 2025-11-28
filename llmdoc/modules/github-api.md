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
将扁平的 GitNode 数组转换为树结构

```typescript
const treeNodes = buildTreeStructure(docsTree)
// TreeNode[]
```

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
