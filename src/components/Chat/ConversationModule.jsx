/* eslint-disable camelcase */
/* eslint-disable react/prop-types */
import { BsClock } from 'react-icons/bs'
import useChatStore from '../../context/ChatStore'
import { useEffect, useState, useRef } from 'react'
import { makeRequest } from '../../library/axios'
import { useSocket } from '../../socket/socket'
import ChatForms from './ChatForms'
import { Socketsforchatsmodule } from './utilities/SocketsEvents'
import FormatText from './Structures/FormatText'
import { handleSubmit } from './utilities/Handlers/HandleSubmit'
import { handleDelete } from './utilities/Handlers/HandleDelete'
import { handleEditKeyDown } from './utilities/Handlers/HandleEditKeyDown'
import { handleReactions } from './utilities/Handlers/HandleReactions'
import { handleReplyMessage } from './utilities/Handlers/HandleReplyMessage'
import FormatImage from './Structures/FormatImage'
import ConversationHeader from './Structures/ConversationHeader'
import '../../containers/Chat/Chat.css'
import { FetchReplies } from './utilities/FetchChats_Replys'
import GroupsModule from './GroupsComponent/GroupsModule'

const ConversationModule = ({ localuser, currentchat, chatContainerRef, setCurrentchat, isGroup, currentGroup }) => {
  const {
    editingMessageId,
    setEditingMessageId,
    expandedMessageId,
    openMenuId,
    setOpenMenuId,
    openReactMenu,
    setOpenReactMenu,
    message,
    setMessage,
    editInputValue,
    users,
    setEditInputValue,
    toggleSideContactsStyle,
    toggleHamburguerStyle
  } = useChatStore()

  const reactionEmojis = {
    Like: <img className='w-[1.4em]' src='https://em-content.zobj.net/source/facebook/355/thumbs-up_1f44d.png' />,
    Heart: <img className='w-[1.4em]' src='https://em-content.zobj.net/thumbs/60/facebook/355/smiling-cat-with-heart-eyes_1f63b.webp' />,
    Laugh: <img className='w-[1.4em]' src='https://em-content.zobj.net/source/facebook/355/grinning-cat_1f63a.png' />,
    Cry: <img className='w-[1.4em]' src='https://em-content.zobj.net/thumbs/60/facebook/355/crying-cat_1f63f.webp' />
  }

  const [reactions, setReactions] = useState([])
  const [isdeleting, setIsdeleting] = useState(false)
  const [expandedMessages, setExpandedMessages] = useState({})
  const [issending, setIssending] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const [previewMsg, setPreviewMsg] = useState('')
  const [messageReplies, setMessageReplies] = useState([])
  const buttonRef = useRef(null)
  const socket = useSocket()

  useEffect(() => {
    const getReactions = async () => {
      try {
        const res = await makeRequest.get('message/find/reactions/all')
        if (res.status === 200) {
          setReactions(res.data.reactions)
        }
      } catch (error) {
        console.log(error)
      }
    }
    getReactions()
  }, [setReactions])

  useEffect(() => {
    // Accede al elemento DOM del contenedor y ajusta el scrollTop
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [currentchat, chatContainerRef])

  // Maneja el envío del formulario
  const handleFormSubmit = (event) => {
    handleSubmit(event, setIssending, message, currentchat, localuser, setMessage, socket, selectedImage, previewMsg, setSelectedImage, setPreviewMsg)
  }

  // Maneja la eliminacion de un mensaje
  const handleDeleteMsg = (event, MessageID, MesageRoom) => {
    handleDelete(event, MessageID, MesageRoom, setIsdeleting, socket)
  }

  // Manejador de envio de mensaje editado
  const handleEditKeyDownMsg = (event, messageRoom, messageId, messageImage, userId, receiverId, createdAt) => {
    handleEditKeyDown(event, messageRoom, messageId, messageImage, userId, receiverId, createdAt, editInputValue, setEditingMessageId, setOpenMenuId, socket)
  }

  // Manejador de envio de datos al estado para mandarlos por medio de handleEditKeyDown a la api
  const handleUpdate = (messageId, text) => {
    setEditingMessageId(messageId)
    setEditInputValue(text)
  }

  const handleReactionsMsg = (event, messageId, userId, reactionType, messageRoom) => {
    handleReactions(event, messageId, userId, reactionType, messageRoom, setOpenReactMenu, socket)
  }

  const HandleReplyMsg = (messageId, messageText, messageSender, messageImage) => {
    handleReplyMessage(messageId, messageText, messageSender, messageImage, setPreviewMsg)
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (buttonRef.current && !buttonRef.current.contains(event.target)) {
        setOpenMenuId(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [buttonRef, setOpenMenuId])

  useEffect(() => {
    // Itera sobre los mensajes y obtén sus respuestas utilizando FetchReplies
    const getRepliesForMessages = async () => {
      const replies = {}
      for (const message of currentchat.conversation) {
        const msgReplies = await FetchReplies(message.id)
        replies[message.id] = msgReplies
      }
      setMessageReplies(replies)
    }

    // Llama a la función para obtener las respuestas
    getRepliesForMessages()
  }, [currentchat.conversation])
  // Función para renderizar las reacciones en un mensaje
  const renderReactions = (messageId) => {
    // Filtra las reacciones que corresponden al mensaje con el ID dado
    const messageReactions = reactions.filter(
      (reaction) => reaction.message_id === messageId
    )

    // Crea un objeto para contar las reacciones de cada tipo
    const reactionCounts = {}
    messageReactions.forEach((reaction) => {
      if (reaction.Reaction in reactionCounts) {
        reactionCounts[reaction.Reaction]++
      } else {
        reactionCounts[reaction.Reaction] = 1
      }
    })

    // Mapea los conteos de reacciones a elementos JSX
    const reactionElements = Object.keys(reactionCounts).map((reactionType) => {
      const count = reactionCounts[reactionType]
      const emoji = reactionEmojis[reactionType]
      return (
        <div key={reactionType} className={`bg-[#8f6e4c88] rounded-3xl p-[0.3em] flex gap-1 relative top-[-0.5em] ${message === localuser.user_id ? 'left-[-0.2em]' : 'right-[-0.2em]'}`}>
          <span className='flex'>
            {emoji} {count > 1 ? `x${count}` : ''}
          </span>
        </div>

      )
    })
    return reactionElements
  }

  // Función para manejar la visibilidad del menu de los mensajes
  const toggleMenu = (messageId) => {
    if (openMenuId === messageId) {
      setOpenMenuId(null)
    } else {
      setOpenMenuId(messageId)
    }
  }

  // Función para manejar la visibilidad del menu de las reacciones
  const toggleReactMenu = (messageId) => {
    if (openReactMenu === messageId) {
      setOpenReactMenu(null)
    } else {
      setOpenReactMenu(messageId)
    }
  }

  Socketsforchatsmodule(currentchat, setCurrentchat, chatContainerRef, setReactions)

  return (
    <section className='w-full'>
      {!isGroup
        ? (
          <section className='flex flex-col justify-start flex-1 h-full w-full'>
            <ConversationHeader currentchat={currentchat} toggleSideContactsStyle={toggleSideContactsStyle} toggleHamburguerStyle={toggleHamburguerStyle} />

            {currentchat && currentchat.conversation
              ? <section className='h-full overflow-auto'>

                <div className='flex flex-col w-full h-full justify-end bg-[url("https://wallpapercave.com/wp/wp9599638.jpg")] bg-cover rounded-br-lg'>
                  <section className='p-4 pb-6 overflow-auto' ref={chatContainerRef}>
                    <div className='flex justify-center text-lg text-neutral'>
                      <h1 className='w-[30em] text-center bg-[#ffffffa6] rounded-3xl p-2'>Chatea con tus amigos, reacciona a sus mensajes y socializa con toda la comunida de pawsplorer</h1>
                    </div>
                    {Array.isArray(currentchat.conversation)
                      ? (
                          currentchat.conversation.slice()
                            .reverse()
                            .filter((message, index, self) => self.findIndex((m) => m.id === message.id) === index)
                            .map(message => {
                              const createdAt = message.createdAt
                              const date = new Date(createdAt)
                              const hasReplies = Object.keys(messageReplies).includes(message.id.toString())
                              // Opciones para el formato de fecha y hora
                              const options = {
                                hour: 'numeric',
                                minute: 'numeric',
                                hour12: true // Formato de 12 horas
                              }
                              const formattedTime = date.toLocaleString('en-US', options)
                              const deletingState = (
                                <div className='flex gap-2 items-center justify-center'>
                                  <BsClock className='animate-spin' />
                                  <h1>Eliminando</h1>
                                </div>
                              )

                              return (
                                <div
                                  className={`flex flex-col chat ${message.sender_id === localuser.user_id ? 'chat-end' : 'chat-start'}`}
                                  key={message.id}
                                >
                                  <div className='chat-bubble bg-neutral text-white flex items-start text-left gap-4'>
                                    <div className={`message-content pt-1 ${message.image_url !== '' ? ' ' : ''}`}>
                                      {editingMessageId === message.id
                                        ? <div className='flex gap-2'>
                                          <input
                                            type='text'
                                            value={editInputValue}
                                            onChange={e => setEditInputValue(event.target.value)}
                                            onKeyDown={e => handleEditKeyDownMsg(event, message.room, message.id, message.image_url, message.sender_id, message.receiver_id, message.createdAt)}
                                            placeholder={message.text}
                                            className='bg-white border-secondary rounded-xl text-neutral focus:border-secondary focus:outline-secondary'
                                          />
                                          <button className={`hover:font-bold ${localuser.user_id === message.sender_id ? '' : 'Hidden-btn'}`} onClick={() => setEditingMessageId(null)}>✖</button>
                                          {/* eslint-disable-next-line react/jsx-indent */}
                                          </div>
                                        : (
                                          <section>
                                            {hasReplies && messageReplies[message.id].length > 0
                                              ? <div className='bg-[#8f6e4c88] rounded-xl mb-2 text-left text-[#ffffff7a]'>
                                                {/* Renderiza el texto de la respuesta aquí */}
                                                {messageReplies[message.id].map(reply => {
                                                  const ReplyUsername = users.find(user => user.user_id === reply.senderId)
                                                  console.log(reply)
                                                  return (
                                                    <div key={reply.id} className='gap-2'>
                                                      <div className={`absolute h-12 w-2 rounded-s-xl ${reply.senderId === localuser.user_id ? 'bg-orange-800' : 'bg-yellow-500'}`} />
                                                      <div className={reply.image_url ? 'flex gap-12 justify-between' : ''}>
                                                        <p className='pl-4 text-white'>{ReplyUsername.username}</p>
                                                        {reply.image_url
                                                          ? <img className='w-12 h-12 opacity-75' src={reply.image_url} />
                                                          : <p className='ml-8'>{reply.text.length > 10 ? `${reply.text.slice(0, 20)}...` : reply.text}</p>}
                                                      </div>

                                                    </div>
                                                  )
                                                })}
                                                {/* eslint-disable-next-line react/jsx-indent */}
                                                </div>
                                              : null}

                                            <div className={`message-text ${expandedMessageId === message.id ? 'expanded' : ''}`}>
                                              <div className='flex items-center gap-2'>
                                                {message.image_url !== ''
                                                  ? (
                                                    <FormatImage imageurl={message.image_url} text={message.text} messageId={message.id} expandedMessages={expandedMessages} setExpandedMessages={setExpandedMessages} />
                                                    )
                                                  : (
                                                    <FormatText text={message.text} messageId={message.id} expandedMessages={expandedMessages} setExpandedMessages={setExpandedMessages} />
                                                    )}
                                                <button
                                                  ref={buttonRef}
                                                  className={` hidden-button bg-[#ddb89288] text-sm text-neutral rounded-full p-1 ${message.sender_id === localuser.user_id ? '' : 'hidden'}`}
                                                  onClick={() => toggleMenu(message.id)}
                                                > ⊚
                                                </button>
                                                <button
                                                  className={` hidden-button absolute bg-[#ddb89288] text-sm text-neutral rounded-xl w-6 h-6 ${message.sender_id === localuser.user_id ? 'left-[-2em] top-2' : 'right-[-2em] top-2'}`}
                                                  onClick={() => HandleReplyMsg(message.id, message.text, message.sender_id, message.image_url)}
                                                > ⤺
                                                </button>
                                                <button
                                                  className={` hidden-button absolute bg-[#ddb89288] text-neutral rounded-xl w-6 h-6 p-1 ${message.sender_id === localuser.user_id ? 'left-[-4em] top-2' : 'right-[-4em] top-2'}`}
                                                  onClick={() => toggleReactMenu(message.id)}
                                                >
                                                  <svg viewBox='0 0 15 15' width='15' preserveAspectRatio='xMidYMid meet' className='' fill='none'>
                                                    <path
                                                      fillRule='evenodd'
                                                      clipRule='evenodd' d='M0 7.5C0 11.6305 3.36946 15 7.5 15C11.6527 15 15 11.6305 15 7.5C15 3.36946 11.6305 0 7.5 0C3.36946 0 0 3.36946 0 7.5ZM10.995 8.69333C11.1128 8.67863 11.2219 8.66503 11.3211 8.65309C11.61 8.63028 11.8076 8.91918 11.6784 9.13965C10.8573 10.6374 9.29116 11.793 7.50455 11.793C5.71794 11.793 4.15181 10.6602 3.33072 9.16246C3.18628 8.91918 3.37634 8.63028 3.66524 8.65309C3.79123 8.66749 3.93521 8.68511 4.09426 8.70457C4.94292 8.80842 6.22074 8.96479 7.48174 8.96479C8.81855 8.96479 10.1378 8.80025 10.995 8.69333ZM5.41405 7.37207C6.05761 7.37207 6.60923 6.72851 6.60923 6.02978C6.60923 5.30348 6.05761 4.6875 5.41405 4.6875C4.77048 4.6875 4.21886 5.33106 4.21886 6.02978C4.20967 6.75609 4.77048 7.37207 5.41405 7.37207ZM10.7807 6.05619C10.7807 6.74114 10.24 7.37201 9.60912 7.37201C8.97825 7.37201 8.4375 6.76818 8.4375 6.05619C8.4375 5.37124 8.97825 4.74037 9.60912 4.74037C10.24 4.74037 10.7807 5.34421 10.7807 6.05619Z'
                                                      fill='currentColor'
                                                    />
                                                  </svg>
                                                </button>
                                                {openReactMenu === message.id && (
                                                  <div className={`flex items-center w-[12em] justify-center h-4 rounded-2xl menu-options absolute ${message.sender_id === localuser.user_id ? 'left-[-12em] top-8' : 'right-[-12em] top-8'}`}>
                                                    <div>
                                                      <button className='pr-2' onClick={() => handleReactionsMsg(event, message.id, localuser.user_id, 'Like', message.room)}><img className='w-6 hover:w-8' src='https://em-content.zobj.net/source/facebook/355/thumbs-up_1f44d.png' /></button>
                                                      <button className='pr-2' onClick={() => handleReactionsMsg(event, message.id, localuser.user_id, 'Heart', message.room)}><img className='w-6 hover:w-8' src='https://em-content.zobj.net/thumbs/60/facebook/355/smiling-cat-with-heart-eyes_1f63b.webp' /></button>
                                                      <button className='pr-2' onClick={() => handleReactionsMsg(event, message.id, localuser.user_id, 'Laugh', message.room)}><img className='w-6 hover:w-8' src='https://em-content.zobj.net/source/facebook/355/grinning-cat_1f63a.png' /></button>
                                                      <button className='pr-2' onClick={() => handleReactionsMsg(event, message.id, localuser.user_id, 'Cry', message.room)}><img className='w-6 hover:w-8' src='https://em-content.zobj.net/thumbs/60/facebook/355/crying-cat_1f63f.webp' /></button>
                                                    </div>
                                                  </div>
                                                )}
                                              </div>
                                              {openMenuId === message.id && (
                                                <div ref={buttonRef} className={` menu-options ${message.sender_id === localuser.user_id ? 'right-[100%] bottom-[10%]' : 'hidden'}`}>
                                                  {/* Opciones del menú */}
                                                  <button
                                                    className={`hover:font-bold ${localuser.user_id === message.sender_id ? '' : 'Hidden-btn'}`}
                                                    onClick={() => handleDeleteMsg(event, message.id, message.room)}
                                                    disabled={isdeleting}
                                                  >{isdeleting ? deletingState : 'Eliminar'}
                                                  </button>
                                                  <button
                                                    className={`hover:font-bold ${localuser.user_id === message.sender_id ? '' : 'Hidden-btn'}`}
                                                    onClick={() => handleUpdate(message.id)}
                                                  >
                                                    Editar
                                                  </button>
                                                </div>
                                              )}

                                            </div>
                                          </section>
                                          )}
                                      <div className='text-[0.65em] items-end justify-end flex gap-2'>
                                        <p>{formattedTime}</p>
                                        <p>✓✓</p>
                                        <p className={`edited-indicator ${message.edited === 1 ? '' : 'hidden'}`}>editado</p>
                                      </div>
                                    </div>

                                  </div>
                                  <div className='flex'>
                                    {renderReactions(message.id)}
                                  </div>
                                </div>
                              )
                            })
                        )
                      : (
                        <p className='text-black font-bold flex justify-center  bg-[#ffffffa6] rounded-3xl p-2 mt-2'>Inicia una conversación</p>
                        )}
                  </section>
                  <ChatForms event={event} issending={issending} message={message} handleSubmit={handleFormSubmit} setMessage={setMessage} selectedImage={selectedImage} setSelectedImage={setSelectedImage} setPreviewMsg={setPreviewMsg} previewMsg={previewMsg} localuser={localuser} currentchat={currentchat} />
                </div>
                {/* eslint-disable-next-line react/jsx-closing-tag-location */}
              </section>
              : (
                <section className='bg-neutral h-full flex justify-center'>
                  <div className='flex items-center  p-6 text-xl'>
                    <p className='text-white'>Clickea en una
                      <span className='font-bold text-white'> conversacion </span>
                      o
                      <span className='font-bold text-white'> contacto </span>
                      para empezar a
                      <span className='font-bold text-white'> Paws</span>
                      chatear
                    </p>
                  </div>
                </section>
                )}
          </section>
          )
        : <GroupsModule currentGroup={currentGroup} localuser={localuser} />}
    </section>
  )
}
export default ConversationModule
