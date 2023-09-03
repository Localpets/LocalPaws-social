/* eslint-disable react/prop-types */
import { BsClock } from 'react-icons/bs'
import useChatStore from '../../context/ChatStore'
import { useEffect, useCallback } from 'react'
import { makeRequest } from '../../library/axios'

const ConversationButton = ({ localuser, currentchat, setCurrentchat }) => {
  const {
    toggleSideContactsStyle,
    toggleHamburguerStyle,
    searchText,
    loadingchats,
    setLoadingchats,
    setAllchats,
    allchats,
    setUsers,
    users
  } = useChatStore()

  // Función para cargar los mensajes de una conversación
  const loadConversationMessages = useCallback((conversation) => {
    setCurrentchat(conversation)
    console.log('load conversations: ', currentchat)
  }, [currentchat, setCurrentchat])

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
    console.log('currentchat changed:', currentchat)
    if (currentchat) {
      loadConversationMessages(currentchat)
    }
  }, [currentchat, loadConversationMessages])

  return (
    <ul className='flex flex-col w-full items-center justify-center gap-4 pt-8'>
      {/* Usar la función de filtro para mapear las conversaciones */}
      {loadingchats
        ? (
            allchats
              .filter((conversation) => {
                const lastMessage = conversation[0]

                if (lastMessage) {
                  let otherUserId
                  if (lastMessage.receiver_id === localuser.userId) {
                    otherUserId = lastMessage.sender_id
                  } else if (lastMessage.sender_id === localuser.userId) {
                    otherUserId = lastMessage.receiver_id
                  }

                  const otherUser = users.find((user) => user.user_id === otherUserId)
                  return (
                    otherUser && otherUser.username.toLowerCase().includes(searchText.toLowerCase())
                  )
                }

                return false
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
