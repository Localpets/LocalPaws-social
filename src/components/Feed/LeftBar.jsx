// import React from 'react'
import logo from '../../assets/Icons/logo.png'

const LeftBar = () => {
  return (
    <div className='xl:w-1/5 w-20 h-full flex flex-col xl:pr-4 text-white'>
      <a href='' className='link-active my-2 w-16 mx-auto'>
        <img src={logo} alt='Logo PawsPlorer' className='w-16' />
      </a>

      <nav className='mt-5 flex flex-col'>
        <a href='#' className='btn mb-3 btn-ghost flex items-center justify-start'>
          <i className='fa-solid fa-house text-xl' />
          <span className='icon'>Inicio</span>
        </a>
        <a href='#' className='btn mb-3 btn-ghost flex items-center justify-start'>
          <i className='fa-solid fa-bell text-xl' />
          <span className='icon'>Notificaciones</span>
        </a>
        <a href='#' className='btn mb-3 btn-ghost flex items-center justify-start'>
          <i className='fa-solid fa-envelope text-xl' />
          <span className='icon'>Mensajes</span>
        </a>
        <a href='#' className='btn mb-3 btn-ghost flex items-center justify-start'>
          <i className='fa-solid fa-search text-xl' />
          <span className='icon'>Buscar</span>
        </a>
        <a href='#' className='btn mb-3 btn-ghost flex items-center justify-start'>
          <img
            className='w-10 rounded-full'
            src='https://pbs.twimg.com/profile_images/1636962643876478977/MZB-blU6_400x400.jpg'
            alt=''
          />
          <span className='icon'>Perfil</span>
        </a>
      </nav>
    </div>
  )
}

export default LeftBar
