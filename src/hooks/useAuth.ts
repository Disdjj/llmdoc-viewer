import { useState, useEffect, useCallback } from "react"
import type { AuthState } from "@/types"
import {
  getAuthState,
  setAuthState,
  clearAuthState,
  getLoginUrl,
  exchangeCodeForToken,
  fetchCurrentUser,
} from "@/lib/auth"

export function useAuth() {
  const [authState, setAuthStateLocal] = useState<AuthState>(getAuthState)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // 监听 storage 变化（多标签页同步）
    const handleStorageChange = () => {
      setAuthStateLocal(getAuthState())
    }
    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  const login = useCallback((redirectPath?: string) => {
    window.location.href = getLoginUrl(redirectPath)
  }, [])

  const logout = useCallback(() => {
    clearAuthState()
    setAuthStateLocal({ isAuthenticated: false })
  }, [])

  const handleCallback = useCallback(async (code: string) => {
    setIsLoading(true)
    try {
      const token = await exchangeCodeForToken(code)
      const user = await fetchCurrentUser(token)
      setAuthState(token, user)
      setAuthStateLocal({ isAuthenticated: true, token, user })
      return true
    } catch (error) {
      console.error("Auth callback failed:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    ...authState,
    isLoading,
    login,
    logout,
    handleCallback,
  }
}
