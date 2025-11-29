import { Github, LogOut, FileText } from "lucide-react"
import { Button } from "./ui/button"
import type { GitHubUser } from "@/types"

interface HeaderProps {
  owner?: string
  repo?: string
  user?: GitHubUser
  onLogin: () => void
  onLogout: () => void
}

export function Header({ owner, repo, user, onLogin, onLogout }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <a href="/" className="flex items-center space-x-2 transition-opacity hover:opacity-80">
            <div className="rounded-md bg-primary/10 p-1">
                <FileText className="h-6 w-6 text-primary" />
            </div>
            <span className="font-bold text-lg tracking-tight hidden sm:inline-block">LLMDoc Viewer</span>
          </a>

          {owner && repo && (
            <div className="hidden md:flex items-center text-sm font-medium">
              <a
                href={`https://github.com/${owner}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {owner}
              </a>
              <span className="mx-2 text-muted-foreground/50">/</span>
              <a
                href={`https://github.com/${owner}/${repo}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground hover:text-primary transition-colors"
              >
                {repo}
              </a>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
            {owner && repo && (
                <a
                    href={`https://github.com/${owner}/${repo}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="md:hidden text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                    View on GitHub
                </a>
            )}
            
          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 pr-2 border-r border-border/50">
                <img
                  src={user.avatar_url}
                  alt={user.login}
                  className="w-8 h-8 rounded-full ring-2 ring-background"
                />
                <span className="text-sm font-medium hidden sm:inline-block">{user.login}</span>
              </div>
              <Button variant="ghost" size="icon" onClick={onLogout} title="Sign out" className="text-muted-foreground hover:text-destructive">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button variant="default" size="sm" onClick={onLogin} className="font-medium">
              <Github className="mr-2 h-4 w-4" />
              Sign in with GitHub
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}