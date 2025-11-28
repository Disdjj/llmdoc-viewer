// Git Tree API 返回的原始节点
export interface GitNode {
  path: string
  mode: string
  type: "blob" | "tree"
  sha: string
  url: string
  size?: number
}

// 清洗后的仓库状态 (供 UI 使用)
export interface RepoState {
  isLoading: boolean
  error?: string
  hasContent: boolean
  tabs: {
    claudeMd?: GitNode
    agentsMd?: GitNode
    docsTree: GitNode[]
  }
}

// 文件树节点 (用于递归渲染)
export interface TreeNode {
  name: string
  path: string
  type: "file" | "folder"
  sha: string
  children?: TreeNode[]
}

// GitHub 用户信息
export interface GitHubUser {
  login: string
  avatar_url: string
  name?: string
}

// 认证状态
export interface AuthState {
  isAuthenticated: boolean
  token?: string
  user?: GitHubUser
}

// 仓库信息
export interface RepoInfo {
  owner: string
  repo: string
  defaultBranch: string
  description?: string
}
