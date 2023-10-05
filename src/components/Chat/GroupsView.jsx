import { useState } from 'react'
import { FaUserFriends } from 'react-icons/fa'

const GroupsView = () => {
  const [createGroups, setCreateGroups] = useState(false)
  const [editingPhoto, setEditingPhoto] = useState(false)

  const handleGroupcreate = () => {
    setCreateGroups(!createGroups)
  }

  const handleEditphoto = () => {
    setEditingPhoto(!editingPhoto)
  }
  return (
    <section className='hidden md:w-60 lg:w-80 h-full bg-white md:flex flex-col justify-start items-center gap-18 p-4 py-8 pt-6'>
      <ul className='w-full flex flex-wrap items-center justify-around pb-2 pt-2'>
        <li>
          <h2 className='font-bold text-slate-800 text-xl'>PawsGrupos</h2>
        </li>
        <li>
          <FaUserFriends className='text-neutral text-2xl' />
        </li>
      </ul>
      <div className='flex items-center'>
        <input
          type='text'
          placeholder='Buscar grupo'
          className='input bg-slate-50 text-black rounded-md mt-4 w-full max-w-2xl placeholder:font-semibold'
        />
        <button
          className='btn btn-ghost mt-4'
          onClick={handleGroupcreate}
        >
          <i className='fa fa-plus-circle text-neutral text-2xl' aria-hidden='true' />
        </button>

      </div>

      <ul className='bg-white flex w-full flex-col gap-4 pt-6'>
        <div className='flex items-center justify-center'>
          <p className='text-xl text-slate-800'>Cargando grupos...</p>
        </div>
      </ul>

      {createGroups
        ? (
          <div className='absolute w-[30em] p-4 h-80 bg-white top-[30%] right-[30%] rounded-xl'>
            <h1 className='flex bg-secondary rounded-xl p-2 justify-center'>Crear un grupo:</h1>
            <ul>
              <li className='flex gap-4 pt-4 justify-center items-center'>
                <button
                  className={editingPhoto ? 'w-16 h-16 bg-white rounded-full ' : ''}
                  onClick={handleEditphoto}
                >
                  <img src='https://th.bing.com/th/id/OIP.ngK_kaB79uDW6nRiCJqqCAHaHR?pid=ImgDet&rs=1' className={editingPhoto ? 'opacity-[50%] rounded-full' : 'w-16 h-16 rounded-full'} />
                </button>
                <h1>Selecciona una imagen</h1>
              </li>
            </ul>
          </div>
          )
        : null}

    </section>
  )
}

export default GroupsView
