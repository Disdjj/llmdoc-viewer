import { useState, useEffect } from "react"
import { createRoute, useNavigate } from "@tanstack/react-router"
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
import type { GitNode } from "../types"

export const Route = createRoute({
  getParentRoute: () => RootRoute,
  path: "/$owner/$repo/$",
  component: RepoViewer,
})

function RepoViewer() {
  const { owner, repo, _splat } = Route.useParams()
  const navigate = useNavigate({ from: Route.fullPath })
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

  const [activeTab, setActiveTab] = useState<"claude" | "agents" | "docs">("docs") // Default to docs
  const [copied, setCopied] = useState(false)

  // Sync URL with State
  useEffect(() => {
    if (isLoading || !hasContent) return

    // If no splat is provided (root of repo), redirect to default
    if (!_splat) {
      // Priority: llmdoc/index.md -> claude.md -> agents.md -> first doc
      let targetPath = ""
      
      // Check for llmdoc/index.md in tree
      // We need to search recursively or just check known paths if possible
      // Since tree is hierarchical, it's harder to search. 
      // But we have tabs.docsTree which is flat list of GitNodes!
      const indexMd = tabs.docsTree.find(n => n.path.toLowerCase() === "llmdoc/index.md")
      
      if (indexMd) {
        targetPath = indexMd.path
      } else if (tabs.claudeMd) {
        targetPath = tabs.claudeMd.path
      } else if (tabs.agentsMd) {
        targetPath = tabs.agentsMd.path
      } else if (tabs.docsTree.length > 0) {
        targetPath = tabs.docsTree[0].path
      }

      if (targetPath) {
        navigate({ to: `/${owner}/${repo}/${targetPath}`, replace: true })
      }
      return
    }

    // If splat exists, find the file and select it
    // Determine which tab this file belongs to
    let foundNode: GitNode | undefined
    let newTab: "claude" | "agents" | "docs" = "docs"

    if (tabs.claudeMd && tabs.claudeMd.path === _splat) {
      foundNode = tabs.claudeMd
      newTab = "claude"
    } else if (tabs.agentsMd && tabs.agentsMd.path === _splat) {
      foundNode = tabs.agentsMd
      newTab = "agents"
    } else {
      foundNode = tabs.docsTree.find(n => n.path === _splat)
      newTab = "docs"
    }

    if (foundNode) {
      if (selectedFile !== foundNode.path) {
        selectFile(foundNode.path, foundNode.sha)
      }
      if (activeTab !== newTab) {
        setActiveTab(newTab)
      }
    } else {
       // File not found in our tree, maybe 404 or just invalid URL
       // For now, we can just do nothing or show error.
       // But selectFile requires SHA. If we don't have it, we can't load.
    }

  }, [_splat, isLoading, hasContent, tabs, owner, repo, navigate, selectFile, selectedFile, activeTab])


  // Handle user interaction
  const handleTabChange = (tab: "claude" | "agents" | "docs") => {
    // Navigate to the default file for that tab
    let targetPath = ""
    if (tab === "claude" && tabs.claudeMd) {
      targetPath = tabs.claudeMd.path
    } else if (tab === "agents" && tabs.agentsMd) {
      targetPath = tabs.agentsMd.path
    } else if (tab === "docs") {
       // Try to find llmdoc/index.md or first file
       const indexMd = tabs.docsTree.find(n => n.path.toLowerCase() === "llmdoc/index.md")
       if (indexMd) targetPath = indexMd.path
       else if (tabs.docsTree.length > 0) targetPath = tabs.docsTree[0].path
    }

    if (targetPath) {
      navigate({ to: `/${owner}/${repo}/${targetPath}` })
    } else {
      // If empty tab, just set state (visual only)
      setActiveTab(tab)
    }
  }
  
  const onFileSelect = (path: string) => {
      navigate({ to: `/${owner}/${repo}/${path}` })
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
      <div className="flex items-center justify-center h-[60vh] animate-fade-in">
        <div className="text-center p-8 rounded-2xl border bg-card shadow-sm">
          <p className="text-destructive text-lg font-medium mb-2">Failed to load repository</p>
          <p className="text-muted-foreground text-sm max-w-md">{error}</p>
        </div>
      </div>
    )
  }

  if (!hasContent) {
    return <EmptyState type="no-docs" />
  }

  // Get current file name from splat or state
  const currentFileName = selectedFile?.split("/").pop() || _splat?.split("/").pop() || ""

  return (
    <div className="h-full flex flex-col gap-3 animate-fade-in">
      {/* 顶部工具栏 */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-4">
          <a href="/" className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors group">
            <ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back</span>
          </a>
          <div className="h-4 w-px bg-border/60" />
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">{owner}</span>
            <span className="text-muted-foreground">/</span>
            <span className="font-bold text-foreground">{repo}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={copyLink} className="h-8 text-xs">
            {copied ? <Check className="h-3 w-3 mr-1.5" /> : <Copy className="h-3 w-3 mr-1.5" />}
            {copied ? "Copied" : "Copy Link"}
          </Button>
          <Button variant="ghost" size="sm" asChild className="h-8 text-xs">
            <a href={`https://github.com/${owner}/${repo}`} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-3 w-3 mr-1.5" />
              GitHub
            </a>
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 h-full overflow-hidden">
        {/* 侧边栏 */}
        <aside className="w-full md:w-72 shrink-0 flex flex-col bg-card/80 backdrop-blur-sm rounded-xl border shadow-sm overflow-hidden transition-all">
          {/* 标签切换 */}
          <div className="p-2 border-b bg-muted/30">
            <div className="flex gap-1 bg-muted/50 p-1 rounded-lg">
               {/* Reorder tabs: Docs (LLMDoc) first */}
              {tree.length > 0 && (
                <TabButton
                  active={activeTab === "docs"}
                  onClick={() => handleTabChange("docs")}
                  icon={<FolderOpen className="h-3.5 w-3.5" />}
                  label="llmdoc/"
                />
              )}
              {tabs.claudeMd && (
                <TabButton
                  active={activeTab === "claude"}
                  onClick={() => handleTabChange("claude")}
                  icon={<FileText className="h-3.5 w-3.5" />}
                  label="claude.md"
                />
              )}
              {tabs.agentsMd && (
                <TabButton
                  active={activeTab === "agents"}
                  onClick={() => handleTabChange("agents")}
                  icon={<FileText className="h-3.5 w-3.5" />}
                  label="agents.md"
                />
              )}
            </div>
          </div>

          {/* 文件树 */}
          {activeTab === "docs" && tree.length > 0 && (
            <ScrollArea className="flex-1">
              <div className="p-3">
                <FileTree
                  nodes={tree}
                  selectedPath={selectedFile}
                  onSelect={onFileSelect}
                />
              </div>
            </ScrollArea>
          )}

          {/* claude.md / agents.md 不需要文件树 */}
          {(activeTab === "claude" || activeTab === "agents") && (
            <div className="flex-1 flex items-center justify-center p-6">
              <div className="text-center text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-3 opacity-10" />
                <p className="text-xs font-medium uppercase tracking-wider opacity-50">
                  {activeTab === "claude" ? "claude.md" : "agents.md"}
                </p>
              </div>
            </div>
          )}
        </aside>

        {/* 主内容区 */}
        <main className="flex-1 min-w-0 flex flex-col bg-card rounded-xl border shadow-sm overflow-hidden relative">
          {/* 文件名标题栏 */}
          <div className="px-6 py-3 border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center justify-between sticky top-0 z-10">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="p-1.5 rounded-md bg-primary/10 text-primary shrink-0">
                <FileText className="h-4 w-4" />
              </div>
              <span className="font-semibold truncate text-sm">{currentFileName || "Select a file"}</span>
            </div>
            {selectedFile && (
              <span className="text-xs text-muted-foreground font-mono hidden sm:inline-block opacity-60 truncate max-w-[200px]">
                {selectedFile}
              </span>
            )}
          </div>

          {/* 内容区域 */}
          <ScrollArea className="flex-1 bg-background/50">
            <div className="p-6 md:p-10 max-w-5xl mx-auto">
              {isLoadingFile ? (
                <ContentSkeleton />
              ) : fileContent ? (
                <MarkdownView content={fileContent} isLoading={false} />
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground min-h-[300px]">
                  <div className="text-center">
                    <div className="h-16 w-16 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-4">
                        <FolderOpen className="h-8 w-8 opacity-30" />
                    </div>
                    <p className="text-sm">Select a file from the sidebar to view</p>
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
        flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200
        ${active
          ? "bg-background text-foreground shadow-sm ring-1 ring-black/5"
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
    <div className="h-full flex flex-col gap-3">
      <div className="flex items-center justify-between px-1">
        <Skeleton className="h-6 w-32" />
        <div className="flex gap-2">
             <Skeleton className="h-8 w-20" />
             <Skeleton className="h-8 w-20" />
        </div>
      </div>
      <div className="flex gap-4 h-full">
        <aside className="w-72 shrink-0 bg-card rounded-xl border p-4 shadow-sm">
          <Skeleton className="h-8 w-full mb-4 rounded-lg" />
          <div className="space-y-3 mt-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-4 w-4 rounded" />
                  <Skeleton className="h-4 w-3/4" />
              </div>
            ))}
          </div>
        </aside>
        <main className="flex-1 bg-card rounded-xl border shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-3 border-b bg-muted/10">
            <Skeleton className="h-6 w-48" />
          </div>
          <div className="flex-1 p-10 flex items-center justify-center">
             <div className="flex flex-col items-center gap-4">
                 <Loader2 className="h-8 w-8 animate-spin text-primary/50" />
                 <Skeleton className="h-4 w-32" />
             </div>
          </div>
        </main>
      </div>
    </div>
  )
}

function ContentSkeleton() {
  return (
    <div className="space-y-6 animate-pulse max-w-3xl">
      <div className="space-y-2">
        <Skeleton className="h-10 w-3/4 rounded-lg" />
      </div>
      <div className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
      <div className="h-8" />
      <div className="space-y-3">
         <Skeleton className="h-6 w-1/3 rounded-md" />
         <Skeleton className="h-4 w-full" />
         <Skeleton className="h-4 w-4/5" />
      </div>
       <div className="h-4" />
      <Skeleton className="h-48 w-full rounded-xl border bg-muted/20" />
    </div>
  )
}
