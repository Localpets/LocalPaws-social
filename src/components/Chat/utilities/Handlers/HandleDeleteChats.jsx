import swal from 'sweetalert'
import { makeRequest } from '../../../../library/Axios'

export async function handleDeleteChat (userId, messageIds, socket, currentchat, setCurrentchat, lastMessage) {
  // Utiliza async/await para esperar la respuesta del usuario
  const confirmed = await swal({
    title: '¿Seguro que quieres eliminar este chat para ti?',
    text: 'Una vez eliminado, no podrás recuperar este chat y quedará eliminado solo para ti.',
    icon: 'warning',
    buttons: true,
    dangerMode: true
  })

  // Verifica si el usuario confirmó la eliminación
  if (confirmed) {
    try {
      const promises = messageIds.map(async (messageId) => {
        const response = await makeRequest.put(`message/mark-as-deleted/${userId}/${messageId}`)
        if (response.status === 200) {
          if (socket) {
            // Comprobar si la conversación actual está siendo eliminada
            const isCurrentChatDeleted = currentchat && currentchat.conversation.some(message => message.id === messageId)
            const isCurrentRoomDeleted = currentchat && currentchat.conversation[0].room === lastMessage
            if (isCurrentChatDeleted) {
              setCurrentchat([])
            }

            if (isCurrentRoomDeleted) {
              socket.emit('leaveAllRooms', (userId))
            }

            socket.emit('DeletedChats', ({ userId, messageIds }))
          }
          swal('El chat seleccionado ha sido eliminado', {
            icon: 'success'
          })
        } else {
          swal('El chat seleccionado no ha sido eliminado')
        }
      })

      // Espera a que se completen todas las solicitudes
      await Promise.all(promises)

      console.log('Todos los mensajes marcados como leídos')
    } catch (error) {
      console.error('Error de red:', error)
      swal('El chat seleccionado no ha sido eliminado')
    }
  } else {
    // El usuario canceló la eliminación, puedes hacer algo aquí si es necesario
    console.log('Eliminación de chat cancelada por el usuario')
  }
}
