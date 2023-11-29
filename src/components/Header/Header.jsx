// import React from 'react'
import { useEffect, useState } from 'react'
import { Link } from '@tanstack/router'
import logo from '../../assets/NewIcons/pawsplorer blanco.png'
import useFindUser from '../../hooks/useFindUser'
import MobileMenu from './MobileMenu'

const Header = () => {
  const { user } = useFindUser()

  const [currentUser, setCurrentUser] = useState({})
  const [openMobileMenu, setOpenMobileMenu] = useState(false)

  useEffect(() => {
    if (user) {
      const newUser = user
      setCurrentUser(newUser)
    }
  }, [user])

  return (
    <div className='fixed z-50 flex justify-between items-center w-full h-16 bg-primary px-10'>
      <Link to='/home' className='flex items-center'>
        <img src={logo} alt='Logo PawsPlorer' className='w-32' />
      </Link>
      <div className='lg:hidden flex gap-4 justify-center'>
        <Link to={`/profile/${currentUser.user_id}`} className='flex items-center'>
          <img src={currentUser.thumbnail} alt='user-thumbnail' className='w-10 h-10 rounded-full' />
        </Link>
        <div className='lg:hidden flex items-center'>
          {/* On mobile show menu button */}
          <button
            className='btn btn-secondary h-6 max-w-xs'
            onClick={() => {
              setOpenMobileMenu(!openMobileMenu)
              console.log('click')
            }}
          >
            <i className='fa-solid fa-bars text-white' />
          </button>
        </div>
      </div>
      {openMobileMenu && <MobileMenu />}
    </div>
  )
}

export default Header
