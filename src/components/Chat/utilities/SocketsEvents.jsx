import { useEffect } from 'react'
import { useSocket } from '../../../socket/socket'

function Socketsforchatsbtn (currentchat, setUpdatedChats) {
  const socket = useSocket()
  useEffect(() => {
    if (socket) {
      socket.on('MessageBtnUpdate', (message) => {
        // Comprueba si el mensaje ya está en la conversación actual
        if (
          !currentchat ||
              !currentchat.conversation ||
              !Array.isArray(currentchat.conversation) ||
              !currentchat.conversation.some((msg) => msg.id === message.id)
        ) {
          setUpdatedChats((prevChats) => {
            const updatedChatsCopy = [...prevChats]

            // Encuentra la conversación existente a la que pertenece el mensaje
            const conversationToUpdate = updatedChatsCopy.find((conversation) =>
              conversation.some((msg) => msg.room === message.room)
            )

            // Si la conversación existe, actualiza el último mensaje
            if (conversationToUpdate) {
              const updatedConversation = [...conversationToUpdate]
              updatedConversation.unshift(message) // Agrega el nuevo mensaje al principio

              // Encuentra la posición de la conversación en el arreglo y actualízala
              const conversationIndex = updatedChatsCopy.findIndex((conversation) =>
                conversation.some((msg) => msg.room === message.room)
              )
              updatedChatsCopy[conversationIndex] = updatedConversation
            } else {
              // Si no existe, crea una nueva conversación con el nuevo mensaje
              updatedChatsCopy.push([message])
            }

            return updatedChatsCopy
          })
        }
      })

      socket.on('EditedBtnUpdate', (editedMessage) => {
        setUpdatedChats((prevChats) => {
          // Busca el mensaje a editar por su ID
          const updatedChatsCopy = prevChats.map((conversation) =>
            conversation.map((message) => {
              if (message.id === editedMessage.id) {
                // Actualiza el mensaje y su fecha
                return {
                  ...editedMessage,
                  sender_id: message.sender_id,
                  createdAt: editedMessage.createdAt
                }
              } else {
                return message
              }
            })
          )
          return updatedChatsCopy
        })
      })

      socket.on('DeletedMsgBtnUpdate', (deletedMessageId) => {
        setUpdatedChats((prevChats) => {
          // Filtra los mensajes para eliminar el que tenga el ID correspondiente
          const updatedChatsCopy = prevChats.map((conversation) =>
            conversation.filter((message) => message.id !== deletedMessageId.id)
          )
          return updatedChatsCopy
        })
      })

      socket.on('DeletedChatBtnUpdate', (deletedMessageIds) => {
        setUpdatedChats((prevChats) => {
          // Filtra los mensajes para eliminar los que tengan los IDs correspondientes
          const updatedChatsCopy = prevChats.map((conversation) =>
            conversation.filter(
              (message) => !deletedMessageIds.some((id) => id === message.id)
            )
          )
          return updatedChatsCopy
        })
      })
    }
  }, [currentchat, setUpdatedChats, socket])
}

function Socketsforchatsmodule (currentchat, setCurrentchat, chatContainerRef, setReactions) {
  const socket = useSocket()
  useEffect(() => {
    if (socket) {
      socket.on('newMessage', (message) => {
        if (currentchat) {
          setCurrentchat((prevChat) => {
            if (!prevChat || !prevChat.conversation || !Array.isArray(prevChat.conversation)) {
              // Si prevChat no está definido, conversation no está definido o no es un array válido, inicializa prevChat adecuadamente
              prevChat = {
                ...prevChat,
                conversation: []
              }
            }

            // Verifica si el mensaje ya existe en la conversación actual por su ID
            const messageExists = prevChat.conversation.some((msg) => msg.id === message.id)

            if (!messageExists) {
              // Si el mensaje no existe, agrégalo a la conversación
              prevChat.conversation.unshift(message)
              chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
            }

            return {
              ...prevChat,
              conversation: [...prevChat.conversation] // Asegúrate de mantener la conversación actual como un array
            }
          })
        }
      })

      socket.on('editedMessage', (message) => {
        setCurrentchat((prevChat) => {
          // Busca el mensaje actualizado en la conversación y actualiza solo su texto
          const updatedConversation = prevChat.conversation.map((msg) =>
            msg.id === message.id ? { ...msg, text: message.text, edited: 1 } : msg
          )

          return {
            ...prevChat,
            conversation: updatedConversation
          }
        })
      })

      socket.on('deletedMessage', (message) => {
        setCurrentchat((prevChat) => {
          // Filtra los mensajes para eliminar el mensaje con el ID especificado
          const filteredConversation = prevChat.conversation.filter(
            (msg) => msg.id !== message
          )
          return {
            ...prevChat,
            conversation: filteredConversation
          }
        })
      })

      socket.on('addedReaction', (newReaction) => {
        setReactions((prevReactions) => {
          // Filtrar las reacciones del usuario actual en el mismo mensaje
          const userReactionsInMessage = prevReactions.filter(
            (reaction) =>
              reaction.message_id === newReaction.message_id &&
              reaction.user_id === newReaction.user_id
          )

          if (userReactionsInMessage.length > 0) {
            // Si el usuario ya ha reaccionado, reemplazar la reacción existente
            const updatedReactions = prevReactions.map((reaction) => {
              if (
                reaction.message_id === newReaction.message_id &&
                reaction.user_id === newReaction.user_id
              ) {
                return newReaction
              }
              return reaction
            })
            return updatedReactions
          } else {
            // Si el usuario no ha reaccionado antes, agregar la nueva reacción
            return [...prevReactions, newReaction]
          }
        })
      })

      socket.on('removedReaction', (deleteReaction) => {
        setReactions((prevReactions) => {
          // Encuentra la reacción existente del mismo usuario en el mismo mensaje
          const existingReactionIndex = prevReactions.findIndex((reaction) => {
            return (
              reaction.message_id === deleteReaction.message_id &&
              reaction.user_id === deleteReaction.user_id
            )
          })

          if (existingReactionIndex !== -1) {
            // Clona la lista de reacciones existentes para modificarla
            const updatedReactions = [...prevReactions]
            // Reemplaza la reacción existente con la nueva reacción
            updatedReactions.splice(existingReactionIndex, 1) // Elimina la reacción existente
            return updatedReactions // Devuelve la lista actualizada
          } else {
            // Si no se encuentra la reacción existente, simplemente devuelve la lista previa sin cambios
            return prevReactions
          }
        })
      })
    }
  }, [chatContainerRef, currentchat, setCurrentchat, setReactions, socket])
}

export { Socketsforchatsbtn, Socketsforchatsmodule }
