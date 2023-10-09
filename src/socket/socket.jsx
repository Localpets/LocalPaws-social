/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import PropTypes from 'prop-types'
import jwtDecode from 'jwt-decode'

const SocketContext = createContext()

export function useSocket () {
  return useContext(SocketContext)
}

export function SocketProvider ({ children }) {
  const [socket, setSocket] = useState(null)
  const [isSocketConfigured, setIsSocketConfigured] = useState(false)

  useEffect(() => {
    const getTokenFromLocalStorage = () => {
      try {
        const tokenData = JSON.parse(localStorage.getItem('user'))
        if (tokenData && tokenData.userId) {
          return tokenData.userId
        }
      } catch (error) {
        console.error('Error al verificar el token en localStorage:', error)
      }
      return null
    }

    const token = getTokenFromLocalStorage()

    if (token) {
      const decodedToken = jwtDecode(token)

      const newSocket = io('http://localhost:8080', {
        query: { userId: decodedToken.id }
      })

      // Emitir el evento 'PersonalRoom' después de la conexión del socket
      newSocket.on('connect', () => {
        newSocket.emit('PersonalRoom', decodedToken.id)
      })

      setSocket(newSocket)
      setIsSocketConfigured(true)

      return () => {
        newSocket.disconnect()
      }
    } else {
      setIsSocketConfigured(true)
    }
  }, [])

  if (!isSocketConfigured) {
    return (
      <SocketContext.Provider value={null}>
        {children}
      </SocketContext.Provider>
    )
  }

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  )
}

SocketProvider.propTypes = {
  children: PropTypes.node.isRequired
}
