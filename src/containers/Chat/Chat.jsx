// Importación de librerías y componentes necesarios
import { useEffect, useState, useRef } from 'react'
import {
  BsFillChatDotsFill,
  BsFillPeopleFill,
  BsFillDoorOpenFill,
  BsChatFill
} from 'react-icons/bs'
import { FaUserFriends } from 'react-icons/fa'
import { HiUserGroup } from 'react-icons/hi'
import { Link } from '@tanstack/router'
import useChatStore from '../../context/ChatStore'
import ConversationModule from '../../components/Chat/ConversationModule'
import ConversationButton from '../../components/Chat/ConversationButton'
import ContactsView from '../../components/Chat/ContacsView'
import useAuthStore from '../../context/AuthContext'
import useFindUser from '../../hooks/useFindUser'
import { useSocket } from '../../socket/socket'
import './Chat.css'
import GroupsView from '../../components/Chat/GroupsComponent/GroupsView'

// Componente principal Chat
const Chat = () => {
  const [currentchat, setCurrentchat] = useState([])
  const [currentGroup, setCurrentgroup] = useState([])
  const [isGroup, setIsGroup] = useState(false)
  const chatContainerRef = useRef(null)
  const [showContacts, setShowContacts] = useState(false)
  const [showGroups, setShowGroups] = useState(false)
  const [createGroups, setCreateGroups] = useState(false)
  const [localuser, setLocaluser] = useState([])

  const { loggedUser } = useAuthStore()
  const { user } = useFindUser(loggedUser)

  useEffect(() => {
    if (user) {
      setLocaluser(user)
    }
  }, [user])

  const socket = useSocket()

  // Extracción de funciones y estados del contexto
  const {
    sideContactsStyle
  } = useChatStore()

  const handleShowContactsClick = () => {
    setShowContacts(false)
  }

  const handleUpdateContacs = () => {
    if (socket) {
      socket.emit('updateContacs', (localuser.user_id))
    }
  }

  const handleleaveRooms = () => {
    socket.emit('leaveAllRooms', (localuser.user_id))
  }

  // Sección principal del componente Chat
  return (
    <section className='h-[100vh] flex w-full'>
      {/* Panel lateral izquierdo en pantallas medianas y grandes */}
      <section className={`hidden h-full border-r-2 bg-neutral flex-col justify-between items-center gap-18 p-4 py-8 ${createGroups ? 'md:hidden' : 'md:flex w-40'}`}>
        <h1 className='font-bold text-white text-center text-xl'>PawsPlorer Messenger</h1>
        <ul className='flex flex-col items-center justify-center gap-8'>

          {/* Botones de íconos */}
          <li>
            <button
              className='btn btn-ghost'
              onClick={() => {
                setShowContacts(false)
                setShowGroups(false)
              }}
            >
              <BsFillChatDotsFill className='text-white text-2xl' />
            </button>
          </li>
          <li>
            <button
              className='btn btn-ghost'
              onClick={() => {
                setShowContacts(true)
                setShowGroups(false)
                handleUpdateContacs()
              }}
            >
              <BsFillPeopleFill className='text-white text-2xl' />
            </button>
          </li>
          <li>
            <button
              className='btn btn-ghost'
              onClick={() => {
                setShowGroups(true)
                setShowContacts(false)
              }}
            >
              <HiUserGroup className='text-white text-2xl' />
            </button>
          </li>
          <li>
            <Link
              to='/home' className='btn btn-ghost'
              onClick={handleleaveRooms}
            >
              <BsFillDoorOpenFill className='text-white text-2xl' />
            </Link>
          </li>
        </ul>

        {/* Botón con imagen de perfil */}
        <Link
          to={`/profile/${localuser.user_id}`} className='btn mb-3 btn-ghost flex items-center justify-start'
          onClick={handleleaveRooms}
        >
          <img
            className='w-10 h-10 rounded-full'
            src={user?.thumbnail || 'https://i.imgur.com/HeIi0wU.png'}
            alt='user-thumbnail'
          />
        </Link>
      </section>

      {showContacts
        ? (
          <section className='hidden md:w-60 lg:w-80 h-full bg-white md:flex flex-col justify-start items-center gap-18 p-4 py-8 pt-6'>
            {/* Título y botones */}
            <ul className='w-full flex flex-wrap items-center justify-around pb-2 pt-2'>
              <li>
                <h2 className='font-bold text-neutral text-xl'>PawsAmigos</h2>
              </li>
              <li>
                <FaUserFriends className='text-neutral text-2xl' />
              </li>
            </ul>
            <ContactsView
              localuser={localuser}
              currentchat={currentchat}
              setCurrentchat={setCurrentchat}
              showContacts={showContacts}
              setShowContacts={handleShowContactsClick}
              setIsGroup={setIsGroup}
            />
            {/* eslint-disable-next-line react/jsx-indent */}
          </section>
          )
        : null}
      {showGroups
        ? <section className={`hidden md:w-60 h-full bg-white md:flex flex-col justify-start items-center gap-18 p-4 py-8 pt-6 ${createGroups ? 'lg:w-[30em]' : 'lg:w-80'}`}>
          {/* Título y botones */}
          <ul className='w-full flex flex-wrap items-center justify-around pb-2 pt-2'>
            <li>
              <h2 className='font-bold text-neutral text-xl'>PawsGrupos</h2>
            </li>
            <li>
              <BsChatFill className='text-neutral text-2xl' />
            </li>
          </ul>
          <GroupsView
            localuser={localuser}
            createGroups={createGroups}
            setCreateGroups={setCreateGroups}
            setCurrentchat={setCurrentchat}
            setIsGroup={setIsGroup}
            setCurrentgroup={setCurrentgroup}
          />
          {/* eslint-disable-next-line react/jsx-indent */}
          </section>

        : null}

      {!showContacts && !showGroups
        ? <section className='hidden md:w-60 lg:w-[29em] h-full bg-white md:flex flex-col justify-start items-center gap-18 p-4 py-8 pt-6'>
          {/* Título y botones */}
          <ul className='w-full flex flex-wrap items-center justify-around pb-2 pt-2'>
            <li>
              <h2 className='font-bold text-neutral text-xl'>PawsChatea</h2>
            </li>
            <li>
              <BsChatFill className='text-neutral text-2xl' />
            </li>
          </ul>
          <ConversationButton localuser={localuser} currentchat={currentchat} setCurrentchat={setCurrentchat} setIsGroup={setIsGroup} />
          {/* eslint-disable-next-line react/jsx-indent */}
          </section>
        : null}

      {/* Lista de conversaciones */}

      {/* mobile menu */}

      <section className={`z-10 md:hidden w-full h-full bg-white flex flex-col justify-start items-center gap-18 p-4 ${sideContactsStyle} transition-transform`}>
        {showContacts
          ? (
            <>
              {/* Título y botones en menú móvil */}
              <ul className='w-full flex flex-wrap items-center justify-start pb-2 pt-2 gap-4'>
                <li>
                  <h2 className='font-bold text-neutral text-xl'>PawsAmigos</h2>
                </li>
                <li>
                  <li>
                    <FaUserFriends className='text-neutral text-2xl' />
                  </li>
                </li>
              </ul>

              {/* Búsqueda de conversaciones en menú móvil */}
              <section className='w-full h-[80%]'>
                {/* Lista de conversaciones en menú móvil */}
                <ContactsView
                  localuser={localuser}
                  currentchat={currentchat}
                  setCurrentchat={setCurrentchat}
                  showContacts={showContacts}
                  setShowContacts={handleShowContactsClick}
                  setIsGroup={setIsGroup}
                />
              </section>
              {/* eslint-disable-next-line react/jsx-indent */}
            </>
            )
          : null}

        {showGroups
          ? <>
            {/* Título y botones en menú móvil */}
            <ul className='w-full flex flex-wrap items-center justify-start pb-2 pt-2 gap-4'>
              <li>
                <h2 className='font-bold text-neutral text-xl'>PawsGrupos</h2>
              </li>
              <li>
                <li>
                  <FaUserFriends className='text-neutral text-2xl' />
                </li>
              </li>
            </ul>

            {/* Búsqueda de conversaciones en menú móvil */}
            <section className='w-full h-[80%]'>
              {/* Lista de conversaciones en menú móvil */}
              <GroupsView
                localuser={localuser}
                createGroups={createGroups}
                setCreateGroups={setCreateGroups}
                setCurrentchat={setCurrentchat}
                setIsGroup={setIsGroup}
                setCurrentgroup={setCurrentgroup}
              />
            </section>
            {/* eslint-disable-next-line react/jsx-indent */}
            </>
          : null}

        {!showContacts && !showGroups
          ? <>
            {/* Título y botones en menú móvil */}
            <ul className='w-full flex flex-wrap items-center justify-start pb-2 pt-2 gap-4'>
              <li>
                <h2 className='font-bold text-neutral text-xl'>PawsChatea</h2>
              </li>
              <li>
                <li>
                  <BsChatFill className='text-neutral text-2xl' />
                </li>
              </li>
            </ul>

            {/* Búsqueda de conversaciones en menú móvil */}
            <section className='w-full h-[80%]'>
              {/* Lista de conversaciones en menú móvil */}
              <ConversationButton localuser={localuser} currentchat={currentchat} setCurrentchat={setCurrentchat} setIsGroup={setIsGroup} />
            </section>
            {/* eslint-disable-next-line react/jsx-indent */}
            </>
          : null}

        {/* Sección final con botones en menú móvil */}
        <section className=' w-full bg-neutral flex flex-col justify-between items-center justify-self-end gap-4 p-4 rounded-lg'>

          <h1 className='font-bold text-white text-xl'>PawsPlorer Messenger</h1>
          <ul className='flex flex-row items-center justify-center'>

            {/* Botones de íconos en menú móvil */}
            <li>
              <button
                className='btn btn-ghost'
                onClick={() => {
                  setShowContacts(false)
                  setShowGroups(false)
                }}
              >
                <BsFillChatDotsFill className='text-white text-2xl' />
              </button>
            </li>
            <li>
              <button
                className='btn btn-ghost'
                onClick={() => {
                  setShowContacts(true)
                  setShowGroups(false)
                  handleUpdateContacs()
                }}
              >
                <BsFillPeopleFill className='text-white text-2xl' />
              </button>
            </li>
            <li>
              <button
                className='btn btn-ghost'
                onClick={() => {
                  setShowGroups(true)
                  setShowContacts(false)
                }}
              >
                <HiUserGroup className='text-white text-2xl' />
              </button>
            </li>
            <li>
              <Link
                to='/home' className='btn btn-ghost'
                onClick={handleleaveRooms}
              >
                <BsFillDoorOpenFill className='text-white text-2xl' />
              </Link>
            </li>
            <li>
              <Link
                to={`/profile/${localuser.user_id}`} className='btn mb-3 btn-ghost flex items-center justify-start'
                onClick={handleleaveRooms}
              >
                <img
                  className='w-10 h-10 rounded-full'
                  src={user?.thumbnail || 'https://i.imgur.com/HeIi0wU.png'}
                  alt='user-thumbnail'
                />
              </Link>
            </li>
          </ul>
        </section>
      </section>
      {currentchat && (
        <ConversationModule
          localuser={localuser}
          currentchat={currentchat}
          chatContainerRef={chatContainerRef}
          setCurrentchat={setCurrentchat}
          isGroup={isGroup}
          currentGroup={currentGroup}
        />

      )}
    </section>
  )
}

export default Chat
