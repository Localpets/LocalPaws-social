import { makeRequest } from '../../../../library/Axios'

export async function handleReactions (event, messageId, userId, reactionType, messageRoom, setOpenReactMenu, socket) {
  event.preventDefault()
  setOpenReactMenu(null)

  try {
    // Obtener las reacciones existentes del usuario al mensaje
    const existingReactions = await makeRequest.get(`message/find/reaction/${messageId}`)

    // Verificar si el usuario ya ha reaccionado al mensaje
    const userReaction = existingReactions.data.reactions.find(
      (reaction) => reaction.user_id === userId
    )

    if (userReaction) {
      if (userReaction.Reaction === reactionType) {
        // Si el usuario ya ha reaccionado y la reacción coincide con la nueva reacción, eliminarla
        await makeRequest.delete(`message/remove-reaction/${userReaction.id}`, {
          user_id: userId,
          Reaction: userReaction.Reaction
        })

        // Emitir el evento de eliminación solo para la reacción del usuario actual
        socket.emit('removeReaction', {
          id: userReaction.id,
          user_id: userId,
          message_id: messageId,
          Reaction: reactionType,
          room: messageRoom
        })
      } else {
        // Si el usuario ya ha reaccionado pero con una reacción diferente, eliminar la reacción anterior
        const response = await makeRequest.delete(`message/remove-reaction/${userReaction.id}`, {
          user_id: userId,
          Reaction: userReaction.Reaction
        })

        // Agregar la nueva reacción
        const newReactionResponse = await makeRequest.post(`message/add-reaction/${messageId}`, {
          user_id: userId,
          Reaction: reactionType
        })

        if (response.status === 200 && newReactionResponse.status === 200) {
          const ReactionId = newReactionResponse.data.id
          socket.emit('removeReaction', {
            id: userReaction.id,
            user_id: userId,
            message_id: messageId,
            Reaction: userReaction.Reaction,
            room: messageRoom
          })

          socket.emit('addReaction', {
            id: ReactionId,
            user_id: userId,
            message_id: messageId,
            Reaction: reactionType,
            room: messageRoom
          })
        } else {
          console.error('Error al reaccionar al mensaje')
        }
      }
    } else {
      // Si el usuario no ha reaccionado antes, agregar la nueva reacción
      const response = await makeRequest.post(`message/add-reaction/${messageId}`, {
        user_id: userId,
        Reaction: reactionType
      })

      if (response.status === 200) {
        const ReactionId = response.data.id
        socket.emit('addReaction', {
          id: ReactionId,
          user_id: userId,
          message_id: messageId,
          Reaction: reactionType,
          room: messageRoom
        })
      } else {
        console.error('Error al reaccionar al mensaje')
      }
    }
  } catch (error) {
    console.error('Error de red:', error)
  }
}
