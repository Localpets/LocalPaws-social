// Importación de librerías y componentes necesarios
import { useEffect, useState, useRef } from 'react'
import { io } from 'socket.io-client'
import {
  BsFillChatDotsFill,
  BsFillPeopleFill,
  BsFillDoorOpenFill,
  BsPersonFillAdd
} from 'react-icons/bs'
import { Link } from '@tanstack/router'
import useChatStore from '../../context/ChatStore'
import ConversationModule from '../../components/Chat/ConversationModule'
import ConversationButton from '../../components/Chat/ConversationButton'
import './Chat.css'

// Componente principal Chat
const Chat = () => {
  // Extracción de funciones y estados del contexto
  const {
    sideContactsStyle,
    localuser,
    setLocaluser
  } = useChatStore()

  // Estado para almacenar el texto de la busqueda
  const [searchText, setSearchText] = useState('')
  // Estado para almacenar la instancia del socket
  const [socket, setSocket] = useState(null)
  // Estado para almacenar la conversacion actual
  const [currentchat, setCurrentchat] = useState([])
  // Estado para controlar la posicion de la barra vertical
  const chatContainerRef = useRef(null)

  // useEffect para crear la instancia del Socket al renderizar el componente y desconectarlo al desrenderizar
  useEffect(() => {
    const newSocket = io('http://localhost:8080')
    setSocket(newSocket)

    return () => {
      // Desconecta el socket cuando el componente se desmonte
      newSocket.disconnect()
    }
  }, [])

  useEffect(() => {
    if (socket) {
      socket.on('newMessage', (message) => {
        setCurrentchat((prevChat) => {
          // Verifica si el mensaje ya existe en la conversación actual por su ID
          const messageExists = prevChat.conversation.some((msg) => msg.id === message.id)

          if (!messageExists) {
            // Si el mensaje no existe, agrégalo a la conversación
            prevChat.conversation.unshift(message)

            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
          }

          return {
            ...prevChat
          }
        })
      })

      socket.on('messageUpdated', (updatedMessage) => {
        setCurrentchat((prevChat) => {
          // Busca el mensaje actualizado en la conversación y actualízalo
          const updatedConversation = prevChat.conversation.map((msg) =>
            msg.id === updatedMessage.id ? updatedMessage : msg
          )

          return {
            ...prevChat,
            conversation: updatedConversation
          }
        })
      })

      socket.on('messageDeleted', (deletedMessageId) => {
        setCurrentchat((prevChat) => {
          // Filtra los mensajes para eliminar el mensaje con el ID especificado
          const filteredConversation = prevChat.conversation.filter(
            (msg) => msg.id !== deletedMessageId
          )

          return {
            ...prevChat,
            conversation: filteredConversation
          }
        })
      })

      socket.on('reactionAdded', (updatedMessage) => {
        setCurrentchat((prevChat) => {
          // Busca el mensaje al que se agregó la reacción y actualízalo
          const updatedConversation = prevChat.conversation.map((msg) =>
            msg.id === updatedMessage.id ? updatedMessage : msg
          )

          return {
            ...prevChat,
            conversation: updatedConversation
          }
        })
      })

      socket.on('reactionRemoved', ({ messageId, userId }) => {
        setCurrentchat((prevChat) => {
          // Busca el mensaje del que se eliminó la reacción y actualízalo
          const updatedConversation = prevChat.conversation.map((msg) => {
            if (msg.id === messageId) {
              // Filtra las reacciones para eliminar la del usuario específico
              msg.reactions = msg.reactions.filter((reaction) => reaction.userId !== userId)
            }
            return msg
          })

          return {
            ...prevChat,
            conversation: updatedConversation
          }
        })
      })
    }
  }, [socket, setCurrentchat])

  // useEffect para obtener y configurar los datos del usuario local
  useEffect(() => {
    if (localStorage.getItem('user')) {
      const user = JSON.parse(localStorage.getItem('user'))
      setLocaluser(user)
      console.log(user)
    }
  }, [setLocaluser])

  const handleSearch = (event) => {
    setSearchText(event.target.value)
  }

  // Sección principal del componente Chat
  return (
    <section className='h-[100vh] flex w-full'>
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
        <Link to='/profile'>
          <img
            className='w-10 h-10 rounded-full'
            src={localuser.profilePicture}
          />
        </Link>
      </section>

      {/* Panel lateral izquierdo en pantallas pequeñas */}
      <section className='hidden md:w-60 lg:w-80 h-full bg-white md:flex flex-col justify-start items-center gap-18 p-4 py-8 pt-6'>
        {/* Título y botones */}
        <ul className='w-full flex flex-wrap items-center justify-around pb-2'>
          <li>
            <h2 className='font-bold text-slate-800 text-xl'>PawsChatea</h2>
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
          value={searchText}
          onChange={handleSearch}
        />

        {/* Lista de conversaciones */}
        <ConversationButton localuser={localuser} currentchat={currentchat} setCurrentchat={setCurrentchat} />
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
            value={searchText}
            onChange={handleSearch}
          />

          {/* Lista de conversaciones en menú móvil */}
          <ConversationButton localuser={localuser} currentchat={currentchat} setCurrentchat={setCurrentchat} />
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
              <Link to='/profile' className='btn btn-ghost'>
                <img
                  className='w-10 h-10 rounded-full'
                  src={localuser.profilePicture}
                />
              </Link>
            </li>
          </ul>
        </section>
      </section>
      {currentchat && (
        <ConversationModule
          currentchat={currentchat}
          localuser={{
            userId: localuser.userId
          }}
          chatContainerRef={chatContainerRef}
        />
      )}
    </section>
  )
}

export default Chat
