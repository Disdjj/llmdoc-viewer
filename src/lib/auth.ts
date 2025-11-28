import type { GitHubUser, AuthState } from "@/types"

const TOKEN_KEY = "github_token"
const USER_KEY = "github_user"

const CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID || ""

export function getAuthState(): AuthState {
  const token = localStorage.getItem(TOKEN_KEY)
  const userStr = localStorage.getItem(USER_KEY)
  const user = userStr ? JSON.parse(userStr) as GitHubUser : undefined

  return {
    isAuthenticated: !!token,
    token: token || undefined,
    user,
  }
}

export function setAuthState(token: string, user: GitHubUser) {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function clearAuthState() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export function getLoginUrl(redirectPath?: string): string {
  const redirectUri = `${window.location.origin}/callback`
  const state = redirectPath || window.location.pathname

  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: redirectUri,
    scope: "public_repo",
    state,
  })

  return `https://github.com/login/oauth/authorize?${params}`
}

export async function exchangeCodeForToken(code: string): Promise<string> {
  const response = await fetch("/api/auth", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Token exchange failed")
  }

  const data = await response.json()
  return data.token
}

export async function fetchCurrentUser(token: string): Promise<GitHubUser> {
  const response = await fetch("https://api.github.com/user", {
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!response.ok) {
    throw new Error("Failed to fetch user")
  }

  return response.json()
}
