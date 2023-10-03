import { useEffect } from 'react'
import { makeRequest } from '../../../library/axios'
import { useSocket } from '../../../socket/socket'

export function FetchChats (localuser, allchats, setUsers, setLoadingchats, setAllchats) {
  const socket = useSocket()

  useEffect(() => {
    async function fetchAllChats () {
      try {
        if (localuser.user_id) {
          // Obtener todos los estados de los mensajes
          const statusesResponse = await makeRequest.get('message/get-status/all')
          const messageStatuses = statusesResponse.data.Status

          // Filtrar los mensajes eliminados (is_deleted === 1) para el usuario local
          const deletedMessageIds = messageStatuses
            .filter(status => status.is_deleted === 1 && status.user_id === localuser.user_id)
            .map(status => status.message_id)

          // Obtener los mensajes correspondientes a los IDs filtrados
          const response = await makeRequest.get(
            `message/find/all/${localuser.user_id}`
          )
          const chats = response.data.messages

          // Filtrar los mensajes eliminados
          const filteredChats = chats.filter(chat => !deletedMessageIds.includes(chat.id))

          if (allchats.length === 0) {
            // Crear un objeto para agrupar los mensajes por conversación
            const conversationMap = {}

            // Iterar a través de los mensajes y agruparlos en el objeto
            filteredChats.forEach(chat => {
              const conversationKey = chat.room

              if (!conversationMap[conversationKey]) {
                conversationMap[conversationKey] = []
              }

              conversationMap[conversationKey].push(chat)
            })

            // Convertir el objeto en una lista de conversaciones
            const conversationList = Object.values(conversationMap)
            setAllchats(conversationList)

            // Obtener información de usuarios de la API
            const usersResponse = await makeRequest.get('user/find/all')
            const userList = usersResponse.data.users
            setUsers(userList)

            setLoadingchats(true)
          } else {
            setLoadingchats(true)
          }
        }
      } catch (error) {
        console.log('error:', error)
      }
    }

    fetchAllChats()

    if (socket) {
      socket.on('updateContacs', () => {
        fetchAllChats()
      })
    }
  }, [allchats.length, localuser.user_id, setAllchats, setLoadingchats, setUsers, socket])
}
