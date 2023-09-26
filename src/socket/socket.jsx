/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import PropTypes from 'prop-types'
import useAuthStore from '../context/AuthContext'
import useFindUser from '../hooks/useFindUser'

const SocketContext = createContext()

export function useSocket () {
  return useContext(SocketContext)
}

export function SocketProvider ({ children }) {
  const [socket, setSocket] = useState(null)
  const [localuser, setLocaluser] = useState(null)

  const { loggedUser } = useAuthStore()
  const { user } = useFindUser(loggedUser)

  useEffect(() => {
    if (user) {
      setLocaluser(user)
    }
  }, [user])

  useEffect(() => {
    if (localuser) {
      // Configura el socket solo si localUser tiene un valor definido
      const newSocket = io('http://localhost:8080', {
        query: { userId: localuser.user_id }
      })
      setSocket(newSocket)
      return () => {
        newSocket.disconnect()
      }
    }
  }, [localuser])

  useEffect(() => {
    if (socket) {
      socket.emit('PersonalRoom', localuser.user_id)
    }
  }, [localuser, socket])

  // Renderiza el componente solo si localUser tiene un valor definido
  return localuser
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
