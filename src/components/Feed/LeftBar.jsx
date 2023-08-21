// import React from 'react'
import logo from '../../assets/logo.png'
import { Link } from '@tanstack/router'
const LeftBar = () => {
  return (
    <div className='flex flex-col text-[#0D1B2A] border-r border-[#E0E1DD] items-center w-[35%] pt-[2em] md:justify-start'>
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
        <Link to='/chat' className='btn mb-3 btn-ghost flex items-center justify-start'>
          <i className='fa-solid fa-envelope text-xl' />
          <span className='icon'>Mensajes</span>
        </Link>
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
