import type { ReactNode } from "react"
import { Header } from "./Header"
import type { GitHubUser } from "@/types"

interface LayoutProps {
  children: ReactNode
  owner?: string
  repo?: string
  user?: GitHubUser
  onLogin: () => void
  onLogout: () => void
}

export function Layout({ children, owner, repo, user, onLogin, onLogout }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col relative bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      {/* Background Pattern */}
      <div className="fixed inset-0 -z-10 h-full w-full bg-background bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)]"></div>
      
      <Header
        owner={owner}
        repo={repo}
        user={user}
        onLogin={onLogin}
        onLogout={onLogout}
      />
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12 animate-fade-in">
        {children}
      </main>
      
      <footer className="py-6 text-center text-sm text-muted-foreground border-t border-border/40 bg-background/50 backdrop-blur-sm">
        <p>© {new Date().getFullYear()} LLMDoc Viewer. Built for elegance.</p>
      </footer>
    </div>
  )
}