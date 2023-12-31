import { useStore } from '../context/store'
import { BsFillHouseHeartFill } from 'react-icons/bs'
import { Link } from '@tanstack/router'

const Header = () => {
  // hook useStore para obtener valores del contexto
  const {
    showOptions,
    showPawsPlorer,
    toggleOptions
  } = useStore()

  return (
    <header className='text-white'>
      <nav id='nav'>

        {/* Barra de navegación */}
        <div className='navbar relative bg-base-100 flex justify-between items-center px-4 py-4'>

          {/* Sección de inicio de la barra de navegación */}
          <div className='navbar-start'>

            {/* Botón que activa el menú lateral */}
            <label
              tabIndex={0}
              className='btn btn-ghost btn-circle'
              htmlFor='SiderbarBTN'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-5 w-5'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M4 6h16M4 12h16M4 18h7'
                />
              </svg>
            </label>

          </div>
          {/* Sección central de la barra de navegación */}
          <div className='navbar-center flex itmes-center'>

            {/* Mostrar el enlace "PawsPlorer" solo cuando showPawsPlorer es verdadero */}
            {showPawsPlorer && (
              <Link to='/home' className='btn btn-ghost normal-case text-xl'>PawsPlorer</Link>
            )}

            {/* Mostrar los botones "Adopciones" solo cuando showOptions es verdadero */}
            <div className={showOptions ? 'flex justify-center' : 'hidden md:flex lg:flex'}>
              <div className='flex'>
                <button className='btn btn-ghost normal-case text-xl md:hidden'>Adopciones</button>
              </div>
            </div>
          </div>

          {/* Sección final de la barra de navegación */}
          <div className='navbar-end gap-4 sm:flex lg:flex'>

            <button className='btn btn-ghost normal-case text-xl hidden md:flex md:text-sm'>Adopciones</button>

            {/* Botón para mostrar/ocultar opciones en pantallas más pequeñas */}
            <button
              className='btn btn-ghost btn-circle md:hidden lg:hidden'
              onClick={toggleOptions}
            >
              <BsFillHouseHeartFill className='text-xl' />
            </button>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Header
