/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react'
import { Link } from '@tanstack/router'
import useFindUser from '../../hooks/useFindUser'
import logo from '../../assets/NewIcons/pawsplorer marron.png'
import UnreadMessageCounter from './utilities/fetchUnreadMessages'

const LeftBar = ({ isProfileView, toggleNewSection, profileUser }) => {
  const { user } = useFindUser()
  const [currentUser, setCurrentUser] = useState([])
  const [unreadmsg, setUnreadmsg] = useState([])
  useEffect(() => {
    if (user) {
      console.log(user)
      setCurrentUser(user)
    }
  }, [user])

  return (
    <div className='flex fixed flex-col left-0 text-neutral h-auto rounded-lg border-2 border-[#E0E1DD] items-center w-[20%] mt-10 bg-white ml-10 md:justify-start'>
      <Link to='/home' className='link-active mt-4 mb-1 w-28 h-20 mx-auto'>
        <img src={logo} alt='Logo PawsPlorer' className='w-24 h-20 max-w-none mx-auto' />
      </Link>
      <nav className='mt-2 flex flex-col'>
        <Link to='/home' className='btn mb-3 btn-ghost flex items-center justify-start'>
          <i className='fa-solid fa-house text-xl' />
          <span className='icon'>Inicio</span>
        </Link>
        <Link to='/notificaciones' className='btn mb-3 btn-ghost flex items-center justify-start'>
          <i className='fa-solid fa-bell text-xl' />
          <span className='icon'>Notificaciones</span>
        </Link>
        <Link to='/chat' className='btn mb-3 btn-ghost flex items-center justify-start'>
          <i className='fa-solid fa-envelope text-xl' />
          <UnreadMessageCounter setUnreadmsg={setUnreadmsg} unreadmsg={unreadmsg} user={user} />
          <span className='icon'>Mensajes</span>
        </Link>
        <Link to='/search' className='btn mb-3 btn-ghost flex items-center justify-start'>
          <i className='fa-solid fa-search text-xl' />
          <span className='icon'>Buscar</span>
        </Link>
        <Link to='/map' className='btn mb-3 btn-ghost flex items-center justify-start '>
          <i className='fa-solid fa-route text-xl' />
          <span className='icon hidden md:flex '>Mapa</span>
        </Link>

        {isProfileView && (
          <div className={profileUser ? 'profile-section' : 'hidden'}>
            <button onClick={toggleNewSection} className='btn mb-3 btn-ghost flex items-center justify-start '>
              <i className='fa fa-paper-plane' aria-hidden='true' />
              <span className='icon hidden md:flex '>Pawstear</span>
            </button>
          </div>
        )}

        <Link to={`/profile/${currentUser.user_id}`} className='btn mb-3 btn-ghost flex items-center justify-start'>
          <img
            className='w-10 h-10 rounded-full'
            src={user?.thumbnail || 'https://i.imgur.com/HeIi0wU.png'}
            alt='user-thumbnail'
          />
          <span className='icon'>Perfil</span>
        </Link>
        <Link to='/logout' className='btn mb-4 btn-ghost flex items-center justify-start'>
          <i className='fa-solid fa-sign-out text-xl' />
          <span className='icon'>Cerrar sesión</span>
        </Link>

      </nav>
    </div>
  )
}

export default LeftBar
