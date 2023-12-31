/* eslint-disable react-refresh/only-export-components */
import { Outlet, RootRoute, Route } from '@tanstack/router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Layout from './containers/Layout'
import Logout from './components/Misc/Logout'
import Feed from './containers/Feed/Feed'
import Register from './containers/Auth/Register.jsx'
import Login from './containers/Auth/Login.jsx'
import Chat from './containers/Chat/Chat.jsx'
import Profile from './containers/Profile/Profile.jsx'
import MapApp from './components/Map/MapApp'
import Notificaciones from './components/Notificaciones/Notificacion.jsx'
import PostPage from './components/Post/PostPage'
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

// Create a noti route
 const notiRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/notificaciones',
  component: Notificaciones
 })

const chatRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/chat',
  component: Chat
})

// Create a profile route
const openProfile = new Route({
  getParentRoute: () => rootRoute,
  path: '/profile/$user_id',
  component: Profile
})

// Create a login route
const loginRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Login
})

// Create a feed route
const feedRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/home',
  component: Feed
})

// Create a map route
const mapRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/map',
  component: MapApp
})

const postReview = new Route({
  getParentRoute: () => rootRoute,
  path: '/post/$post_id',
  component: PostPage
})

const logoutView = new Route({
  getParentRoute: () => rootRoute,
  path: '/logout',
  component: Logout
})

// Create the route tree using your routes
// eslint-disable-next-line react-refresh/only-export-components
export const routeTree = rootRoute.addChildren([registerRoute, loginRoute, notiRoute, openProfile, feedRoute, chatRoute, mapRoute, postReview, logoutView])

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
