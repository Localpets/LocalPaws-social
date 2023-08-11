import { useStore } from '../context/store'

const Header = () => {
  // hook useStore para obtener valores del contexto
  const {
    showOptions,
    showPawsPlorer,
    toggleOptions
  } = useStore()

  return (
    <header>
      <nav id='nav'>

        {/* Barra de navegación */}
        <div className='navbar relative bg-base-100 flex justify-between items-center px-4 py-2'>

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
          <div className='navbar-center'>

            {/* Mostrar el enlace "PawsPlorer" solo cuando showPawsPlorer es verdadero */}
            {showPawsPlorer && (
              <a className='btn btn-ghost normal-case text-xl' href='https://localpets-landing-page.vercel.app/'>PawsPlorer</a>
            )}
          </div>

          {/* Sección final de la barra de navegación */}
          <div className='navbar-end gap-4 sm:flex lg:flex'>

            {/* Mostrar los botones "Adopciones" y "Red Social" solo cuando showOptions es verdadero */}
            <div className={showOptions ? 'flex gap-4 items-center' : 'hidden md:flex lg:flex'}>
              <button className='btn btn-ghost normal-case'>Adopciones</button>
              <button className='btn btn-ghost normal-case'>Red Social</button>
            </div>

            {/* Botón para mostrar/ocultar opciones en pantallas más pequeñas */}
            <button
              className='btn btn-ghost btn-circle md:hidden lg:hidden'
              onClick={toggleOptions}
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
                  d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                />
              </svg>
            </button>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Header
