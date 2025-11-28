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
    <div className="min-h-screen flex flex-col">
      <Header
        owner={owner}
        repo={repo}
        user={user}
        onLogin={onLogin}
        onLogout={onLogout}
      />
      <main className="flex-1 container py-6">
        {children}
      </main>
    </div>
  )
}
