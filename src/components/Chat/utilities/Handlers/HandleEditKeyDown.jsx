import { makeRequest } from '../../../../library/axios'

export async function handleEditKeyDown (event, messageRoom, messageId, userId, receiverId, createdAt, editInputValue, setEditingMessageId, setOpenMenuId, socket) {
  if (event.key === 'Enter') {
    event.preventDefault()
    try {
      const response = await makeRequest.put(`message/update/${messageId}`, {
        text: editInputValue,
        edited: 1
      })

      if (response.status === 200) {
        console.log('Mensaje actualizado exitosamente')
        socket.emit('editMessage', {
          id: messageId,
          user_id: userId,
          receiver_id: receiverId,
          text: editInputValue,
          edited: 1,
          room: messageRoom,
          createdAt
        })
        setEditingMessageId(null)
        setOpenMenuId(null)
      } else {
        console.error('Error al actualizar el mensaje')
      }
    } catch (error) {
      console.error('Error de red:', error)
    }
  }
}
