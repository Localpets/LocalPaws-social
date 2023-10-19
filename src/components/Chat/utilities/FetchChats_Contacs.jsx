import { makeRequest } from '../../../library/Axios'

export async function fetchAllChats (localuser, allchats, setAllchats) {
  try {
    if (localuser && localuser.user_id) {
      // Obtener todos los estados de los mensajes
      const statusesResponse = await makeRequest.get('message/get-status/all')
      const messageStatuses = statusesResponse.data.Status

      // Filtrar los mensajes eliminados (is_deleted === 1) para el usuario local
      const deletedMessageIds = messageStatuses
        .filter(status => status.is_deleted === 1 && status.user_id === localuser.user_id)
        .map(status => status.message_id)

      // Obtener mensajes de la API para el usuario local
      const response = await makeRequest.get(`message/find/all/${localuser.user_id}`)
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
      }
    }
  } catch (error) {
    console.log('error:', error)
  }
}

fetchAllChats()
