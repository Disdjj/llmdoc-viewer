import { createRootRoute, Outlet } from "@tanstack/react-router"
import { Layout } from "../components/Layout"
import { useAuth } from "../hooks/useAuth"

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  const { user, login, logout } = useAuth()

  return (
    <Layout user={user} onLogin={() => login()} onLogout={logout}>
      <Outlet />
    </Layout>
  )
}
