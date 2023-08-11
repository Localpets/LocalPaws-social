import ReactDOM from 'react-dom/client'
import {
  RouterProvider,
  Router
} from '@tanstack/router'
import { routeTree } from './App'

// Create the router using your route tree
const router = new Router({ routeTree })

// Render our app!
const rootElement = document.getElementById('root')

const root = ReactDOM.createRoot(rootElement)
root.render(
  <RouterProvider router={router} />
)
