// Importación de librerías y componentes necesarios
import { useEffect, useState, useRef } from 'react'
import {
  BsFillChatDotsFill,
  BsFillPeopleFill,
  BsFillDoorOpenFill,
  BsPersonFillAdd,
  BsFillSendFill
} from 'react-icons/bs'
import { Link } from '@tanstack/router'
import useChatStore from '../../context/ChatStore'
import { makeRequest } from '../../library/axios'
import './Chat.css'

// Componente principal Chat
const Chat = () => {
  // Extracción de funciones y estados del contexto
  const {
    sideContactsStyle,
    toggleSideContactsStyle,
    toggleHamburguerStyle
  } = useChatStore()

  // Estados para manejar los datos de la conversación y los mensajes
  const [allchats, setAllchats] = useState([])
  // Estado para almacenar los datos del usuario logueado
  const [localuser, setLocaluser] = useState([])
  // Estado para controlar los usuarios de la api
  const [users, setUsers] = useState([])
  // Estado para controlar el chat actualmente abierto
  const [currentchat, setCurrentchat] = useState([])
  // Estado para controlar el formulario de envio de mensajes
  const [message, setMessage] = useState('')
  // Estado para controlar la posicion de la barra vertical
  const chatContainerRef = useRef(null)
  // Estado para controlar el mensaje expandido por su id
  const [expandedMessageId, setExpandedMessageId] = useState(null)

  // useEffect para obtener y configurar los datos del usuario local
  useEffect(() => {
    if (localStorage.getItem('user')) {
      const user = JSON.parse(localStorage.getItem('user'))
      setLocaluser(user)
    }
  }, [setLocaluser])

  // useEffect para ajustar el scrollTop y mantener la barra al final del chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [currentchat.conversation])

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
          setAllchats(chats)

          // Crear un objeto para agrupar los mensajes por conversación
          const conversationMap = {}

          // Iterar a través de los mensajes y agruparlos en el objeto
          chats.forEach((chat) => {
            const conversationKey = `${Math.min(
              chat.sender_id,
              chat.receiver_id
            )}-${Math.max(chat.sender_id, chat.receiver_id)}`

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
        }
      } catch (error) {
        console.log('error:', error)
      }
    }

    fetchAllChats()
  }, [localuser.userId, allchats])

  // Función para cargar los mensajes de una conversación
  const loadConversationMessages = (conversation) => {
    setCurrentchat(conversation)
  }
  // Maneja el envío del formulario
  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      const receiverId = currentchat.conversation[0].receiver_id === localuser.userId
        ? currentchat.conversation[0].sender_id
        : currentchat.conversation[0].receiver_id

      // Envía los datos al servidor para enviar un mensaje
      const response = await makeRequest.post('message/create', {
        sender_id: localuser.userId,
        receiver_id: receiverId,
        text: message
      })

      if (response.status === 200) {
        console.log('Mensaje enviado exitosamente')
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

  // Función para formatear el texto de los mensajes, dividiéndolo en líneas y limitando su longitud
  const formatMessageText = (text, messageId) => {
    const maxWordsPerLine = 8
    const maxVisibleLines = 3

    // Dividir el texto en palabras y preparar variables para el formateo
    const words = text.split(' ')
    const lines = []
    let currentLine = ''
    let lineWordCount = 0

    // Iterar a través de las palabras para formatear el texto en líneas
    for (const word of words) {
      if (lineWordCount + 1 + word.split('\n').length - 1 <= maxWordsPerLine) {
        currentLine += (currentLine.length > 0 ? ' ' : '') + word
        lineWordCount += word.split('\n').length
      } else {
        lines.push(currentLine)
        currentLine = word
        lineWordCount = word.split('\n').length
      }
    }

    if (currentLine.length > 0) {
      lines.push(currentLine)
    }

    // Dividir las líneas en líneas visibles y líneas restantes
    const visibleLines = lines.slice(0, maxVisibleLines)
    const remainingLines = lines.slice(maxVisibleLines)

    // Verificar si el mensaje está expandido
    const isExpanded = expandedMessageId === messageId

    return (
      <>
        {visibleLines.map((line, index) => (
          <div key={index} dangerouslySetInnerHTML={{ __html: line }} />
        ))}
        {remainingLines.length > 0 && (
          <>
            {isExpanded
              ? (
                <>
                  {remainingLines.map((line, index) => (
                    <div key={index} dangerouslySetInnerHTML={{ __html: line }} />
                  ))}
                  <button
                    className='btn-ghost'
                    onClick={() => handleReadMore(messageId)}
                  >
                    Leer menos
                  </button>
                </>
                )
              : (
                <button
                  className='btn-ghost'
                  onClick={() => handleReadMore(messageId)}
                >
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
    if (expandedMessageId === messageId) {
      setExpandedMessageId(null)
    } else {
      setExpandedMessageId(messageId)
    }
  }

  // Sección principal del componente Chat
  return (
    <section className='h-[100vh] flex w-full container'>
      {/* Panel lateral izquierdo en pantallas medianas y grandes */}
      <section className='hidden w-40 h-full border-r-2 bg-[#1B263B] md:flex flex-col justify-between items-center gap-18 p-4 py-8'>
        <h1 className='font-bold text-white text-xl'>PawsPlorer Messenger</h1>
        <ul className='flex flex-col items-center justify-center gap-8'>

          {/* Botones de íconos */}
          <li>
            <Link className='btn btn-ghost'>
              <BsFillChatDotsFill className='text-white text-2xl' />
            </Link>
          </li>
          <li>
            <Link className='btn btn-ghost'>
              <BsFillPeopleFill className='text-white text-2xl' />
            </Link>
          </li>
          <li>
            <Link to='/home' className='btn btn-ghost'>
              <BsFillDoorOpenFill className='text-white text-2xl' />
            </Link>
          </li>
        </ul>

        {/* Botón con imagen de perfil */}
        <button>
          <img
            className='w-10 h-10 rounded-full'
            src={localuser.profilePicture}
          />
        </button>
      </section>

      {/* Panel lateral izquierdo en pantallas pequeñas */}
      <section className='hidden md:w-60 lg:w-80 h-full bg-white md:flex flex-col justify-start items-center gap-18 p-4 py-8 pt-6'>
        {/* Título y botones */}
        <ul className='w-full flex flex-wrap items-center justify-around pb-2'>
          <li>
            <h2 className='font-bold text-slate-800 text-xl'>Conversations</h2>
          </li>
          <li>
            <button className='btn btn-ghost'>
              <BsPersonFillAdd className='text-slate-800 text-2xl' />
            </button>
          </li>
        </ul>

        {/* Búsqueda de conversaciones */}
        <input
          type='text'
          placeholder='Buscar conversación'
          className='input bg-gray-100 text-black rounded-md mt-4 w-full max-w-2xl placeholder:font-semibold'
        />

        {/* Lista de conversaciones */}
        <ul className='flex flex-col w-full items-center justify-center gap-4 pt-8'>
          {allchats.map(conversation => {
            // Obtén la información del último mensaje en la conversación
            const lastMessage = conversation[0]

            // Determinar el ID del otro usuario en la conversación
            let otherUserId
            if (lastMessage.receiver_id === localuser.userId) {
              otherUserId = lastMessage.sender_id
            } else if (lastMessage.sender_id === localuser.userId) {
              otherUserId = lastMessage.receiver_id
            }

            // Busca la información del otro usuario por su ID
            const otherUser = users.find(user => user.user_id === otherUserId)

            // Limitar el nombre de usuario a 30 caracteres
            const limitedUsername = otherUser ? otherUser.username.substring(0, 30) : ''

            // Limitar el mensaje a 30 caracteres y añadir puntos suspensivos
            const limitedMessage = lastMessage.text.length > 10 ? lastMessage.text.substring(0, 30) + '...' : lastMessage.text

            return (
              <li className='w-full' key={lastMessage.id}>
                <button
                  className='btn-ghost p-2 rounded-lg w-full flex justify-left gap-2' onClick={() => {
                    toggleSideContactsStyle()
                    toggleHamburguerStyle()
                    loadConversationMessages({
                      conversation,
                      username: limitedUsername,
                      thumbnail: otherUser ? otherUser.thumbnail : ''
                    })
                  }}
                >
                  <div className='text-black'>
                    <img className='w-12 h-12 rounded-full' src={otherUser ? otherUser.thumbnail : ''} />
                  </div>
                  <div className='flex flex-col items-start justify-center'>
                    <div className='text-black font-bold text-md'>{limitedUsername}</div>
                    <div className='text-black text-sm'>{limitedMessage}</div>
                  </div>
                </button>
              </li>
            )
          })}
        </ul>
      </section>

      {/* mobile menu */}

      <section className={`z-10 md:hidden w-full   h-full bg-white flex flex-col justify-start items-center gap-18 p-4 ${sideContactsStyle} transition-transform`}>
        {/* Título y botones en menú móvil */}
        <ul className='w-full flex flex-wrap items-center justify-start pb-2 gap-4'>
          <li>
            <h2 className='font-bold text-slate-800 text-xl'>Conversations</h2>
          </li>
          <li>
            <button className='btn btn-ghost'>
              <BsPersonFillAdd className='text-slate-800 text-2xl' />
            </button>
          </li>
        </ul>

        {/* Búsqueda de conversaciones en menú móvil */}
        <section className='w-full h-[80%]'>
          <input
            type='text'
            placeholder='Buscar conversación'
            className='input bg-gray-100 text-black rounded-md mt-4 w-full max-w-2xl placeholder:font-semibold'
          />

          {/* Lista de conversaciones en menú móvil */}
          <ul className='flex flex-col w-full items-center justify-center gap-4 pt-8'>
            {allchats.map(conversation => {
            // Obtén la información del último mensaje en la conversación
              const lastMessage = conversation[0]

              // Determinar el ID del otro usuario en la conversación
              let otherUserId
              if (lastMessage.receiver_id === localuser.userId) {
                otherUserId = lastMessage.sender_id
              } else if (lastMessage.sender_id === localuser.userId) {
                otherUserId = lastMessage.receiver_id
              }

              // Busca la información del otro usuario por su ID
              const otherUser = users.find(user => user.user_id === otherUserId)

              // Limitar el nombre de usuario a 30 caracteres
              const limitedUsername = otherUser ? otherUser.username.substring(0, 30) : ''

              // Limitar el mensaje a 30 caracteres y añadir puntos suspensivos
              const limitedMessage = lastMessage.text.length > 10 ? lastMessage.text.substring(0, 30) + '...' : lastMessage.text

              return (
                <li className='w-full' key={lastMessage.id}>
                  <button
                    className='btn-ghost p-2 rounded-lg w-full flex justify-left gap-2' onClick={() => {
                      toggleSideContactsStyle()
                      toggleHamburguerStyle()
                      loadConversationMessages({
                        conversation,
                        username: limitedUsername,
                        thumbnail: otherUser ? otherUser.thumbnail : ''
                      })
                    }}
                  >
                    <div className='text-black'>
                      <img className='w-12 h-12 rounded-full' src={otherUser ? otherUser.thumbnail : ''} />
                    </div>
                    <div className='flex flex-col items-start justify-center'>
                      <div className='text-black font-bold text-md'>{limitedUsername}</div>
                      <div className='text-black text-sm'>{limitedMessage}</div>
                    </div>
                  </button>
                </li>
              )
            })}
          </ul>
        </section>

        {/* Sección final con botones en menú móvil */}
        <section className=' w-full bg-[#1B263B] flex flex-col justify-between items-center justify-self-end gap-4 p-4 rounded-lg'>
          <h1 className='font-bold text-white text-xl'>PawsPlorer Messenger</h1>
          <ul className='flex flex-row items-center justify-center'>

            {/* Botones de íconos en menú móvil */}
            <li>
              <Link className='btn btn-ghost'>
                <BsFillChatDotsFill className='text-white text-2xl' />
              </Link>
            </li>
            <li>
              <Link className='btn btn-ghost'>
                <BsFillPeopleFill className='text-white text-2xl' />
              </Link>
            </li>
            <li>
              <Link to='/home' className='btn btn-ghost'>
                <BsFillDoorOpenFill className='text-white text-2xl' />
              </Link>
            </li>
            <li>
              <button className='btn btn-ghost'>
                <img
                  className='w-10 h-10 rounded-full'
                  src={localuser.profilePicture}
                />
              </button>
            </li>
          </ul>
        </section>
      </section>

      {/* Sección de conversación principal */}
      <section className='border-2 flex flex-col justify-start flex-1 h-full w-full'>

        {/* Encabezado de la conversación */}
        <section className='flex w-full items-center justify-between px-2 bg-white md:rounded-tr-lg'>
          <div className='flex'>
            <div className='flex items-center gap-2 py-4 md:gap-4 md:pt-4 md:pl-4 md:pb-4'>
              <img
                className='w-10 h-10 md:w-14 md:h-14 rounded-full border-2 border-[#8fd370]'
                src={currentchat.thumbnail}
                alt={currentchat.username}
              />
              <h2 className='font-bold text-lg text-black'>
                {currentchat.username}
              </h2>
            </div>
          </div>

          {/* Control de menú lateral en modo móvil */}
          <label className='z-20 btn btn-sm btn-circle swap swap-rotate mr-2 md:hidden'>
            {/* Checkbox oculto que controla el estado */}
            <input
              type='checkbox' className='hidden' onClick={() => {
                toggleSideContactsStyle()
                toggleHamburguerStyle()
              }}
            />

            {/* hamburger icon */}
            <svg
              className='swap-off fill-current'
              xmlns='http://www.w3.org/2000/svg'
              width='24'
              height='24'
              viewBox='0 0 512 512'
            >
              <path d='M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z' />
            </svg>

            {/* close icon */}
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

        {/* Contenido de la conversación */}
        <section className='h-full overflow-auto'>
          <div className='flex flex-col w-full h-full justify-end bg-[url("https://wallpapercave.com/wp/wp4410779.png")] bg-cover rounded-br-lg'>

            {/* Mensajes de la conversación */}
            <section className='p-4 pb-6 overflow-auto' ref={chatContainerRef}>

              {/* Mapeo de mensajes */}
              {Array.isArray(currentchat.conversation)
                ? (
                    currentchat.conversation.slice().reverse().map(message => (
                      <div
                        className={`chat ${message.sender_id === localuser.userId ? 'chat-end' : 'chat-start'}`}
                        key={message.id}
                      >
                        <div className='chat-bubble bg-[#1B263B] text-white flex items-start text-left gap-2'>
                          <div className='message-content'>
                            <div className={`message-text ${expandedMessageId === message.id ? 'expanded' : ''}`}>
                              {formatMessageText(message.text, message.id)}
                            </div>
                          </div>
                          <button> ᐁ </button>
                        </div>
                      </div>
                    ))
                  )
                : (
                  <p className='text-black font-bold'>Inicia una conversación</p>
                  )}
            </section>

            {/* Formulario de envío de mensaje */}
            <form className='p-4 pb-4 flex gap-4 items-center'>
              <input
                type='text'
                placeholder='Mensaje'
                className='input bg-white text-black rounded-md w-full max-w-2xl placeholder:font-semibold'
                value={message}
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
        </section>
      </section>
    </section>
  )
}

export default Chat
