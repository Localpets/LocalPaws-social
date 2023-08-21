import { useEffect, useState } from 'react'
import logo from '../../assets/Icons/logo.png'
import { Link } from '@tanstack/router'

const LeftBar = () => {
  const [user, setUser] = useState([])
  useEffect(() => {
    if (localStorage.getItem('user')) {
      const user = JSON.parse(localStorage.getItem('user'))
      setUser(user)
    }
  }, [setUser])
  return (
    <div className='flex fixed flex-col left-0 bg-white text-[#0D1B2A] h-full border-r border-[#E0E1DD] items-center w-[25%] pt-[2em] md:justify-start'>
      <Link to='/home' className='link-active my-2 w-16 mx-auto'>
        <img src={logo} alt='Logo PawsPlorer' className='w-16' />
      </Link>
      <nav className='mt-5 flex flex-col'>
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
          <span className='icon'>Mensajes</span>
        </Link>
        <Link href='#' className='btn mb-3 btn-ghost flex items-center justify-start'>
          <i className='fa-solid fa-search text-xl' />
          <span className='icon'>Buscar</span>
        </Link>
        <Link to='/profile' className='btn mb-3 btn-ghost flex items-center justify-start'>
          <img
            className='w-10 rounded-full'
            src={user.profilePicture}
            alt=''
          />
          <span className='icon'>Perfil</span>
        </Link>
      </nav>
    </div>
  )
}

export default LeftBar
