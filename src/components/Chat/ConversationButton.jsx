/* eslint-disable react/prop-types */
import { BsClock } from 'react-icons/bs'
import useChatStore from '../../context/ChatStore'
import { useEffect, useCallback, useState } from 'react'
import { makeRequest } from '../../library/axios'
import { useSocket } from '../../socket/socket'

const ConversationButton = ({ localuser, currentchat, setCurrentchat }) => {
  const {
    toggleSideContactsStyle,
    toggleHamburguerStyle,
    loadingchats,
    setLoadingchats,
    setAllchats,
    allchats,
    setUsers,
    users
  } = useChatStore()

  const socket = useSocket()
  const [searchText, setSearchText] = useState('')

  const handleSearch = (event) => {
    const searchText = event.target.value
    setSearchText(searchText)
  }

  // Función para cargar los mensajes de una conversación
  const loadConversationMessages = useCallback((conversation) => {
    setCurrentchat(conversation)
  }, [setCurrentchat])

  const handleJoinRoom = (otherUserId) => {
    // Concatenar los IDs de los usuarios para obtener el nuevo nombre de la sala
    const newRoomName = `${Math.min(localuser.userId, otherUserId)}-${Math.max(localuser.userId, otherUserId)}`

    // Obtener el nombre de la sala actual del usuario
    const currentRoomName = getCurrentRoomName()

    // Si el usuario está actualmente en una sala y la sala actual es diferente de la nueva sala,
    // entonces saca al usuario de la sala anterior y únete a la nueva sala
    if (currentRoomName && currentRoomName !== newRoomName) {
      // Salir de la sala anterior
      socket.emit('leaveRoom', currentRoomName)
      console.log(`Usuario ${localuser.userId} salió de la sala: ${currentRoomName}`)

      // Unirse a la nueva sala
      socket.emit('joinRoom', newRoomName)
      console.log(`Usuario ${localuser.userId} se unió a la sala: ${newRoomName}`)
    } else if (!currentRoomName) {
      // Si el usuario no está en ninguna sala actualmente, únete directamente a la nueva sala
      socket.emit('joinRoom', newRoomName)
      console.log(`Usuario ${localuser.userId} se unió a la sala: ${newRoomName}`)
    }
  }

  // Función para obtener la sala actual del usuario
  function getCurrentRoomName () {
  // Verifica si currentchat y currentchat.conversation están definidos antes de acceder a 'length'
    if (currentchat && currentchat.conversation) {
      return currentchat.conversation.length > 0 ? currentchat.conversation[0].room : null
    }
    return null // O devuelve null si no está definido
  }

  // useEffect para obtener los mensajes de la conversación y usuarios
  useEffect(() => {
    async function fetchAllChats () {
      try {
        if (localuser.userId) {
        // Obtener mensajes de la API
          const response = await makeRequest.get(
          `message/find/all/${localuser.userId}`
          )
          const chats = response.data.messages

          // Crear un objeto para agrupar los mensajes por conversación
          const conversationMap = {}

          // Iterar a través de los mensajes y agruparlos en el objeto
          chats.forEach(chat => {
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
          const userList = usersResponse.data.data
          setUsers(userList)
          setLoadingchats(true)
        }
      } catch (error) {
        console.log('error:', error)
      }
    }

    fetchAllChats()
  }, [localuser.userId, setAllchats, setLoadingchats, setUsers])

  useEffect(() => {
    if (currentchat) {
      loadConversationMessages(currentchat)
    }
  }, [currentchat, loadConversationMessages])

  return (
    <ul className='flex flex-col w-full items-center justify-center gap-4'>
      {/* Búsqueda de conversaciones */}
      <input
        type='text'
        placeholder='Buscar conversación'
        className='input bg-gray-100 text-black rounded-md mt-4 w-full max-w-2xl placeholder:font-semibold'
        value={searchText}
        onChange={handleSearch}
      />

      {/* Usar la función de filtro para mapear las conversaciones */}
      {loadingchats
        ? (
            allchats
              .filter((conversation) => {
                const filteredMessages = conversation.filter((message) => {
                  const otherUserId =
                    message.sender_id === localuser.userId
                      ? message.receiver_id
                      : message.sender_id

                  const otherUser = users.find((user) => user.user_id === otherUserId)

                  return (
                    otherUser &&
                    (otherUser.username.toLowerCase().includes(searchText.toLowerCase()) ||
                      message.text.toLowerCase().includes(searchText.toLowerCase()))
                  )
                })

                // Si hay mensajes que coinciden con la búsqueda en esta conversación, conservamos la conversación
                return filteredMessages.length > 0
              })
              .map((conversation) => {
                const lastMessage = conversation[0]

                let otherUserId
                if (lastMessage.receiver_id === localuser.userId) {
                  otherUserId = lastMessage.sender_id
                } else if (lastMessage.sender_id === localuser.userId) {
                  otherUserId = lastMessage.receiver_id
                }

                const otherUser = users.find((user) => user.user_id === otherUserId)
                const limitedUsername = otherUser ? otherUser.username.substring(0, 30) : ''
                const limitedMessage =
          lastMessage.text.length > 10 ? lastMessage.text.substring(0, 15) + '...' : lastMessage.text

                return (
                  <li className='w-full' key={lastMessage.id}>
                    <button
                      className='btn-ghost p-2 rounded-lg w-full flex justify-left gap-2'
                      onClick={() => {
                        toggleSideContactsStyle()
                        toggleHamburguerStyle()
                        setCurrentchat({
                          conversation,
                          username: limitedUsername,
                          thumbnail: otherUser ? otherUser.thumbnail : ''
                        })
                        handleJoinRoom(otherUserId)
                      }}
                    >
                      <div className='text-black'>
                        <img
                          className='w-12 h-12 rounded-full'
                          src={otherUser ? otherUser.thumbnail : ''}
                          alt={limitedUsername}
                        />
                      </div>
                      <div className='flex flex-col items-start justify-center'>
                        <div className='text-black font-bold text-md'>{limitedUsername}</div>
                        <div className='text-black text-sm'>{limitedMessage}</div>
                      </div>
                    </button>
                  </li>
                )
              })
          )
        : (
          <div className='flex gap-2 items-center'>
            <BsClock className='animate-spin' /> <h1>Cargando chats</h1>
          </div>
          )}
    </ul>
  )
}

export default ConversationButton
