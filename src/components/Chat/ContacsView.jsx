import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { makeRequest } from '../../library/axios'

const ContactsView = ({ localuser }) => {
  const [contacts, setContacts] = useState([])
  const [users, setUsers] = useState([])
  const [loadingcontacts, setLoadingcontacts] = useState(true)

  const UserId = localuser.userId
  console.log('este es el id del usuario', UserId)

  useEffect(() => {
    const getContacts = async () => {
      try {
        const response = await makeRequest.get(`/follow/user/${UserId}`)
        if (response.status === 200) {
          const contactsData = response.data.follows
          setContacts(contactsData)
          console.log('estos son los contactos', contactsData)

          // Obtener información de usuarios de la API
          const usersResponse = await makeRequest.get('user/find/all')
          const userList = usersResponse.data.data
          setUsers(userList)
          setLoadingcontacts(false)
        } else {
          console.log('no hay contactos')
        }
      } catch (error) {
        console.log('El error es: ', error)
      }
    }
    getContacts()
  }, [UserId, setUsers])

  return (
    <section className='hidden md:w-60 lg:w-80 h-full bg-white md:flex flex-col justify-start items-center gap-18 p-4 py-8 pt-6'>
      <div className='w-full flex flex-wrap items-center justify-around pb-2'>
        <h2 className='font-bold text-slate-800 text-xl'>Contactos</h2>
      </div>
      <input
        type='text'
        placeholder='Buscar contacto'
        className='input bg-gray-100 text-black rounded-md mt-4 w-full max-w-2xl placeholder:font-semibold'
      />
      <ul className='bg-white flex flex-col items-center justify-center gap-4 pt-6'>
        {loadingcontacts
          ? <div className='flex items-center justify-center'>
            cargando
            {/* eslint-disable-next-line react/jsx-indent */}
            </div>
          : contacts.length > 0
            ? (
                contacts.map((contact) => {
                  const Contacs = users.find((user) => user.user_id === contact.followedId)
                  return (
                    <li key={Contacs.user_id}>
                      <button className='btn-ghost p-2 rounded-lg w-full flex justify-left gap-2'>
                        <div className='text-black flex items-center gap-2'>
                          <img className='w-12 h-12 rounded-full' src={Contacs.thumbnail} alt='avatar' />
                          <h1 className='text-black font-bold text-m'>{Contacs.username}</h1>
                        </div>
                      </button>
                    </li>
                  )
                })
              )
            : (
              <div>
                <h1>No tienes contactos</h1>
              </div>
              )}
      </ul>
    </section>
  )
}

ContactsView.propTypes = {
  localuser: PropTypes.object.isRequired
}

export default ContactsView
