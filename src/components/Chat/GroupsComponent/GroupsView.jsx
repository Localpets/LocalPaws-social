/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react'
import { BsClock } from 'react-icons/bs'
import { getContacts } from '../utilities/FetchUsers_Contacs'
import { fetchAllGroups } from './GroupUtilities/FetchGroups'
import { handleCreateGroups } from './GroupUtilities/Handlers/handleCreateGroup'
import useChatStore from '../../../context/ChatStore'
import swal from 'sweetalert'

const GroupsView = ({ localuser, createGroups, setCreateGroups }) => {
  const [contacts, setContacts] = useState([])
  const [loadingcontacts, setLoadingcontacts] = useState(true)
  const [loadingGroups, setLoadingGroups] = useState(true)
  const [allgroups, setAllgroups] = useState([])
  const [GroupName, setGroupName] = useState('')
  const [previewImage, setPreviewImage] = useState([])
  const [selectedImage, setSelectedImage] = useState([])
  const [imageError, setImageError] = useState(false)
  const [selectedContacts, setSelectedContacts] = useState(new Set())

  const {
    toggleSideContactsStyle,
    toggleHamburguerStyle
  } = useChatStore()

  const handleGroupcreate = () => {
    setCreateGroups(!createGroups)
  }

  useEffect(() => {
    if (imageError) {
      swal('Error', 'La imagen no puede pesar más de 5MB y los formatos permitidos son .jpg, .jpeg, .png', 'error')
      setImageError(false)
    }
  }, [imageError])

  const handleImageChange = (e) => {
    const file = e.target.files[0]

    if (file) {
      if (file.size > 5000000 || !['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
        setImageError(true)
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result)
      }
      reader.readAsDataURL(file)
      setSelectedImage(file)
    }
  }

  const handleDeleteImage = () => {
    setPreviewImage('')
    setSelectedImage('')
  }

  const toggleContactSelection = (contactId) => {
    const updatedSelectedContacts = new Set(selectedContacts)
    if (updatedSelectedContacts.has(contactId)) {
      updatedSelectedContacts.delete(contactId)
    } else {
      updatedSelectedContacts.add(contactId)
    }
    setSelectedContacts(updatedSelectedContacts)
  }

  useEffect(() => {
    if (localuser) {
      getContacts(setContacts, setLoadingcontacts, localuser)
      fetchAllGroups(localuser, setLoadingGroups, setAllgroups)
    }
  }, [localuser])

  // Función para manejar el cambio en el campo de entrada de nombre del grupo
  const handleGroupNameChange = (e) => {
    setGroupName(e.target.value)
  }
  // Función para manejar el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault()

    handleCreateGroups(GroupName, selectedImage, Array.from(selectedContacts), setSelectedContacts, setSelectedImage, setGroupName, setCreateGroups, localuser)
  }
  return (
    <section className={`w-full md:w-60 lg:w-80 h-full max-h-full overflow-y-auto md:pl-4 md:pr-4 bg-white md:flex flex-col justify-start items-center gap-18 ${createGroups ? 'lg:w-[30em]' : 'lg:w-80'}`}>

      <div className='flex items-center w-full pb-4'>
        <input
          type='text'
          placeholder='Buscar grupo'
          className='input bg-slate-100 text-black rounded-md mt-4 w-full max-w-2xl placeholder:font-semibold'
        />
        <button
          className='btn btn-ghost mt-4'
          onClick={handleGroupcreate}
        >
          <i className='fa fa-plus-circle text-neutral text-2xl' aria-hidden='true' />
        </button>

      </div>
      {!createGroups
        ? loadingGroups
          ? <div className='flex items-center mt-12 justify-center gap-2'>
            <BsClock className='animate-spin text-black' /> <h1 className='text-black'>Cargando grupos</h1>
            {/* eslint-disable-next-line react/jsx-indent */}
            </div>

          : allgroups.length === 0
            ? <h1>No tienes grupos que mostrar</h1>
            : (
              <ul className='bg-white flex w-full flex-col gap-4 pt-6'>
                {allgroups.map(group => {
                  return (
                    <li key={group.id}>
                      <button
                        className='btn-ghost p-2 rounded-lg w-full flex justify-left gap-2'
                        onClick={() => {
                          toggleSideContactsStyle()
                          toggleHamburguerStyle()
                        }}
                      >
                        {group.image === 'lol'
                          ? <div className='w-12 h-12 flex justify-center items-center rounded-full bg-slate-200'>
                            <span>{group.name[0]}</span>
                            {/* eslint-disable-next-line react/jsx-indent */}
                            </div>
                          : <img className='w-12 h-12 rounded-full' src={group.image} />}

                        <div className='flex flex-col items-start justify-center'>
                          <div className='text-black font-bold text-md'>{group.name}</div>
                          <div>Hola</div>
                        </div>
                      </button>
                    </li>
                  )
                })}
              </ul>
              )
        : null}

      {createGroups
        ? (
          <form className=' w-full p-4 h-[85%] md:h-full bg-slate-50 rounded-xl' onSubmit={handleSubmit} encType='multipart/form-data'>
            <div className='flex p-2 items-center bg-secondary justify-center border-2 mb-2 rounded-xl border-neutral'>
              <div className='relative inline-block'>
                <div className='flex justify-center items-center w-24 h-24 rounded-full bg-white cursor-pointer group'>
                  {previewImage.length !== 0
                    ? <div>
                      <img
                        src={previewImage}
                        alt='Preview'
                        className='rounded-full text-gray-500 text-3xl'
                      />
                      <button
                        className='absolute top-0 right-0 z-20 bg-red-500 text-white rounded-full px-2 py-1 cursor-pointer'
                        onClick={handleDeleteImage}
                      >
                        <i className='fa fa-trash' />
                      </button>
                      {/* eslint-disable-next-line react/jsx-indent */}
                      </div>

                    : (
                      <i className='fa fa-users rounded-full text-gray-500 text-3xl' />
                      )}
                  <div
                    className='absolute inset-0 flex items-center justify-center rounded-full bg-white bg-opacity-50 opacity-0 transition-opacity group-hover:opacity-100'
                    onClick={() => document.getElementById('image-upload').click()}
                  >
                    <span className='font-bold select-none'>Subir Foto</span>
                  </div>
                </div>
                <input
                  type='file'
                  name='image'
                  id='image-upload'
                  accept='image/jpeg,image/png,image/jpg'
                  className='hidden'
                  onChange={handleImageChange}
                />
              </div>
              <div className='flex flex-col justify-center w-auto m-2'>
                <h1 className='flex bg-secondary text-neutral border-neutral border-2 rounded-xl p-2 justify-center mb-2'>Nombre del grupo</h1>

                <input
                  className='mb-2 rounded-xl w-full text-center borderprimary focus-visible:border-primary focus-visible:ring-primary border-primary'
                  placeholder='Digite el nombre'
                  required
                  value={GroupName}
                  onChange={handleGroupNameChange}
                />
              </div>
            </div>

            <div>
              <h1 className='flex border-neutral border-2 bg-secondary text-neutral rounded-xl p-2 justify-center mb-2'>Selecciona contactos para el grupo</h1>
            </div>
            <ul>
              <li className='flex flex-col border-neutral border-2 gap-1 justify-start bg-secondary rounded-xl overflow-y-auto p-2 h-60 max-h-60'>
                {!loadingcontacts
                  ? (
                      contacts.map((contact) => {
                        const isSelected = selectedContacts.has(contact.user_id)
                        return (
                          <div key={contact.user_id} className=''>
                            <button
                              type='button'
                              className={`w-full p-2 flex items-center justify-between rounded-xl ${isSelected ? 'bg-green-200 hover:bg-red-200' : 'bg-white hover:bg-slate-100'}`}
                              onClick={() => toggleContactSelection(contact.user_id)}
                            >
                              <div className='flex items-center gap-4'>
                                <img src={contact.thumbnail} className='w-10 h-10 rounded-full' />
                                <h1>{contact.username}</h1>
                              </div>
                              <div className='flex'>
                                <i className={`fa text-neutral text-xl aria-hidden='true ${isSelected ? 'fa-xmark' : 'fa-plus'}`} />
                              </div>
                            </button>
                          </div>
                        )
                      })
                    )
                  : (
                    <div className='flex items-center justify-center gap-2'>
                      <BsClock className='animate-spin text-neutral' /> <h1 className='text-neutral'>Cargando Amigos</h1>
                    </div>
                    )}
              </li>
            </ul>
            <div className='flex flex-col pt-2 gap-2'>
              <div className='bg-secondary rounded-xl p-2 h-52 md:h-72 border-neutral border-2'>
                <p className='bg-white rounded-xl flex justify-center mb-2'> Usuarios seleccionados</p>
                <div className='flex flex-col gap-2 p-4 overflow-y-auto max-h-40 md:max-h-60'>
                  {Array.from(selectedContacts).map((contactId) => {
                  // Render the selected contact's photo and name here
                    const selectedContact = contacts.find((contact) => contact.user_id === contactId)
                    return (
                      <div key={contactId} className='flex items-center bg-white gap-2 p-2 rounded-xl'>
                        <img src={selectedContact.thumbnail} alt={selectedContact.username} className='w-10 h-10 rounded-full' />
                        <p>{selectedContact.username}</p>
                      </div>
                    )
                  })}
                </div>
              </div>
              <button type='submit' className='flex justify-center p-2 mb-2 bg-neutral hover:bg-primary rounded-xl'>
                <p className='text-white'>Crear grupo</p>
              </button>
            </div>

          </form>
          )
        : null}

    </section>
  )
}

export default GroupsView
