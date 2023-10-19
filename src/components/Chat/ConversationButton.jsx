/* eslint-disable react/prop-types */
import { BsThreeDotsVertical } from 'react-icons/bs'
import useChatStore from '../../context/ChatStore'
import { useEffect, useCallback, useState } from 'react'
import { useSocket } from '../../socket/socket'
import { Socketsforchatsbtn } from './utilities/SocketsEvents'
import { handleJoinRoom } from './utilities/Handlers/HandleJoinRoom'
import { handleReadMessages } from './utilities/Handlers/HandleReadMessages'
import { FetchChats } from './utilities/FetchChats_Users.jsx'
import { makeRequest } from '../../library/Axios'
import { handleShowMenu } from './utilities/Handlers/HandleShowChatMenu'
import { handleDeleteChat } from './utilities/Handlers/HandleDeleteChats'
import LoadingGif from '../LoadingState/LoadingGif'

const ConversationButton = ({ localuser, currentchat, setCurrentchat, setIsGroup }) => {
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
  const [updatedChats, setUpdatedChats] = useState([])
  const [allStatus, setAllStatus] = useState([])
  const [menuOpenMap, setMenuOpenMap] = useState({})
  const [chatDisabled, setChatDisabled] = useState(false)
  const unreadMessageIds = new Set()
  const undeletedMessageIds = new Set()
  const handleSearch = (event) => {
    const searchText = event.target.value
    setSearchText(searchText)
  }

  // Función para cargar los mensajes de una conversación
  const loadConversationMessages = useCallback((conversation) => {
    setCurrentchat(conversation)
  }, [setCurrentchat])

  const onClickHandlerJoin = (otherUserId, localuser, currentchat) => {
    handleJoinRoom(otherUserId, localuser, currentchat, socket)
  }

  // useEffect para obtener los mensajes de la conversación y usuarios
  FetchChats(localuser, allchats, setUsers, setLoadingchats, setAllchats)

  useEffect(() => {
    if (currentchat) {
      loadConversationMessages(currentchat)
    }
  }, [currentchat, loadConversationMessages])

  // Efecto para inicializar updatedChats una vez que allchats esté disponible
  useEffect(() => {
    if (allchats.length > 0) {
      setUpdatedChats(allchats)
    }
  }, [allchats])

  useEffect(() => {
    // Realiza la solicitud para obtener todos los estados de los mensajes
    makeRequest.get('message/get-status/all')
      .then((response) => {
        setAllStatus(response.data.Status)
      })

      .catch((error) => {
        console.log('Error:', error)
      })
  }, [allStatus])

  // Función para obtener los mensajes no leídos para un mensaje específico
  function getReadStatusForMessages (message, allStatus) {
    const messageStatus = allStatus.filter((status) => status.message_id === message.id)
    return messageStatus.filter((status) => status.is_read === 0) // Filtra los no leídos
  }

  function getUnDeletedStatusForMessages (message, allStatus) {
    const messageStatus = allStatus.filter((status) => status.message_id === message.id)
    return messageStatus.filter((status) => status.is_deleted === 0) // Filtra los no eliminados
  }

  // Efecto para manejar los mensajes en tiempo real
  Socketsforchatsbtn(currentchat, setUpdatedChats)
  return (
    <ul className='flex flex-col w-full max-h-[40em] overflow-y-auto items-center justify-center gap-4'>
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
            (updatedChats.length > 0 ? updatedChats : allchats)
              .filter((conversation) => {
                const filteredMessages = conversation.filter((message) => {
                  const otherUserId =
                  message.sender_id === localuser.user_id
                    ? message.receiver_id
                    : message.sender_id
                  const otherUser = users.find((user) => user.user_id === otherUserId)

                  const messageStatus = getReadStatusForMessages(message, allStatus)
                  const messageUnDeleteStatus = getUnDeletedStatusForMessages(message, allStatus)

                  // Verifica si el mensaje no leído pertenece al usuario actual y aún no está en el conjunto de IDs únicos
                  const isUnread = messageStatus.some(
                    (status) => status.user_id === localuser.user_id && !unreadMessageIds.has(message.id)
                  )

                  const isUnDeleted = messageUnDeleteStatus.some(
                    (status) => status.user_id === localuser.user_id && !undeletedMessageIds.has(message.id)
                  )

                  // Si el mensaje es no leído, agrega su ID al conjunto
                  if (isUnread) {
                    unreadMessageIds.add(message.id)
                  }

                  if (isUnDeleted) {
                    undeletedMessageIds.add(message.id)
                  }

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

                const unreadMessages = conversation.filter((message) => {
                  const messageStatus = getReadStatusForMessages(message, allStatus)

                  // Verifica si el mensaje no leído pertenece al usuario actual
                  return messageStatus.some((status) => status.user_id === localuser.user_id)
                })
                // Obtén los IDs de los mensajes no leídos para esta conversación
                const unreadMessageIds = unreadMessages.map((message) => message.id)

                // Calcula el contador de mensajes no leídos
                const unreadCount = [...unreadMessageIds].filter((id) =>
                  conversation.some((message) => message.id === id)
                ).length

                const deletedMessages = conversation.filter((message) => {
                  const messageDeleteStatus = getUnDeletedStatusForMessages(message, allStatus)

                  return messageDeleteStatus.some((status) => status.user_id === localuser.user_id)
                })

                const deletedMessageIds = deletedMessages.map((message) => message.id)

                let otherUserId
                if (lastMessage.receiver_id === localuser.user_id) {
                  otherUserId = lastMessage.sender_id
                } else if (lastMessage.sender_id === localuser.user_id) {
                  otherUserId = lastMessage.receiver_id
                }

                const otherUser = users.find((user) => user.user_id === otherUserId)
                const limitedUsername = otherUser ? otherUser.username.substring(0, 30) : ''
                const limitedMessage = lastMessage.text.length > 10 ? lastMessage.text.substring(0, 15) + '...' : lastMessage.text
                return (
                  <li className='w-full flex' key={lastMessage.id}>
                    <button
                      className={unreadCount > 0 ? 'btn-ghost p-2 rounded-lg w-full flex justify-left gap-2 bg-[#ebffb8ca]' : 'btn-ghost p-2 rounded-lg w-full flex justify-left gap-2'}
                      onClick={() => {
                        toggleSideContactsStyle()
                        toggleHamburguerStyle()
                        setIsGroup(false)
                        setCurrentchat({
                          conversation,
                          username: limitedUsername,
                          thumbnail: otherUser ? otherUser.thumbnail : ''
                        })
                        handleReadMessages(localuser.user_id, unreadMessageIds)
                        onClickHandlerJoin(otherUserId, localuser, currentchat)
                      }}
                      disabled={chatDisabled || false}
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
                        <div className={unreadCount > 0 ? 'text-black text-sm flex items-center gap-4' : 'text-black text-sm'}>
                          <h1>{limitedMessage}</h1>
                          <p className={unreadCount > 0 ? 'rounded-full bg-[#2a3d60cd] text-white text-xs w-4 h-4' : 'hidden'}>
                            {unreadCount}
                          </p>
                        </div>
                      </div>
                    </button>
                    <button
                      className='rounded-full hover:bg-gray-200'
                      onClick={() => handleShowMenu(conversation[0].room, setMenuOpenMap, chatDisabled, setChatDisabled)}
                    >
                      <BsThreeDotsVertical />
                    </button>
                    {menuOpenMap[conversation[0].room]
                      ? (
                        <ul className='absolute p-2 w-[17em] rounded-md shadow-lg'>
                          <button
                            className=''
                            onClick={() => {
                              setChatDisabled(false)
                              handleDeleteChat(localuser.user_id, deletedMessageIds, socket, currentchat, setCurrentchat, lastMessage.room)
                              handleShowMenu(conversation[0].room, setMenuOpenMap, chatDisabled, setChatDisabled)
                            }}
                          >
                            <i className='fa-solid fa-trash text-white p-4 rounded-full hover:text-red-400 hover:bg-[#cececeb4] text-lg' />
                          </button>
                        </ul>
                        )
                      : null}
                  </li>
                )
              })
          )
        : (
          <div className='flex gap-2 items-center'>
            <LoadingGif />
          </div>
          )}
    </ul>
  )
}

export default ConversationButton
