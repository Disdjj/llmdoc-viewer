import { FileQuestion, Lock } from "lucide-react"
import { Button } from "./ui/button"

interface EmptyStateProps {
  type: "no-docs" | "not-found" | "rate-limit"
  owner?: string
  repo?: string
  onLogin?: () => void
}

export function EmptyState({ type, owner, repo, onLogin }: EmptyStateProps) {
  if (type === "not-found") {
    return (
      <div className="flex flex-col items-center justify-center h-full py-16 text-center">
        <FileQuestion className="w-16 h-16 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">仓库不存在</h2>
        <p className="text-muted-foreground max-w-md">
          无法找到仓库 <code className="bg-muted px-1 rounded">{owner}/{repo}</code>
          <br />
          请检查仓库名称是否正确，或者该仓库是否为私有仓库。
        </p>
      </div>
    )
  }

  if (type === "rate-limit") {
    return (
      <div className="flex flex-col items-center justify-center h-full py-16 text-center">
        <Lock className="w-16 h-16 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">API 请求限制</h2>
        <p className="text-muted-foreground max-w-md mb-4">
          未登录用户每小时只能发起 60 次请求。
          <br />
          登录 GitHub 可获得每小时 5000 次的请求配额。
        </p>
        {onLogin && (
          <Button onClick={onLogin}>
            登录 GitHub
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center h-full py-16 text-center">
      <FileQuestion className="w-16 h-16 text-muted-foreground mb-4" />
      <h2 className="text-xl font-semibold mb-2">未找到 LLM 文档</h2>
      <p className="text-muted-foreground max-w-md">
        该仓库不包含 <code className="bg-muted px-1 rounded">llmdoc/</code> 目录、
        <code className="bg-muted px-1 rounded">claude.md</code> 或
        <code className="bg-muted px-1 rounded">agents.md</code> 文件。
      </p>
    </div>
  )
}
