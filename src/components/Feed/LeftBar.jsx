// import React from 'react'
import { Link } from '@tanstack/router'
import logo from '../../assets/logo.png'

const LeftBar = () => {
  return (
    <div className='flex flex-col text-[#0D1B2A] border-r border-[#E0E1DD] items-center w-[35%] pt-[2em] md:justify-start'>
      
        <a href='' className='link-active my-2 w-16 mx-auto'>
          <img src={logo} alt='Logo PawsPlorer' className='w-16' />
        </a>

        <nav className='mt-5 flex flex-col '>
        <Link to='/' className='btn mb-3 btn-ghost flex items-center justify-start '>
        <i className='fa-solid fa-house text-xl' /> 
              <span className='icon hidden  md:flex  '>Inicio</span>
          </Link>

          <div className='btn mb-3 btn-ghost flex items-center justify-start '>
            <i className='fa-solid fa-search text-xl' /> 
            <a href='#' className=''>
              <span className='icon hidden md:flex '>Buscar</span>
            </a>
          </div>

          <div className='btn mb-3 btn-ghost flex items-center justify-start '>
            <i className='fa-solid fa-envelope text-xl' /> 
            <a href='#' className=''>
              <span className='icon hidden md:flex '>Mensajes</span>
            </a>
          </div>

          <Link to='/notificaciones' className='btn mb-3 btn-ghost flex items-center justify-start '>
            <i className='fa-solid fa-bell text-xl' /> 
              <span className='icon hidden  md:flex  '>Notificaciones</span>
          </Link>

          <div className='btn mb-3 btn-ghost flex items-center justify-start '>
            <img
              className='w-10 rounded-full'
              src='https://pbs.twimg.com/profile_images/1636962643876478977/MZB-blU6_400x400.jpg'
              alt=''
            />
            <a href='#' className=''>
              <span className='icon hidden md:flex '>Perfil</span>
            </a>
          </div>

          <div className='btn mb-3 btn-ghost flex items-center justify-start '>
            <i className='fa-solid fa-ellipsis text-xl' /> 
            <a href='#' className=''>
              <span className='icon hidden md:flex '>Más</span>
            </a>
        </div>
      </nav>
    </div>
  )
}

export default LeftBar