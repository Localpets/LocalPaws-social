import { Link } from '@tanstack/router'
import useFindUser from '../../hooks/useFindUser'
import Skeleton from 'react-loading-skeleton'
import '../../../node_modules/react-loading-skeleton/dist/skeleton.css'
import { useEffect } from 'react'

const UserLoggedModal = () => {
  const { user } = useFindUser()

  useEffect(() => {
    if (user) {
      console.log('user', user)
    }
  }, [user])

  if (user === 1) return null

  return (
    <article className='fixed z-50 inset-0 overflow-y-auto'>
      <div className='flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0'>
        <div className='fixed inset-0 transition-opacity' aria-hidden='true'>
          <div className='absolute inset-0 bg-gray-500 opacity-75' />
        </div>
        <span className='hidden sm:inline-block sm:align-middle sm:h-screen' aria-hidden='true' />
        <div className='inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full'>
          <div className='bg-white px-4 pt-3 pb-4 sm:p-6 sm:pb-4' />
          <div className='bg-white px-4 pb-8 sm:pb-8'>
            <div className='flex items-center justify-center'>
              <div className='mt-3 text-center sm:mt-0 sm:ml-4'>
                <div className='mt-2 flex flex-col justify-center items-center'>
                  <i className='fa-solid fa-triangle-exclamation text-[8rem] animate-pulse text-yellow-500' />
                  <p className='text-xl text-gray-500 pt-4'>
                    Hola! {user !== null ? user.username : <Skeleton />}<br />
                    Se ha encontrado una sesión activa
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className='bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse'>
            <Link to='/logout' className='w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm'>
              Cerrar sesión
            </Link>
            <Link to='/home' className='mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm'>
              Continuar conectado
            </Link>
          </div>
        </div>
      </div>
    </article>
  )
}

export default UserLoggedModal
