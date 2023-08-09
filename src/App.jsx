import { Outlet, RootRoute, Route } from '@tanstack/router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Layout from './containers/Layout'
import Feed from './containers/Feed/Feed'
import Register from './containers/Auth/Register.jsx'
import Login from './containers/Auth/Login.jsx'
import Profile from './containers/Profile/Profile.jsx'
import './App.css'
// Create a root route
const rootRoute = new RootRoute({
  component: App
})

// Create a register route
const registerRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/register',
  component: Register
})

// Create a profile route
const openProfile = new Route({
  getParentRoute: () => rootRoute,
  path: '/profile',
  component: Profile
})

// Create a login route
const loginRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: Login
})

const feedRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Feed
})
// Create the route tree using your routes
// eslint-disable-next-line react-refresh/only-export-components
export const routeTree = rootRoute.addChildren([registerRoute, loginRoute, openProfile, feedRoute])

// Crear un cliente de consultas para el proveedor de consultas (fetching)
const queryClient = new QueryClient()

function App () {
  return (
    <QueryClientProvider client={queryClient}>
      <Layout>
        <Outlet />
      </Layout>
    </QueryClientProvider>
  )
}

export default App
