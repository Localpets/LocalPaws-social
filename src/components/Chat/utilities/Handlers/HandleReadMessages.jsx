import { makeRequest } from '../../../../library/Axios'

export async function handleReadMessages (userId, messageIds) {
  try {
    const promises = messageIds.map(async (messageId) => {
      const response = await makeRequest.put(`message/mark-as-read/${userId}/${messageId}`)
      if (response.status === 200) {
        console.log(`Mensaje marcado como leído: ${messageId}`)
      } else {
        console.error(`Error al marcar el mensaje ${messageId} como leído`)
      }
    })

    // Espera a que se completen todas las solicitudes
    await Promise.all(promises)
  } catch (error) {
    console.error('Error de red:', error)
  }
}
