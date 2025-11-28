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
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <a href="/" className="flex items-center space-x-2 mr-6">
          <FileText className="h-6 w-6" />
          <span className="font-bold hidden sm:inline-block">LLMDoc Viewer</span>
        </a>

        {owner && repo && (
          <div className="flex items-center text-sm text-muted-foreground">
            <a
              href={`https://github.com/${owner}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              {owner}
            </a>
            <span className="mx-1">/</span>
            <a
              href={`https://github.com/${owner}/${repo}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors font-medium"
            >
              {repo}
            </a>
          </div>
        )}

        <div className="flex-1" />

        {user ? (
          <div className="flex items-center gap-3">
            <img
              src={user.avatar_url}
              alt={user.login}
              className="w-8 h-8 rounded-full"
            />
            <span className="text-sm hidden sm:inline-block">{user.login}</span>
            <Button variant="ghost" size="icon" onClick={onLogout} title="登出">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Button variant="outline" size="sm" onClick={onLogin}>
            <Github className="mr-2 h-4 w-4" />
            登录 GitHub
          </Button>
        )}
      </div>
    </header>
  )
}
