import type { GitNode, TreeNode, RepoInfo } from "@/types"

interface FetchOptions {
  token?: string
}

function getHeaders(options?: FetchOptions): HeadersInit {
  const headers: HeadersInit = {
    Accept: "application/vnd.github.v3+json",
  }
  if (options?.token) {
    headers.Authorization = `Bearer ${options.token}`
  }
  return headers
}

export async function fetchRepoInfo(
  owner: string,
  repo: string,
  options?: FetchOptions
): Promise<RepoInfo> {
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}`,
    { headers: getHeaders(options) }
  )

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("REPO_NOT_FOUND")
    }
    if (response.status === 403) {
      throw new Error("RATE_LIMIT")
    }
    throw new Error(`Failed to fetch repo: ${response.status}`)
  }

  const data = await response.json()
  return {
    owner,
    repo,
    defaultBranch: data.default_branch,
    description: data.description,
  }
}

export async function fetchRepoTree(
  owner: string,
  repo: string,
  branch: string,
  options?: FetchOptions
): Promise<GitNode[]> {
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`,
    { headers: getHeaders(options) }
  )

  if (!response.ok) {
    if (response.status === 403) {
      throw new Error("RATE_LIMIT")
    }
    throw new Error(`Failed to fetch tree: ${response.status}`)
  }

  const data = await response.json()
  return data.tree as GitNode[]
}

export function filterLLMDocs(tree: GitNode[]): {
  claudeMd?: GitNode
  agentsMd?: GitNode
  docsTree: GitNode[]
} {
  let claudeMd: GitNode | undefined
  let agentsMd: GitNode | undefined
  const docsTree: GitNode[] = []

  for (const node of tree) {
    const lowerPath = node.path.toLowerCase()

    // 检查根目录下的特殊文件
    if (lowerPath === "claude.md" || lowerPath === "llms.txt") {
      claudeMd = node
    } else if (lowerPath === "agents.md") {
      agentsMd = node
    } else if (node.path.startsWith("llmdoc/")) {
      docsTree.push(node)
    }
  }

  return { claudeMd, agentsMd, docsTree }
}

export function buildTreeStructure(nodes: GitNode[]): TreeNode[] {
  const root: TreeNode[] = []
  const map = new Map<string, TreeNode>()

  // 移除 llmdoc/ 前缀，按路径排序
  const sortedNodes = [...nodes].sort((a, b) => a.path.localeCompare(b.path))

  for (const node of sortedNodes) {
    // 移除 llmdoc/ 前缀
    const relativePath = node.path.replace(/^llmdoc\//, "")
    const parts = relativePath.split("/")
    const name = parts[parts.length - 1]

    const treeNode: TreeNode = {
      name,
      path: node.path,
      type: node.type === "tree" ? "folder" : "file",
      sha: node.sha,
      children: node.type === "tree" ? [] : undefined,
    }

    map.set(node.path, treeNode)

    if (parts.length === 1) {
      // 根级别节点
      root.push(treeNode)
    } else {
      // 子节点，找到父节点
      const parentPath = "llmdoc/" + parts.slice(0, -1).join("/")
      const parent = map.get(parentPath)
      if (parent && parent.children) {
        parent.children.push(treeNode)
      }
    }
  }

  // Helper to sort nodes recursively
  const sortNodes = (nodes: TreeNode[]): TreeNode[] => {
    return nodes.sort((a, b) => {
      if (a.name.toLowerCase() === "index.md") return -1
      if (b.name.toLowerCase() === "index.md") return 1
      
      // Folders first? Let's keep files and folders mixed or folders first.
      // Standard: Folders first, then files.
      if (a.type !== b.type) {
          return a.type === "folder" ? -1 : 1
      }
      
      return a.name.localeCompare(b.name)
    }).map(node => {
      if (node.children) {
        node.children = sortNodes(node.children)
      }
      return node
    })
  }

  return sortNodes(root)
}

export async function fetchFileContent(
  owner: string,
  repo: string,
  sha: string,
  options?: FetchOptions
): Promise<string> {
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/git/blobs/${sha}`,
    { headers: getHeaders(options) }
  )

  if (!response.ok) {
    throw new Error(`Failed to fetch file: ${response.status}`)
  }

  const data = await response.json()

  // GitHub API 返回 base64 编码的内容，需要正确处理 UTF-8
  const binaryString = atob(data.content)
  const bytes = new Uint8Array(binaryString.length)
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }
  const content = new TextDecoder("utf-8").decode(bytes)
  return content
}
