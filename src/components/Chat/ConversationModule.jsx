/* eslint-disable react/prop-types */
import { BsFillSendFill } from 'react-icons/bs'
import useChatStore from '../../context/ChatStore'
import { useEffect, useState } from 'react'
import { makeRequest } from '../../library/axios'
import '../../containers/Chat/Chat.css'
import { useSocket } from '../../socket/socket'

const ConversationModule = ({ localuser, currentchat, chatContainerRef, setCurrentchat }) => {
  const {
    editingMessageId,
    setEditingMessageId,
    expandedMessageId,
    setExpandedMessageId,
    openMenuId,
    setOpenMenuId,
    openReactMenu,
    setOpenReactMenu,
    message,
    setMessage,
    editInputValue,
    setEditInputValue,
    toggleSideContactsStyle,
    toggleHamburguerStyle
  } = useChatStore()

  const [reactions, setReactions] = useState([])
  const [realtimeReactions, setRealtimeReactions] = useState([])

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
  const handleSubmit = async (event) => {
    event.preventDefault()

    // Validar si el campo de mensaje está vacío antes de enviar
    if (message.trim() === '') {
      return
    }
    try {
      const receiverId = currentchat.conversation[0].receiver_id === localuser.userId
        ? currentchat.conversation[0].sender_id
        : currentchat.conversation[0].receiver_id
      const RoomForUsers = `${Math.min(localuser.userId, receiverId)}-${Math.max(localuser.userId, receiverId)}`
      // Envía los datos al servidor para enviar un mensaje
      const response = await makeRequest.post('message/create', {
        sender_id: localuser.userId,
        receiver_id: receiverId,
        text: message,
        room: RoomForUsers
      })

      if (response.status === 200) {
        const messageId = response.data.message.id
        // Obtener la fecha y hora actual en formato ISO 8601
        const currentDateTime = new Date().toISOString()
        console.log('Mensaje enviado exitosamente')
        socket.emit('sendMessage', {
          createdAt: currentDateTime,
          edited: 0,
          id: messageId,
          receiver_id: receiverId,
          room: RoomForUsers,
          sender_id: localuser.userId,
          text: message
        })

        setMessage('')
      } else {
        window.confirm('Error al enviar el mensaje')
        console.error('Error al enviar el mensaje')
      }
    } catch (error) {
      window.confirm('Error al conectar a la api')
      console.error('Error de red:', error)
    }
  }
  // Maneja la eliminacion de un mensaje
  const handleDelete = async (event, MessageID, MesageRoom) => {
    event.preventDefault()
    try {
      const response = await makeRequest.delete(`message/delete/${MessageID}`)
      if (response.status === 200) {
        socket.emit('deleteMessage', {
          id: MessageID,
          room: MesageRoom
        })
      } else {
        window.confirm('Error al eliminar el mensaje')
        console.error('Error al eliminar el mensaje')
      }
    } catch (error) {
      window.confirm('Error al conectar a la api')
      console.error('Error de red:', error)
    }
  }

  // Manejador de envio de mensaje editado
  const handleEditKeyDown = async (event, messageRoom, messageId) => {
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
            text: editInputValue,
            edited: 1,
            room: messageRoom
          })
          setEditingMessageId(null)
        } else {
          console.error('Error al actualizar el mensaje')
        }
      } catch (error) {
        console.error('Error de red:', error)
      }
    }
  }

  // Manejador de envio de datos al estado para mandarlos por medio de handleEditKeyDown a la api
  const handleUpdate = (messageId, text) => {
    setEditingMessageId(messageId)
    setEditInputValue(text)
  }

  // Manejador de envío de reacciones a la API
  const HandleReactions = async (event, messageId, userId, reactionType, messageRoom) => {
    event.preventDefault()
    try {
      const existingReactions = await makeRequest.get(`message/find/reaction/${messageId}`)

      // Verifiac si el usuario ya ha reaccionado al mensaje
      const userReaction = existingReactions.data.reactions.find(reaction => reaction.user_id === userId)
      if (userReaction) {
        await HandleDeleteReactions(event, messageId, userId, userReaction.Reaction)
        console.log('Reacción eliminada porque ya habia reaccionado exitosamente')
      }

      const response = await makeRequest.post(`message/add-reaction/${messageId}`, {
        user_id: userId,
        Reaction: reactionType
      })

      if (response.status === 200) {
        const ReactionId = response.data.message.id
        console.log('Reacción enviada exitosamente')
        socket.emit('addReaction', {
          id: ReactionId,
          message_id: messageId,
          Reaction: reactionType,
          room: messageRoom
        })
      } else {
        console.error('Error al reaccionar al mensaje')
      }
    } catch (error) {
      console.error('Error de red:', error)
    }
  }

  // Manejador para eliminar las reacciones de la API
  const HandleDeleteReactions = async (event, messageId, userId, reactionType) => {
    event.preventDefault()
    try {
      await makeRequest.delete(`message/remove-reaction/${messageId}`, {
        user_id: userId,
        Reaction: reactionType
      })

      console.log('Reacción eliminada exitosamente')
    } catch (error) {
      console.error('Error de red:', error)
    }
  }

  // Función para formatear el texto de los mensajes, dividiéndolo en líneas y limitando su longitud
  const formatMessageText = (text, messageId) => {
    const maxWordsPerLine = 5
    const maxVisibleLines = 3

    // Dividir el texto en líneas y luego en palabras
    const lines = text.split('\n')
    const words = lines.flatMap(line => line.split(' '))

    const formattedLines = []
    let currentLine = ''

    words.forEach((word, index) => {
      if (currentLine === '') {
        currentLine = word
      } else if (currentLine.split(' ').length < maxWordsPerLine) {
        currentLine += ' ' + word
      } else {
        formattedLines.push(currentLine)
        currentLine = word
      }
    })

    if (currentLine !== '') {
      formattedLines.push(currentLine)
    }

    const visibleLines = formattedLines.slice(0, maxVisibleLines)
    const remainingLines = formattedLines.slice(maxVisibleLines)

    const isExpanded = expandedMessageId === messageId

    return (
      <>
        {visibleLines.map((line, index) => (
          <div key={index}>{line}</div>
        ))}
        {remainingLines.length > 0 && (
          <>
            {isExpanded
              ? (
                <>
                  {remainingLines.map((line, index) => (
                    <div key={index}>{line}</div>
                  ))}
                  <button className='btn-ghost' onClick={() => handleReadLess(messageId)}>
                    Leer menos
                  </button>
                </>
                )
              : (
                <button className='btn-ghost' onClick={() => handleReadMore(messageId)}>
                  Leer más
                </button>
                )}
          </>
        )}
      </>
    )
  }

  // Función para manejar la expansión o contracción de los mensajes
  const handleReadMore = (messageId) => {
    setExpandedMessageId(messageId)
  }

  // Función para manejar la contracción de los mensajes
  const handleReadLess = () => {
    setExpandedMessageId(null)
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

  useEffect(() => {
    if (socket) {
      socket.on('newMessage', (message) => {
        console.log('Este es el mensaje traído desde el servidor', message)
        console.log(currentchat)

        setCurrentchat((prevChat) => {
          // Verifica si el mensaje ya existe en la conversación actual por su ID
          const messageExists = prevChat.conversation.some((msg) => msg.id === message.id)

          if (!messageExists) {
            // Si el mensaje no existe, agrégalo a la conversación
            prevChat.conversation.unshift(message)

            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
          }

          return {
            ...prevChat,
            conversation: [...prevChat.conversation]
          }
        })
      })
      socket.on('editedMessage', (message) => {
        setCurrentchat((prevChat) => {
          // Busca el mensaje actualizado en la conversación y actualiza solo su texto
          const updatedConversation = prevChat.conversation.map((msg) =>
            msg.id === message.id ? { ...msg, text: message.text } : msg
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
        console.log('Reacción agregada en tiempo real:', newReaction)

        // Actualiza el estado con las nuevas reacciones
        setRealtimeReactions((prevReactions) => [...prevReactions, newReaction])
      })
    }
  }, [chatContainerRef, currentchat, message.id, reactions, setCurrentchat, socket])
  console.log(reactions)

  return (
    <section className='border-2 flex flex-col justify-start flex-1 h-full w-full'>

      <section className='flex w-full items-center justify-between px-2 bg-[#0D1B2A]'>
        <div className='flex'>
          <div className='flex items-center gap-2 py-4 md:gap-4 md:pt-4 md:pl-4 md:pb-4'>
            {(currentchat.conversation && currentchat.conversation.length > 0)
              ? (
                <img
                  className='w-10 h-10 md:w-14 md:h-14 rounded-full border-2 border-[#8fd370]'
                  src={currentchat.thumbnail}
                  alt={currentchat.username}
                />
                )
              : (
                <h1 className='text-white text-3xl FontTitle'>
                  Pawsplorer <span className='font-bold text-[#740db4]'> Messenger</span>
                </h1>
                )}

            <h2 className='font-bold text-lg text-white'>
              {currentchat.username}
            </h2>
          </div>
        </div>

        <label className='z-20 btn btn-sm btn-circle swap swap-rotate mr-2 md:hidden'>
          <input
            type='checkbox' className='hidden' onClick={() => {
              toggleSideContactsStyle()
              toggleHamburguerStyle()
            }}
          />

          <svg
            className='swap-off fill-current'
            xmlns='http://www.w3.org/2000/svg'
            width='24'
            height='24'
            viewBox='0 0 512 512'
          >
            <path d='M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z' />
          </svg>

          <svg
            className='swap-on fill-current'
            xmlns='http://www.w3.org/2000/svg'
            width='24'
            height='24'
            viewBox='0 0 512 512'
          >
            <polygon points='400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49' />
          </svg>
        </label>
      </section>

      {currentchat && currentchat.conversation && currentchat.conversation.length > 0
        ? <section className='h-full overflow-auto'>
          <div className='flex flex-col w-full h-full justify-end bg-[url("https://wallpapercave.com/wp/wp4410779.png")] bg-cover rounded-br-lg'>
            <section className='p-4 pb-6 overflow-auto' ref={chatContainerRef}>
              {Array.isArray(currentchat.conversation)
                ? (
                    currentchat.conversation.slice().reverse().map(message => {
                      const createdAt = message.createdAt
                      const date = new Date(createdAt)
                      // Opciones para el formato de fecha y hora
                      const options = {
                        hour: 'numeric',
                        minute: 'numeric',
                        hour12: true // Formato de 12 horas
                      }
                      const formattedTime = date.toLocaleString('en-US', options)

                      const reactionsForCurrentMessage = reactions.filter(
                        (reaction) => reaction.message_id === message.id
                      )

                      const realtimeReactionsForCurrentMessage = realtimeReactions.filter(
                        (reaction) => reaction.message_id === message.id
                      )

                      const allReactions = [...reactionsForCurrentMessage, ...realtimeReactionsForCurrentMessage]

                      const Messagereactions = allReactions.map((reaction) => reaction.Reaction)
                      return (
                        <div
                          className={`flex flex-col chat ${message.sender_id === localuser.userId ? 'chat-end' : 'chat-start'}`}
                          key={message.id}
                        >
                          <div className='chat-bubble bg-[#1B263B] text-white flex items-start text-left gap-4'>
                            <div className='message-content'>
                              {editingMessageId === message.id
                                ? <>
                                  <inputrs
                                    type='text'
                                    value={editInputValue}
                                    onChange={e => setEditInputValue(event.target.value)}
                                    onKeyDown={e => handleEditKeyDown(event, message.room, message.id)}
                                    placeholder={message.text}
                                    className='bg-[#1B263B] border-[#1B263B] text-white focus:border-[#1B263B] focus:outline-[#1B263B]'
                                  />
                                  <button className={`hover:font-bold ${localuser.userId === message.sender_id ? '' : 'Hidden-btn'}`} onClick={() => setEditingMessageId(null)}>✖</button>
                                  {/* eslint-disable-next-line react/jsx-indent */}
                                  </>
                                : (
                                  <div className={`message-text ${expandedMessageId === message.id ? 'expanded' : ''}`}>
                                    <div className='flex items-center gap-2'>
                                      <div>{message.text && formatMessageText(message.text, message.Id)}</div> {/* AQUI OJO CUIDADO */}
                                      <button className={` hidden-button bg-[#2a3d60cd] text-sm rounded-xl top-2 ${message.sender_id === localuser.userId ? '' : 'hidden'}`} onClick={() => toggleMenu(message.id)}> ⊚ </button>
                                      <button className={` hidden-button absolute bg-[#2a3d60cd] text-sm rounded-xl w-6 h-6 ${message.sender_id === localuser.userId ? 'left-[-2em] top-2' : 'right-[-2em] top-2'}`}>⤺</button>
                                      <button className={` hidden-button absolute bg-[#2a3d60cd] rounded-xl w-6 h-6 p-1 ${message.sender_id === localuser.userId ? 'left-[-4em] top-2' : 'right-[-4em] top-2'}`} onClick={() => toggleReactMenu(message.id)}>
                                        <svg viewBox='0 0 15 15' width='15' preserveAspectRatio='xMidYMid meet' className='' fill='none'>
                                          <path fillRule='evenodd' clipRule='evenodd' d='M0 7.5C0 11.6305 3.36946 15 7.5 15C11.6527 15 15 11.6305 15 7.5C15 3.36946 11.6305 0 7.5 0C3.36946 0 0 3.36946 0 7.5ZM10.995 8.69333C11.1128 8.67863 11.2219 8.66503 11.3211 8.65309C11.61 8.63028 11.8076 8.91918 11.6784 9.13965C10.8573 10.6374 9.29116 11.793 7.50455 11.793C5.71794 11.793 4.15181 10.6602 3.33072 9.16246C3.18628 8.91918 3.37634 8.63028 3.66524 8.65309C3.79123 8.66749 3.93521 8.68511 4.09426 8.70457C4.94292 8.80842 6.22074 8.96479 7.48174 8.96479C8.81855 8.96479 10.1378 8.80025 10.995 8.69333ZM5.41405 7.37207C6.05761 7.37207 6.60923 6.72851 6.60923 6.02978C6.60923 5.30348 6.05761 4.6875 5.41405 4.6875C4.77048 4.6875 4.21886 5.33106 4.21886 6.02978C4.20967 6.75609 4.77048 7.37207 5.41405 7.37207ZM10.7807 6.05619C10.7807 6.74114 10.24 7.37201 9.60912 7.37201C8.97825 7.37201 8.4375 6.76818 8.4375 6.05619C8.4375 5.37124 8.97825 4.74037 9.60912 4.74037C10.24 4.74037 10.7807 5.34421 10.7807 6.05619Z' fill='currentColor' />
                                        </svg>
                                      </button>
                                      {openReactMenu === message.id && (
                                        <div className={`flex items-center w-[12em] justify-center h-4 menu-options absolute ${message.sender_id === localuser.userId ? 'left-[-12em] top-8' : 'right-[-12em] top-8'}`}>
                                          <div>
                                            <button className='pr-2' onClick={() => HandleReactions(event, message.id, localuser.userId, 'Like', message.room)}><img className='w-6 hover:w-8' src='https://cdn-icons-png.flaticon.com/512/487/487535.png' /></button>
                                            <button className='pr-2' onClick={() => HandleReactions(event, message.id, localuser.userId, 'Heart', message.room)}><img className='w-6 hover:w-8' src='https://cdn-icons-png.flaticon.com/512/9717/9717576.png' /></button>
                                            <button className='pr-2' onClick={() => HandleReactions(event, message.id, localuser.userId, 'Laugh', message.room)}><img className='w-6 hover:w-8' src='https://cdn-icons-png.flaticon.com/512/8976/8976336.png ' /></button>
                                            <button className='pr-2' onClick={() => HandleReactions(event, message.id, localuser.userId, 'Cry', message.room)}><img className='w-6 hover:w-8' src='https://cdn-icons-png.flaticon.com/512/9717/9717728.png' /></button>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                    {openMenuId === message.id && (
                                      <div className={` menu-options ${message.sender_id === localuser.userId ? 'right-[100%] bottom-[10%]' : 'hidden'}`}>
                                        {/* Opciones del menú */}
                                        <button className={`hover:font-bold ${localuser.userId === message.sender_id ? '' : 'Hidden-btn'}`} onClick={() => handleDelete(event, message.id, message.room)}>Eliminar</button>
                                        <button className={`hover:font-bold ${localuser.userId === message.sender_id ? '' : 'Hidden-btn'}`} onClick={() => handleUpdate(message.id)}>Editar</button>
                                      </div>
                                    )}

                                  </div>
                                  )}
                              <div className='text-[0.65em] items-end justify-end flex gap-2'>
                                <p>{formattedTime}</p>
                                <p>✓✓</p>
                                <p className={`edited-indicator ${message.edited === 1 ? '' : 'hidden'}`}>editado</p>
                              </div>
                            </div>

                          </div>
                          <div className={`bg-[#2a3d60cd] rounded-3xl p-[0.1em] relative top-[-0.5em] ${message.sender_id === localuser.userId ? 'left-[-0.2em]' : 'right-[-0.2em]'}`}>
                            {Messagereactions.map((reaction, index, array) => {
                              // Verifica si la reacción es duplicada
                              const isDuplicated = array.indexOf(reaction) !== index

                              // Si la reacción es duplicada, no la mostramos
                              if (isDuplicated) {
                                return null
                              }

                              // Verifica si hay más de una instancia de esta reacción
                              const duplicates = array.filter((r) => r === reaction)

                              // Si hay más de una instancia, agrega 'x2'
                              const renderedReaction = duplicates.length > 1 ? `${reaction}x2` : reaction

                              return (
                                <span key={index} className='mr-2'>
                                  {renderedReaction}
                                </span>
                              )
                            })}
                          </div>

                        </div>
                      )
                    })
                  )
                : (
                  <p className='text-black font-bold'>Inicia una conversación</p>
                  )}
            </section>

            <form className='p-4 pb-4 flex gap-4 w-full items-center'>
              <input
                type='text'
                placeholder='Mensaje'
                className='input bg-white text-black rounded-md w-full placeholder:font-semibold'
                value={message}
                minLength={10}
                maxLength={500}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button
                className='btn btn-ghost'
                onClick={handleSubmit}
              >
                <BsFillSendFill className='text-[#0D1B2A] text-xl' />
              </button>
            </form>
          </div>
          {/* eslint-disable-next-line react/jsx-closing-tag-location */}
        </section>
        : (
          <section className='bg-[#0D1B2A] h-full flex justify-center'>
            <div className='flex items-center p-6 text-xl'>
              <p className='text-white'>Clickea en una
                <span className='font-bold text-[#740db4]'> conversacion </span>
                o
                <span className='font-bold text-[#740db4]'> contacto </span>
                para empezar a
                <span className='font-bold text-[#740db4]'> Paws</span>
                chatear
              </p>
            </div>
          </section>
          )}
    </section>
  )
}
export default ConversationModule
