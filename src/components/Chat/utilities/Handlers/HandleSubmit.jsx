import { makeRequest } from '../../../../library/axios'

export async function handleSubmit (event, setIssending, message, currentchat, localuser, setMessage, socket, selectedImage, previewMsg, setSelectedImage, setPreviewMsg) {
  event.preventDefault()
  setIssending(true)

  // Validar si el campo de mensaje está vacío antes de enviar
  if (message.trim() === '' && !selectedImage) {
    return
  }
  const receiverId = currentchat.conversation[0].receiver_id === localuser.user_id
    ? currentchat.conversation[0].sender_id
    : currentchat.conversation[0].receiver_id
  const RoomForUsers = `${Math.min(localuser.user_id, receiverId)}-${Math.max(localuser.user_id, receiverId)}`

  // Crear un objeto FormData para enviar el mensaje y la imagen
  const formData = new FormData()
  formData.append('sender_id', localuser.user_id)
  formData.append('receiver_id', receiverId)
  formData.append('text', message)
  formData.append('room', RoomForUsers)

  // Agregar la imagen si está presente
  if (selectedImage) {
    formData.append('image', selectedImage)
  }

  // Verifica si se está respondiendo a un mensaje existente
  if (previewMsg) {
    console.log('previewMsg', previewMsg)
    const repliesObj = {
      id: previewMsg.messageId,
      sender_id: previewMsg.senderId,
      text: previewMsg.messageText,
      image_url: previewMsg.imageUrl
    }
    formData.append('replies', JSON.stringify(repliesObj))
  }

  try {
    // Envía los datos al servidor para enviar un mensaje
    const response = await makeRequest.post('message/create', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    if (response.status === 200) {
      setPreviewMsg('')
      setSelectedImage('')
      const messageId = response.data.message.id
      // Obtener la fecha y hora actual en formato ISO 8601
      const currentDateTime = new Date().toISOString()

      socket.emit('sendMessage', {
        createdAt: currentDateTime,
        edited: 0,
        id: messageId,
        receiver_id: receiverId,
        sender_id: localuser.user_id,
        text: message,
        image_url: response.data.message.image_url, // Utiliza la URL de la imagen proporcionada por el servidor
        room: RoomForUsers
      })
      setIssending(false)
      setMessage('')
    } else {
      window.confirm('Error al enviar el mensaje')
      console.error('Error al enviar el mensaje')
      setIssending(false)
    }
  } catch (error) {
    window.confirm('Error al conectar a la api')
    console.error('Error de red:', error)
    setIssending(false)
  }
}
