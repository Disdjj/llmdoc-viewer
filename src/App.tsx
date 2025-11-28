import { RouterProvider } from "@tanstack/react-router"
import { router } from "./routeTree.gen"

function App() {
  return <RouterProvider router={router} />
}

export default App
