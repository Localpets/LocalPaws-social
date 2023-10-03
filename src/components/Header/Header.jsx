// import React from 'react'
import logo from '../../assets/NewIcons/pawsplorer blanco.png'

const Header = () => {
  return (
    <div className='fixed z-50 flex justify-between items-center w-full h-16 bg-primary border-b-2 border-[#E0E1DD] px-10'>
      <div className='flex items-center'>
        <img src={logo} alt='Logo PawsPlorer' className='w-32' />
      </div>
      <div className='flex items-center'>
        <i className='fa-solid fa-search text-xl text-[#fff] cursor-pointer' />
        <i className='fa-solid fa-bell text-xl text-[#fff] cursor-pointer ml-4' />
        <i className='fa-solid fa-envelope text-xl text-[#fff] cursor-pointer ml-4' />
      </div>
    </div>
  )
}

export default Header
