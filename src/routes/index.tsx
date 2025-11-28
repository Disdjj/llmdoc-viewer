import { useState } from "react"
import { createRoute, useNavigate } from "@tanstack/react-router"
import { Search, Github, FileText, ArrowRight, Sparkles, BookOpen, Zap } from "lucide-react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Route as RootRoute } from "./__root"

export const Route = createRoute({
  getParentRoute: () => RootRoute,
  path: "/",
  component: HomePage,
})

const EXAMPLE_REPOS = [
  { owner: "anthropics", repo: "claude-code", label: "Claude Code" },
  { owner: "langchain-ai", repo: "langchain", label: "LangChain" },
  { owner: "openai", repo: "openai-python", label: "OpenAI Python" },
]

function HomePage() {
  const [repoUrl, setRepoUrl] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    let owner: string | undefined
    let repo: string | undefined

    const input = repoUrl.trim()

    const urlMatch = input.match(/github\.com\/([^/]+)\/([^/]+)/)
    if (urlMatch) {
      owner = urlMatch[1]
      repo = urlMatch[2].replace(/\.git$/, "")
    } else {
      const parts = input.split("/")
      if (parts.length === 2 && parts[0] && parts[1]) {
        owner = parts[0]
        repo = parts[1]
      }
    }

    if (!owner || !repo) {
      setError("请输入有效的 GitHub 仓库地址，如 owner/repo 或 https://github.com/owner/repo")
      return
    }

    navigate({ to: "/$owner/$repo", params: { owner, repo } })
  }

  const goToRepo = (owner: string, repo: string) => {
    navigate({ to: "/$owner/$repo", params: { owner, repo } })
  }

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto text-center px-4">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
            <Sparkles className="h-4 w-4" />
            <span>专为 LLM 文档设计的阅读器</span>
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
            <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              LLMDoc Viewer
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
            快速浏览 GitHub 仓库中的 AI/LLM 文档，支持
            <code className="mx-1 px-2 py-0.5 rounded bg-muted font-mono text-base">claude.md</code>
            <code className="mx-1 px-2 py-0.5 rounded bg-muted font-mono text-base">llmdoc/</code>
            等格式
          </p>

          {/* Search Form */}
          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto mb-8">
            <div className="flex gap-3 p-2 rounded-2xl bg-card border shadow-lg">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="输入仓库地址，如 anthropics/claude-code"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  className="pl-12 h-14 text-lg border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>
              <Button type="submit" size="lg" className="h-14 px-8 rounded-xl">
                查看文档
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            {error && (
              <p className="text-destructive text-sm mt-3">{error}</p>
            )}
          </form>

          {/* Quick Links */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
            <span className="text-muted-foreground">试试看：</span>
            {EXAMPLE_REPOS.map((item) => (
              <button
                key={`${item.owner}/${item.repo}`}
                onClick={() => goToRepo(item.owner, item.repo)}
                className="px-3 py-1.5 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 border-t">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">为什么选择 LLMDoc Viewer?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              专注于 AI/LLM 项目文档，提供最佳阅读体验
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<FileText className="h-6 w-6" />}
              title="智能识别"
              description="自动识别 claude.md、agents.md、llmdoc/ 等 LLM 专属文档格式"
              gradient="from-blue-500/10 to-cyan-500/10"
            />
            <FeatureCard
              icon={<Zap className="h-6 w-6" />}
              title="极速加载"
              description="一次性获取完整文件树，在文件间切换无需等待"
              gradient="from-amber-500/10 to-orange-500/10"
            />
            <FeatureCard
              icon={<BookOpen className="h-6 w-6" />}
              title="优雅阅读"
              description="支持 GFM 语法、代码高亮、表格等，阅读体验极佳"
              gradient="from-violet-500/10 to-purple-500/10"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 border-t">
        <div className="max-w-3xl mx-auto text-center px-4">
          <div className="p-8 rounded-2xl bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 border">
            <Github className="h-12 w-12 mx-auto mb-4 text-primary" />
            <h3 className="text-2xl font-bold mb-2">登录 GitHub 获取更多</h3>
            <p className="text-muted-foreground mb-6">
              未登录用户每小时 60 次请求限制，登录后提升至 5000 次
            </p>
            <Button variant="outline" size="lg">
              <Github className="mr-2 h-5 w-5" />
              使用 GitHub 登录
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
  gradient,
}: {
  icon: React.ReactNode
  title: string
  description: string
  gradient: string
}) {
  return (
    <div className="group relative p-8 rounded-2xl border bg-card hover:shadow-lg transition-all duration-300">
      {/* Background gradient on hover */}
      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

      <div className="relative">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-4">
          {icon}
        </div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  )
}
