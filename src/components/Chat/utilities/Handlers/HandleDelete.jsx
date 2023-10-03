import { makeRequest } from '../../../../library/axios'

export async function handleDelete (event, MessageID, MesageRoom, setIsdeleting, socket) {
  event.preventDefault()
  setIsdeleting(true)
  try {
    const response = await makeRequest.delete(`message/delete/${MessageID}`)
    if (response.status === 200) {
      socket.emit('deleteMessage', {
        id: MessageID,
        room: MesageRoom
      })
      setIsdeleting(false)
    } else {
      window.confirm('Error al eliminar el mensaje')
      console.error('Error al eliminar el mensaje')
      setIsdeleting(false)
    }
  } catch (error) {
    window.confirm('Error al conectar a la api')
    console.error('Error de red:', error)
  }
}
