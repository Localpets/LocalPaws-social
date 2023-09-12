import React from 'react'
import { Link } from '@tanstack/router'
import { makeRequest } from '../../library/axios'

const Logout = () => {
  React.useEffect(() => {
    makeRequest.post('auth/logout')
    localStorage.removeItem('user')
  }, [])

  return (
    <div className='w-full h-full'>
      <h2 className='text-center text-xl pt-20'>Cerraste sesión correctamente</h2>
      <Link to='/'>Ir al login</Link>
    </div>
  )
}

export default Logout
