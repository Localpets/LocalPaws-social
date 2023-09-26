/* eslint-disable camelcase */
/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { makeRequest } from '../../library/axios'
import { FaUserFriends } from 'react-icons/fa'
import useChatStore from '../../context/ChatStore'
import { useSocket } from '../../socket/socket'

const ContactsView = ({ localuser, setCurrentchat, currentchat, setShowContacts }) => {
  const [contacts, setContacts] = useState([])
  const [loadingcontacts, setLoadingcontacts] = useState(true)
  const [searchText, setSearchText] = useState('')
  const [searchResults, setSearchResults] = useState([])

  const {
    toggleSideContactsStyle,
    toggleHamburguerStyle,
    setAllchats,
    allchats
  } = useChatStore()

  const socket = useSocket()

  const UserId = localuser.user_id

  useEffect(() => {
    const getContacts = async () => {
      try {
        const response = await makeRequest.get(`/follow/find/followed/${UserId}`)
        if (response.status === 200) {
          const contactsData = response.data.follows
          setContacts(contactsData)
          setLoadingcontacts(false)
        } else {
          console.log('no hay contactos')
        }
      } catch (error) {
        console.log('El error es: ', error)
      }
    }

    async function fetchAllChats () {
      try {
        if (localuser.user_id) {
        // Obtener mensajes de la API
          const response = await makeRequest.get(
          `message/find/all/${localuser.user_id}`
          )
          const chats = response.data.messages

          if (allchats.length === 0) {
          // Crear un objeto para agrupar los mensajes por conversación
            const conversationMap = {}

            // Iterar a través de los mensajes y agruparlos en el objeto
            chats.forEach(chat => {
              const conversationKey = chat.room

              if (!conversationMap[conversationKey]) {
                conversationMap[conversationKey] = []
              }

              conversationMap[conversationKey].push(chat)
            })

            // Convertir el objeto en una lista de conversaciones
            const conversationList = Object.values(conversationMap)
            setAllchats(conversationList)
          }
        }
      } catch (error) {
        console.log('error:', error)
      }
    }

    getContacts()
    fetchAllChats()

    if (socket) {
      socket.on('updateContacs', () => {
        getContacts()
        fetchAllChats()
      })
    }
  }, [allchats.length, localuser.user_id, currentchat, setAllchats, UserId, socket])

  const handleJoinRoom = (otherUserId) => {
    // Concatenar los IDs de los usuarios para obtener el nuevo nombre de la sala
    const newRoomName = `${Math.min(localuser.user_id, otherUserId)}-${Math.max(localuser.user_id, otherUserId)}`

    // Obtener el nombre de la sala actual del usuario
    const currentRoomName = getCurrentRoomName()

    // Si el usuario está actualmente en una sala y la sala actual es diferente de la nueva sala,
    // entonces saca al usuario de la sala anterior y únete a la nueva sala
    if (currentRoomName && currentRoomName !== newRoomName) {
      // Salir de la sala anterior
      socket.emit('leaveRoom', currentRoomName)
      console.log(`Usuario ${localuser.user_id} salió de la sala: ${currentRoomName}`)

      // Unirse a la nueva sala
      socket.emit('joinRoom', newRoomName)
      console.log(`Usuario ${localuser.user_id} se unió a la sala: ${newRoomName}`)
    } else if (!currentRoomName) {
      // Si el usuario no está en ninguna sala actualmente, únete directamente a la nueva sala
      socket.emit('joinRoom', newRoomName)
      console.log(`Usuario ${localuser.user_id} se unió a la sala: ${newRoomName}`)
    }
  }

  // Función para obtener la sala actual del usuario
  function getCurrentRoomName () {
    // Verifica si currentchat y currentchat.conversation están definidos antes de acceder a 'length'
    if (currentchat && currentchat.conversation) {
      return currentchat.conversation.length > 0 ? currentchat.conversation[0].room : null
    }
    return null // O devuelve null si no está definido
  }

  const handleSearch = (event) => {
    const searchText = event.target.value
    setSearchText(searchText)

    // Realizar la búsqueda en la lista de contactos basada en el texto ingresado
    const filteredContacts = contacts.filter((contact) =>
      contact.username.toLowerCase().includes(searchText.toLowerCase())
    )

    // Actualizar los resultados de búsqueda
    setSearchResults(filteredContacts)
  }
  return (
    <section className='hidden md:w-60 lg:w-80 h-full bg-white md:flex flex-col justify-start items-center gap-18 p-4 py-8 pt-6'>
      <ul className='w-full flex flex-wrap items-center justify-around pb-2 pt-2'>
        <li>
          <h2 className='font-bold text-slate-800 text-xl'>PawsAmigos</h2>
        </li>
        <li>
          <FaUserFriends className='text-slate-800 text-2xl' />
        </li>
      </ul>
      <input
        type='text'
        placeholder='Buscar contacto'
        className='input bg-gray-100 text-black rounded-md mt-4 w-full max-w-2xl placeholder:font-semibold'
        value={searchText}
        onChange={handleSearch} // Asignar la función de búsqueda al evento onChange
      />
      <ul className='bg-white flex w-full flex-col gap-4 pt-6'>
        {loadingcontacts
          ? (
            <div className='flex items-center justify-center'>
              cargando
              {/* eslint-disable-next-line react/jsx-indent */}
            </div>
            )
          : searchText
            ? ( // Mostrar resultados de búsqueda si hay texto en el campo de búsqueda
                searchResults.length > 0
                  ? (
                      searchResults.map((contact) => {
                        const otherUser = contacts.find((user) => user.user_id === contact.user_id)
                        const limitedUsername = otherUser ? otherUser.username.substring(0, 30) : ''
                        const existingChat = allchats.find(chat => {
                          // Verifica si la conversación incluye al usuario actual y al usuario de contacto
                          return chat.some(message =>
                            (message.sender_id === localuser.user_id && message.receiver_id === contact.user_id) ||
                            (message.sender_id === contact.user_id && message.receiver_id === localuser.user_id)
                          )
                        })
                        return (
                          <li key={contact.user_id}>
                            <button
                              className='btn-ghost p-2 w-full rounded-lg flex justify-left gap-2'
                              onClick={() => {
                                toggleSideContactsStyle()
                                toggleHamburguerStyle()
                                setCurrentchat({
                                  conversation: existingChat || {
                                    0: {
                                      receiver_id: otherUser.user_id,
                                      sender_id: localuser.user_id
                                    }
                                  },
                                  username: limitedUsername,
                                  thumbnail: otherUser ? otherUser.thumbnail : ''
                                })
                                setShowContacts(false)
                                handleJoinRoom(contact.user_id)
                              }}
                            >
                              <div className='text-black flex gap-2 items-center'>
                                <img className='w-12 h-12 rounded-full' src={contact.thumbnail} alt='avatar' />
                                <h1 className='text-black font-bold text-m'>{contact.username}</h1>
                              </div>
                            </button>
                          </li>
                        )
                      })
                    )
                  : (
                    <div>
                      <h1>No se encontraron resultados</h1>
                    </div>
                    )
              )
            : (
          // Mostrar la lista de contactos original si no hay texto en el campo de búsqueda
                contacts.length > 0
                  ? (
                      contacts.map((contact) => {
                        const otherUser = contacts.find((user) => user.user_id === contact.user_id)
                        const limitedUsername = otherUser ? otherUser.username.substring(0, 30) : ''
                        const existingChat = allchats.find(chat => {
                          // Verifica si la conversación incluye al usuario actual y al usuario de contacto
                          return chat.some(message =>
                            (message.sender_id === localuser.user_id && message.receiver_id === contact.user_id) ||
                            (message.sender_id === contact.user_id && message.receiver_id === localuser.user_id)
                          )
                        })
                        return (
                          <li key={contact.user_id}>
                            <button
                              className='btn-ghost p-2 w-full rounded-lg flex justify-left gap-2'
                              onClick={() => {
                                toggleSideContactsStyle()
                                toggleHamburguerStyle()
                                handleJoinRoom(contact.user_id)
                                setCurrentchat({
                                  conversation: existingChat || {
                                    0: {
                                      receiver_id: otherUser.user_id,
                                      sender_id: localuser.user_id
                                    }
                                  },
                                  username: limitedUsername,
                                  thumbnail: otherUser ? otherUser.thumbnail : ''
                                })
                                setShowContacts(false)
                                console.log(currentchat)
                              }}
                            >
                              <div className='text-black flex gap-2 items-center'>
                                <img className='w-12 h-12 rounded-full' src={contact.thumbnail} alt='avatar' />
                                <h1 className='text-black font-bold text-m'>{contact.username}</h1>
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
                    )
              )}
      </ul>
    </section>
  )
}

ContactsView.propTypes = {
  localuser: PropTypes.object.isRequired
}

export default ContactsView
