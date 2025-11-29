import { useState } from "react"
import { createRoute, useNavigate } from "@tanstack/react-router"
import { ArrowRight, Search } from "lucide-react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Route as RootRoute } from "./__root"

export const Route = createRoute({
  getParentRoute: () => RootRoute,
  path: "/",
  component: HomePage,
})

function HomePage() {
  const [repoUrl, setRepoUrl] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const parseAndNavigate = (input: string) => {
    let owner: string | undefined
    let repo: string | undefined

    const trimmed = input.trim()
    const urlMatch = trimmed.match(/github\.com\/([^/]+)\/([^/]+)/)
    if (urlMatch) {
      owner = urlMatch[1]
      repo = urlMatch[2].replace(/\.git$/, "")
    } else {
      const parts = trimmed.split("/")
      if (parts.length === 2 && parts[0] && parts[1]) {
        owner = parts[0]
        repo = parts[1]
      }
    }

    if (!owner || !repo) {
      setError("Please enter a valid GitHub repository (e.g., owner/repo)")
      return
    }

    navigate({ to: "/$owner/$repo/$", params: { owner, repo, _splat: "" } })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    parseAndNavigate(repoUrl)
  }

  const handleExampleClick = (repoPath: string) => {
    setRepoUrl(repoPath)
    setError("")
    parseAndNavigate(repoPath)
  }

  const quickLinks = [
    { name: "TokenRollAI/minicc", desc: "Mini Claude Code" },
    { name: "pydantic/pydantic-ai", desc: "Agent Framework / shim to use Pydantic with LLMs" },
    { name: "langchain-ai/langchain", desc: "Build context-aware reasoning applications" },
  ]

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-14rem)]">
      <div className="w-full max-w-xl mx-auto space-y-8 text-center animate-slide-up">
        
        {/* Search Form */}
        <div className="w-full">
          <form onSubmit={handleSubmit} className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative flex items-center p-2 bg-card rounded-xl border shadow-lg ring-1 ring-black/5 dark:ring-white/10">
              <Search className="ml-3 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Enter GitHub repo (e.g., owner/repo)"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                className="border-0 shadow-none focus-visible:ring-0 bg-transparent h-12 text-base w-full placeholder:text-muted-foreground/50"
              />
              <Button type="submit" size="lg" className="h-11 px-6 rounded-lg shadow-md transition-transform active:scale-95">
                Go
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </form>
          {error && (
            <p className="mt-3 text-destructive text-sm font-medium animate-shake">{error}</p>
          )}
        </div>

        {/* Quick Links */}
        <div>
            <p className="text-sm text-muted-foreground mb-4">Try these examples:</p>
            <div className="flex flex-wrap justify-center gap-2">
                {quickLinks.map((link) => (
                    <button
                        key={link.name}
                        onClick={() => handleExampleClick(link.name)}
                        className="px-3 py-1.5 rounded-full text-xs font-medium border bg-secondary/50 hover:bg-secondary hover:text-primary transition-colors"
                        title={link.desc}
                    >
                        {link.name}
                    </button>
                ))}
            </div>
        </div>

      </div>
    </div>
  )
}
