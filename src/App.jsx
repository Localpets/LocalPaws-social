/* eslint-disable react-refresh/only-export-components */
import { Outlet, RootRoute, Route } from '@tanstack/router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SocketProvider } from './socket/socket'
import Layout from './containers/Layout'
import Logout from './components/Misc/Logout'
import Feed from './containers/Feed/Feed'
import Auth from './containers/Auth/Auth.jsx'
import Chat from './containers/Chat/Chat.jsx'
import Profile from './containers/Profile/Profile.jsx'
import MapApp from './components/Map/MapApp'
import Search from './components/Search/search'
import Notificaciones from './components/Notificaciones/Notificacion'
import PostPage from './components/Post/PostPage'
import './App.css'

// Create a root route
const rootRoute = new RootRoute({
  component: App
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

// Create an Auth route
const loginRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Auth
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

const searchRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/search',
  component: Search
})

// Create the route tree using your routes
// eslint-disable-next-line react-refresh/only-export-components
export const routeTree = rootRoute.addChildren([loginRoute, openProfile, feedRoute, chatRoute, mapRoute, postReview, logoutView, searchRoute, notiRoute])

// Crear un cliente de consultas para el proveedor de consultas (fetching)
const queryClient = new QueryClient()

function App () {
  return (
    <QueryClientProvider client={queryClient}>
      <SocketProvider>
        <Layout>
          <Outlet />
        </Layout>
      </SocketProvider>
    </QueryClientProvider>
  )
}

export default App
