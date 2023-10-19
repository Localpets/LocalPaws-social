import { useEffect } from 'react'
import { Link } from '@tanstack/router'
import { makeRequest } from '../../library/Axios'
import logo from '../../assets/NewIcons/Logo pawsplorer LOGO PRINCIPAL-04.png'

const Logout = () => {
  useEffect(() => {
    makeRequest.post('auth/logout')
    localStorage.removeItem('user')
  }, [])

  return (
    <div className='min-h-screen flex flex-col items-center justify-center py-16 px-4 sm:px-6 lg:px-8'>
      <div className='bg-slate-300 rounded flex flex-col items-center p-8 border border-white w-full sm:w-2/3 md:w-1/2 lg:w-1/3'>
        <img src={logo} alt='Logo PawsPlorer' className='w-52' />
        <h2 className='text-center text-xl text-[#0D1B2A] pt-6 pb-6 sm:pb-8'>Cerraste sesión correctamente</h2>
        <div className='flex justify-between items-center'>
          <button className='bg-[#1B263B] hover:bg-[#778DA9] transition-[400ms] rounded p-2 pl-6 pr-6'>
            <Link className='text-center text-[#E0E1DD]' to={window.location.assign('/')}>Ir al login</Link>
          </button>
          <div className='pl-8'>
            <img className='h-24 w-24' src='https://s3.getstickerpack.com/storage/uploads/sticker-pack/perrito-triste-2/1586113475.png?163d222633c650de781d1af64d1a8376&d=200x200' alt='' />
          </div>
        </div>
      </div>
    </div>

  )
}

export default Logout
