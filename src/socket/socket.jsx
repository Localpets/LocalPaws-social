/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import PropTypes from 'prop-types'

const SocketContext = createContext()

export function useSocket () {
  return useContext(SocketContext)
}

export function SocketProvider ({ children }) {
  const [socket, setSocket] = useState(null)
  const [localUser, setLocalUser] = useState(null)

  useEffect(() => {
    const userFromLocalStorage = JSON.parse(localStorage.getItem('user'))
    if (userFromLocalStorage) {
      setLocalUser(userFromLocalStorage.userId)
    }
  }, [])

  useEffect(() => {
    if (localUser) {
      // Configura el socket solo si localUser tiene un valor definido
      const newSocket = io('http://localhost:8080', {
        query: { userId: localUser }
      })
      setSocket(newSocket)
      return () => {
        newSocket.disconnect()
      }
    }
  }, [localUser])

  // Renderiza el componente solo si localUser tiene un valor definido
  return localUser
    ? (
      <SocketContext.Provider value={socket}>
        {children}
      </SocketContext.Provider>
      )
    : null
}

SocketProvider.propTypes = {
  children: PropTypes.node.isRequired
}
