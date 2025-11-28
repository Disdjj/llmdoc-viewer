import { useEffect, useState } from "react"
import { createRoute, useNavigate } from "@tanstack/react-router"
import { Loader2 } from "lucide-react"
import { useAuth } from "../hooks/useAuth"
import { Route as RootRoute } from "./__root"

export const Route = createRoute({
  getParentRoute: () => RootRoute,
  path: "/callback",
  component: CallbackPage,
  validateSearch: (search: Record<string, unknown>) => ({
    code: search.code as string | undefined,
    state: search.state as string | undefined,
  }),
})

function CallbackPage() {
  const { code, state } = Route.useSearch()
  const { handleCallback } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState<string>()

  useEffect(() => {
    if (!code) {
      setError("未收到授权码")
      return
    }

    handleCallback(code).then((success) => {
      if (success) {
        const redirectPath = state && state !== "/callback" ? state : "/"
        navigate({ to: redirectPath })
      } else {
        setError("登录失败，请重试")
      }
    })
  }, [code, state, handleCallback, navigate])

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-destructive mb-4">{error}</p>
        <a href="/" className="text-primary hover:underline">
          返回首页
        </a>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <Loader2 className="h-8 w-8 animate-spin mb-4" />
      <p className="text-muted-foreground">正在完成登录...</p>
    </div>
  )
}
