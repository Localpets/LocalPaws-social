/* eslint-disable react/prop-types */
import { BsFillSendFill, BsClock } from 'react-icons/bs'
import useChatStore from '../../context/ChatStore'
import { useEffect, useState, useRef } from 'react'
import { makeRequest } from '../../library/axios'
import { useSocket } from '../../socket/socket'
import '../../containers/Chat/Chat.css'

const ConversationModule = ({ localuser, currentchat, chatContainerRef, setCurrentchat }) => {
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
  const [issending, setIssending] = useState(false)
  const [expandedMessages, setExpandedMessages] = useState({})
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
  const handleSubmit = async (event) => {
    event.preventDefault()
    setIssending(true)

    // Validar si el campo de mensaje está vacío antes de enviar
    if (message.trim() === '') {
      return
    }
    try {
      const receiverId = currentchat.conversation[0].receiver_id === localuser.user_id
        ? currentchat.conversation[0].sender_id
        : currentchat.conversation[0].receiver_id
      const RoomForUsers = `${Math.min(localuser.user_id, receiverId)}-${Math.max(localuser.user_id, receiverId)}`
      // Envía los datos al servidor para enviar un mensaje
      const response = await makeRequest.post('message/create', {
        sender_id: localuser.user_id,
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
          sender_id: localuser.user_id,
          text: message
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
  // Maneja la eliminacion de un mensaje
  const handleDelete = async (event, MessageID, MesageRoom) => {
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

  // Manejador de envio de mensaje editado
  const handleEditKeyDown = async (event, messageRoom, messageId, userId, receiverId, createdAt) => {
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
            user_id: userId,
            receiver_id: receiverId,
            text: editInputValue,
            edited: 1,
            room: messageRoom,
            createdAt
          })
          setEditingMessageId(null)
          setOpenMenuId(null)
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

  const HandleReactions = async (event, messageId, userId, reactionType, messageRoom) => {
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

  // Función para formatear el texto de los mensajes, dividiéndolo en líneas y limitando su longitud
  const formatMessageText = (text, messageId) => {
    const maxWordsPerLine = 15
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

    const isExpanded = expandedMessages[messageId] === true

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

  const handleReadMore = (messageId) => {
    console.log('Expandiendo mensaje:', messageId)
    setExpandedMessages((prevExpandedMessages) => ({
      ...prevExpandedMessages,
      [messageId]: true // Marcar como expandido
    }))
  }

  const handleReadLess = (messageId) => {
    console.log('Colapsando mensaje:', messageId)
    setExpandedMessages((prevExpandedMessages) => {
      const updatedExpandedMessages = { ...prevExpandedMessages }
      delete updatedExpandedMessages[messageId] // Marcar como no expandido
      return updatedExpandedMessages
    })
  }

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
        <div key={reactionType} className={`bg-[#2a3d60cd] rounded-3xl p-[0.3em] flex gap-1 relative top-[-0.5em] ${message === localuser.user_id ? 'left-[-0.2em]' : 'right-[-0.2em]'}`}>
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

  useEffect(() => {
    if (socket) {
      socket.on('newMessage', (message) => {
        if (currentchat) {
          setCurrentchat((prevChat) => {
            if (!prevChat || !prevChat.conversation || !Array.isArray(prevChat.conversation)) {
              // Si prevChat no está definido, conversation no está definido o no es un array válido, inicializa prevChat adecuadamente
              prevChat = {
                ...prevChat, // Copia las propiedades existentes de prevChat (si las hay)
                conversation: [] // Inicializa conversation como un array vacío
              }
            }
            console.log('Prevchat es', prevChat.conversation, 'y currenchat es', currentchat)

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
  }, [chatContainerRef, currentchat, message.id, reactions, setCurrentchat, socket])
  return (
    <section className='border-2 flex flex-col justify-start flex-1 h-full w-full'>

      <section className='flex w-full items-center justify-between px-2 bg-[#0D1B2A]'>
        <div className='flex'>
          <div className='flex items-center gap-2 py-4 md:gap-4 md:pt-4 md:pl-4 md:pb-4'>
            {currentchat.conversation
              ? (
                <img
                  className='w-10 h-10 md:w-14 md:h-14 rounded-full'
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

      {currentchat && currentchat.conversation
        ? <section className='h-full overflow-auto'>

          <div className='flex flex-col w-full h-full justify-end bg-[url("https://th.bing.com/th/id/R.1ea0ebcbf8c6694d32ee696a9b2d6ebf?rik=ybM99YoaAJuoLg&pid=ImgRaw&r=0")] bg-cover rounded-br-lg'>
            <section className='p-4 pb-6 overflow-auto' ref={chatContainerRef}>
              <div className='flex justify-center text-lg text-[#1B263B]'>
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
                            <div className='chat-bubble bg-[#1B263B] text-white flex items-start text-left gap-4'>
                              <div className='message-content'>
                                {editingMessageId === message.id
                                  ? <>
                                    <input
                                      type='text'
                                      value={editInputValue}
                                      onChange={e => setEditInputValue(event.target.value)}
                                      onKeyDown={e => handleEditKeyDown(event, message.room, message.id, message.sender_id, message.receiver_id, message.createdAt)}
                                      placeholder={message.text}
                                      className='bg-[#1B263B] border-[#1B263B] text-white focus:border-[#1B263B] focus:outline-[#1B263B]'
                                    />
                                    <button className={`hover:font-bold ${localuser.user_id === message.sender_id ? '' : 'Hidden-btn'}`} onClick={() => setEditingMessageId(null)}>✖</button>
                                    {/* eslint-disable-next-line react/jsx-indent */}
                                    </>
                                  : (
                                    <div className={`message-text ${expandedMessageId === message.id ? 'expanded' : ''}`}>
                                      <div className='flex items-center gap-2'>
                                        <div>{message.text && formatMessageText(message.text, message.id)}</div>
                                        <button
                                          ref={buttonRef}
                                          className={` hidden-button bg-[#2a3d60cd] text-sm rounded-xl top-2 ${message.sender_id === localuser.user_id ? '' : 'hidden'}`}
                                          onClick={() => toggleMenu(message.id)}
                                        > ⊚
                                        </button>
                                        <button
                                          className={` hidden-button absolute bg-[#2a3d60cd] text-sm rounded-xl w-6 h-6 ${message.sender_id === localuser.user_id ? 'left-[-2em] top-2' : 'right-[-2em] top-2'}`}
                                        >⤺
                                        </button>
                                        <button
                                          className={` hidden-button absolute bg-[#2a3d60cd] rounded-xl w-6 h-6 p-1 ${message.sender_id === localuser.user_id ? 'left-[-4em] top-2' : 'right-[-4em] top-2'}`}
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
                                              <button className='pr-2' onClick={() => HandleReactions(event, message.id, localuser.user_id, 'Like', message.room)}><img className='w-6 hover:w-8' src='https://em-content.zobj.net/source/facebook/355/thumbs-up_1f44d.png' /></button>
                                              <button className='pr-2' onClick={() => HandleReactions(event, message.id, localuser.user_id, 'Heart', message.room)}><img className='w-6 hover:w-8' src='https://em-content.zobj.net/thumbs/60/facebook/355/smiling-cat-with-heart-eyes_1f63b.webp' /></button>
                                              <button className='pr-2' onClick={() => HandleReactions(event, message.id, localuser.user_id, 'Laugh', message.room)}><img className='w-6 hover:w-8' src='https://em-content.zobj.net/source/facebook/355/grinning-cat_1f63a.png' /></button>
                                              <button className='pr-2' onClick={() => HandleReactions(event, message.id, localuser.user_id, 'Cry', message.room)}><img className='w-6 hover:w-8' src='https://em-content.zobj.net/thumbs/60/facebook/355/crying-cat_1f63f.webp' /></button>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                      {openMenuId === message.id && (
                                        <div ref={buttonRef} className={` menu-options ${message.sender_id === localuser.user_id ? 'right-[100%] bottom-[10%]' : 'hidden'}`}>
                                          {/* Opciones del menú */}
                                          <button
                                            className={`hover:font-bold ${localuser.user_id === message.sender_id ? '' : 'Hidden-btn'}`}
                                            onClick={() => handleDelete(event, message.id, message.room)}
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

            <form className='p-4 pb-4 flex w-full items-center'>
              <div className='mr-5 h-10'>
                <label htmlFor='image' className='badge rounded-lg cursor-pointer flex gap-2 h-full mx-auto bg-[#0D1B2A] hover:bg-[#2a3d60cd] text-white border-[#0D1B2A] ml-2'>
                  <i className='fa-solid fa-image' />
                </label>
                <input
                  type='file'
                  name='image'
                  id='image'
                  accept='image/*'
                  placeholder='Selecciona una imagen'
                  className='hidden'
                />
              </div>
              <input
                id='SubmitChat'
                type='text'
                placeholder='Mensaje'
                className='input bg-white text-black rounded-md w-full placeholder:font-semibold'
                value={message}
                minLength={10}
                maxLength={200}
                disabled={issending}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button
                className='btn btn-ghost'
                onClick={handleSubmit}
              >
                <BsFillSendFill className='text-[#0D1B2A] text-xl hover:text-[#2a3d60cd]' />
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
