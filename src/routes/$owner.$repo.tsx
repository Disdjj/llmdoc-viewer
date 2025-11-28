import { createRoute } from "@tanstack/react-router"
import { Loader2 } from "lucide-react"
import { useAuth } from "../hooks/useAuth"
import { useRepo } from "../hooks/useRepo"
import { EmptyState } from "../components/EmptyState"
import { FileTree } from "../components/FileTree"
import { MarkdownView } from "../components/MarkdownView"
import { ScrollArea } from "../components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Skeleton } from "../components/ui/skeleton"
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
      <div className="text-center py-16">
        <p className="text-destructive">加载失败: {error}</p>
      </div>
    )
  }

  if (!hasContent) {
    return <EmptyState type="no-docs" />
  }

  const defaultTab = tabs.claudeMd
    ? "claude"
    : tabs.agentsMd
      ? "agents"
      : "docs"

  return (
    <div className="flex gap-6 h-[calc(100vh-8rem)]">
      {tree.length > 0 && (
        <aside className="w-64 shrink-0 border rounded-lg">
          <div className="p-3 border-b font-medium text-sm">
            llmdoc/
          </div>
          <ScrollArea className="h-[calc(100%-49px)]">
            <div className="p-2">
              <FileTree
                nodes={tree}
                selectedPath={selectedFile}
                onSelect={selectFile}
              />
            </div>
          </ScrollArea>
        </aside>
      )}

      <main className="flex-1 min-w-0">
        <Tabs defaultValue={defaultTab} className="h-full flex flex-col">
          <TabsList>
            {tabs.claudeMd && (
              <TabsTrigger
                value="claude"
                onClick={() => selectFile(tabs.claudeMd!.path, tabs.claudeMd!.sha)}
              >
                claude.md
              </TabsTrigger>
            )}
            {tabs.agentsMd && (
              <TabsTrigger
                value="agents"
                onClick={() => selectFile(tabs.agentsMd!.path, tabs.agentsMd!.sha)}
              >
                agents.md
              </TabsTrigger>
            )}
            {tree.length > 0 && (
              <TabsTrigger value="docs">
                llmdoc/
              </TabsTrigger>
            )}
          </TabsList>

          {tabs.claudeMd && (
            <TabsContent value="claude" className="flex-1 mt-0">
              <ScrollArea className="h-full border rounded-lg">
                <div className="p-6">
                  <MarkdownView
                    content={
                      selectedFile === tabs.claudeMd.path
                        ? fileContent || ""
                        : ""
                    }
                    isLoading={isLoadingFile && selectedFile === tabs.claudeMd.path}
                  />
                </div>
              </ScrollArea>
            </TabsContent>
          )}

          {tabs.agentsMd && (
            <TabsContent value="agents" className="flex-1 mt-0">
              <ScrollArea className="h-full border rounded-lg">
                <div className="p-6">
                  <MarkdownView
                    content={
                      selectedFile === tabs.agentsMd.path
                        ? fileContent || ""
                        : ""
                    }
                    isLoading={isLoadingFile && selectedFile === tabs.agentsMd.path}
                  />
                </div>
              </ScrollArea>
            </TabsContent>
          )}

          {tree.length > 0 && (
            <TabsContent value="docs" className="flex-1 mt-0">
              <ScrollArea className="h-full border rounded-lg">
                <div className="p-6">
                  {selectedFile?.startsWith("llmdoc/") ? (
                    <MarkdownView
                      content={fileContent || ""}
                      isLoading={isLoadingFile}
                    />
                  ) : (
                    <p className="text-muted-foreground">
                      请在左侧选择一个文件
                    </p>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
          )}
        </Tabs>
      </main>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="flex gap-6 h-[calc(100vh-8rem)]">
      <aside className="w-64 shrink-0 border rounded-lg p-4">
        <Skeleton className="h-6 w-20 mb-4" />
        <div className="space-y-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-5 w-full" />
          ))}
        </div>
      </aside>

      <main className="flex-1">
        <div className="flex items-center gap-2 mb-4">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-muted-foreground">加载中...</span>
        </div>
        <div className="border rounded-lg p-6">
          <MarkdownView content="" isLoading={true} />
        </div>
      </main>
    </div>
  )
}
