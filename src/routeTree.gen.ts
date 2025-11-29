import { createRouter } from "@tanstack/react-router"

import { Route as RootRoute } from "./routes/__root"
import { Route as IndexRoute } from "./routes/index"
import { Route as CallbackRoute } from "./routes/callback"
import { Route as RepoRoute } from "./routes/$owner.$repo.$"

const routeTree = RootRoute.addChildren([
  IndexRoute,
  CallbackRoute,
  RepoRoute,
])

export const router = createRouter({ routeTree })

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}
