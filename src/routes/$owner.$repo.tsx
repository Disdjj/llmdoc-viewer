import { useState } from "react"
import { createRoute } from "@tanstack/react-router"
import { Loader2, FileText, FolderOpen, ChevronLeft, ExternalLink, Copy, Check } from "lucide-react"
import { useAuth } from "../hooks/useAuth"
import { useRepo } from "../hooks/useRepo"
import { EmptyState } from "../components/EmptyState"
import { FileTree } from "../components/FileTree"
import { MarkdownView } from "../components/MarkdownView"
import { ScrollArea } from "../components/ui/scroll-area"
import { Skeleton } from "../components/ui/skeleton"
import { Button } from "../components/ui/button"
import { Route as RootRoute } from "./__root"

export const Route = createRoute({
  getParentRoute: () => RootRoute,
  path: "/$owner/$repo",
  component: RepoViewer,
})

function RepoViewer() {
  const { owner, repo } = Route.useParams()
  const { token, login } = useAuth()
  const {
    isLoading,
    error,
    hasContent,
    tabs,
    tree,
    selectedFile,
    fileContent,
    isLoadingFile,
    selectFile,
  } = useRepo({ owner, repo, token })

  const [activeTab, setActiveTab] = useState<"claude" | "agents" | "docs">("claude")
  const [copied, setCopied] = useState(false)

  // 处理标签切换
  const handleTabChange = (tab: "claude" | "agents" | "docs") => {
    setActiveTab(tab)
    if (tab === "claude" && tabs.claudeMd) {
      selectFile(tabs.claudeMd.path, tabs.claudeMd.sha)
    } else if (tab === "agents" && tabs.agentsMd) {
      selectFile(tabs.agentsMd.path, tabs.agentsMd.sha)
    }
  }

  // 复制链接
  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (isLoading) {
    return <LoadingSkeleton />
  }

  if (error === "REPO_NOT_FOUND") {
    return <EmptyState type="not-found" owner={owner} repo={repo} />
  }

  if (error === "RATE_LIMIT") {
    return <EmptyState type="rate-limit" onLogin={() => login(`/${owner}/${repo}`)} />
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <p className="text-destructive text-lg">加载失败</p>
          <p className="text-muted-foreground mt-2">{error}</p>
        </div>
      </div>
    )
  }

  if (!hasContent) {
    return <EmptyState type="no-docs" />
  }

  // 确定默认标签
  const defaultTab = tabs.claudeMd ? "claude" : tabs.agentsMd ? "agents" : "docs"
  const currentTab = activeTab || defaultTab

  // 获取当前文件名
  const currentFileName = selectedFile?.split("/").pop() || ""

  return (
    <div className="h-[calc(100vh-5rem)]">
      {/* 顶部工具栏 */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b">
        <div className="flex items-center gap-4">
          <a href="/" className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft className="h-4 w-4" />
            <span className="text-sm">返回</span>
          </a>
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">{owner}</span>
            <span className="text-muted-foreground">/</span>
            <span className="font-semibold">{repo}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={copyLink}>
            {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
            {copied ? "已复制" : "复制链接"}
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <a href={`https://github.com/${owner}/${repo}`} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-1" />
              GitHub
            </a>
          </Button>
        </div>
      </div>

      <div className="flex gap-6 h-[calc(100%-4rem)]">
        {/* 侧边栏 */}
        <aside className="w-72 shrink-0 flex flex-col bg-card rounded-xl border shadow-sm overflow-hidden">
          {/* 标签切换 */}
          <div className="p-2 border-b bg-muted/30">
            <div className="flex gap-1">
              {tabs.claudeMd && (
                <TabButton
                  active={currentTab === "claude"}
                  onClick={() => handleTabChange("claude")}
                  icon={<FileText className="h-4 w-4" />}
                  label="claude.md"
                />
              )}
              {tabs.agentsMd && (
                <TabButton
                  active={currentTab === "agents"}
                  onClick={() => handleTabChange("agents")}
                  icon={<FileText className="h-4 w-4" />}
                  label="agents.md"
                />
              )}
              {tree.length > 0 && (
                <TabButton
                  active={currentTab === "docs"}
                  onClick={() => handleTabChange("docs")}
                  icon={<FolderOpen className="h-4 w-4" />}
                  label="llmdoc/"
                />
              )}
            </div>
          </div>

          {/* 文件树 */}
          {currentTab === "docs" && tree.length > 0 && (
            <ScrollArea className="flex-1">
              <div className="p-3">
                <FileTree
                  nodes={tree}
                  selectedPath={selectedFile}
                  onSelect={selectFile}
                />
              </div>
            </ScrollArea>
          )}

          {/* claude.md / agents.md 不需要文件树 */}
          {(currentTab === "claude" || currentTab === "agents") && (
            <div className="flex-1 flex items-center justify-center p-6">
              <div className="text-center text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-3 opacity-20" />
                <p className="text-sm">
                  {currentTab === "claude" ? "claude.md" : "agents.md"}
                </p>
              </div>
            </div>
          )}
        </aside>

        {/* 主内容区 */}
        <main className="flex-1 min-w-0 flex flex-col bg-card rounded-xl border shadow-sm overflow-hidden">
          {/* 文件名标题栏 */}
          <div className="px-6 py-3 border-b bg-muted/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{currentFileName || "选择文件"}</span>
            </div>
            {selectedFile && (
              <span className="text-xs text-muted-foreground">
                {selectedFile}
              </span>
            )}
          </div>

          {/* 内容区域 */}
          <ScrollArea className="flex-1">
            <div className="p-8 max-w-4xl mx-auto">
              {isLoadingFile ? (
                <ContentSkeleton />
              ) : fileContent ? (
                <MarkdownView content={fileContent} isLoading={false} />
              ) : (
                <div className="flex items-center justify-center h-64 text-muted-foreground">
                  <div className="text-center">
                    <FolderOpen className="h-16 w-16 mx-auto mb-4 opacity-20" />
                    <p>请在左侧选择一个文件</p>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </main>
      </div>
    </div>
  )
}

function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  label: string
}) {
  return (
    <button
      onClick={onClick}
      className={`
        flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all
        ${active
          ? "bg-background text-foreground shadow-sm"
          : "text-muted-foreground hover:text-foreground hover:bg-background/50"
        }
      `}
    >
      {icon}
      <span className="truncate">{label}</span>
    </button>
  )
}

function LoadingSkeleton() {
  return (
    <div className="h-[calc(100vh-5rem)]">
      <div className="flex items-center justify-between mb-4 pb-4 border-b">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-8 w-24" />
      </div>
      <div className="flex gap-6 h-[calc(100%-4rem)]">
        <aside className="w-72 shrink-0 bg-card rounded-xl border p-4">
          <Skeleton className="h-10 w-full mb-4" />
          <div className="space-y-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-6 w-full" />
            ))}
          </div>
        </aside>
        <main className="flex-1 bg-card rounded-xl border overflow-hidden">
          <div className="px-6 py-3 border-b">
            <Skeleton className="h-6 w-32" />
          </div>
          <div className="p-8 flex items-center justify-center">
            <div className="flex items-center gap-3">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <span className="text-muted-foreground">加载中...</span>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

function ContentSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <Skeleton className="h-10 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <div className="h-4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-4/5" />
      <Skeleton className="h-32 w-full rounded-lg" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  )
}
