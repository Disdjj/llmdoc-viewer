import { useState } from "react"
import { createRoute, useNavigate } from "@tanstack/react-router"
import { ArrowRight, Search, BookOpen, Code, Zap } from "lucide-react"
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
      setError("Please enter a valid GitHub repository (e.g., owner/repo)")
      return
    }

    navigate({ to: "/$owner/$repo", params: { owner, repo } })
  }

  const quickLinks = [
    { name: "anthropics/claude-code", desc: "Official Claude Code examples" },
    { name: "facebook/react", desc: "The library for web and native user interfaces" },
    { name: "shadcn-ui/ui", desc: "Beautifully designed components" },
  ]

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-14rem)]">
      {/* Hero Section */}
      <div className="w-full max-w-3xl space-y-8 text-center animate-slide-up">
        <div className="space-y-4">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary mb-4">
            <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
            v2.0 Now Available
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground">
            Documentation, <span className="text-primary bg-clip-text">Reimagined</span>.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Instantly turn any GitHub repository into a beautiful, readable documentation site.
            Optimized for LLMs and humans alike.
          </p>
        </div>

        {/* Search Form */}
        <div className="w-full max-w-xl mx-auto">
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

        {/* Quick Links / Features */}
        <div className="pt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl border bg-card/50 backdrop-blur-sm hover:bg-card hover:shadow-md transition-all duration-300">
                <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4 text-blue-500">
                    <BookOpen className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Instant Readability</h3>
                <p className="text-sm text-muted-foreground">Transform raw Markdown into a polished reading experience instantly.</p>
            </div>

            {/* Feature 2 */}
             <div className="p-6 rounded-2xl border bg-card/50 backdrop-blur-sm hover:bg-card hover:shadow-md transition-all duration-300">
                <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4 text-purple-500">
                    <Code className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Syntax Highlighting</h3>
                <p className="text-sm text-muted-foreground">Beautiful syntax highlighting for over 100+ languages out of the box.</p>
            </div>

            {/* Feature 3 */}
             <div className="p-6 rounded-2xl border bg-card/50 backdrop-blur-sm hover:bg-card hover:shadow-md transition-all duration-300">
                <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center mb-4 text-amber-500">
                    <Zap className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Lightning Fast</h3>
                <p className="text-sm text-muted-foreground">Powered by Vite and Cloudflare for edge-speed performance.</p>
            </div>
        </div>
        
        <div className="pt-8">
            <p className="text-sm text-muted-foreground mb-4">Popular Repositories:</p>
            <div className="flex flex-wrap justify-center gap-2">
                {quickLinks.map((link) => (
                    <button
                        key={link.name}
                        onClick={() => setRepoUrl(link.name)}
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