import React from 'react'
import logo from '../../assets/Icons/logo.png'

const Header = () => {
  return (
    <div className='flex justify-between items-center w-full h-16 bg-white border-b-2 border-[#E0E1DD] px-10'>
      <div className='flex items-center'>
        <img src={logo} alt='Logo PawsPlorer' className='w-16' />
        <h1 className='text-[#0D1B2A] font-bold text-2xl ml-2'>PawsPlorer</h1>
      </div>
      <div className='flex items-center'>
        <i className='fa-solid fa-search text-xl text-[#0D1B2A] cursor-pointer' />
        <i className='fa-solid fa-bell text-xl text-[#0D1B2A] cursor-pointer ml-4' />
        <i className='fa-solid fa-envelope text-xl text-[#0D1B2A] cursor-pointer ml-4' />
      </div>
    </div>
  )
}

export default Header
