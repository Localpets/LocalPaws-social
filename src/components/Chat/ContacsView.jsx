/* eslint-disable camelcase */
/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import useChatStore from '../../context/ChatStore'
import { useSocket } from '../../socket/socket'
import ContactListItem from './Structures/ContacsSkeleton'
import { fetchAllChats } from './utilities/FetchChats_Contacs'
import { getContacts } from './utilities/FetchUsers_Contacs'
import { handleJoinRoom } from './utilities/Handlers/HandleJoinRoom'
import LoadingGif from '../LoadingState/LoadingGif'

const ContactsView = ({ localuser, setCurrentchat, currentchat, setShowContacts, setIsGroup }) => {
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

  useEffect(() => {
    getContacts(setContacts, setLoadingcontacts, localuser)
    fetchAllChats(localuser, allchats, setAllchats)

    if (socket) {
      socket.on('updateContacs', () => {
        getContacts(setContacts, setLoadingcontacts, localuser)
        fetchAllChats(localuser, allchats, setAllchats)
      })
    }
  }, [allchats, localuser, setAllchats, socket])

  const onClickHandlerJoin = (otherUserId, localuser, currentchat) => {
    handleJoinRoom(otherUserId, localuser, currentchat, socket)
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
    <section className='w-full md:w-60 lg:w-80 max-h-[40em] overflow-y-auto bg-white md:flex flex-col justify-start items-center gap-18 pt-4 md:p-4'>
      <input
        type='text'
        placeholder='Buscar contacto'
        className='input bg-gray-100 text-black rounded-md w-full max-w-2xl placeholder:font-semibold'
        value={searchText}
        onChange={handleSearch} // Asignar la función de búsqueda al evento onChange
      />
      <ul className='bg-white flex w-full flex-col gap-4 pt-6'>
        {loadingcontacts
          ? (
            <div className='flex items-center mt-12 justify-center gap-2'>
              <LoadingGif />
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
                          <ContactListItem key={contact.user_id} contact={contact} localuser={localuser} currentchat={currentchat} existingChat={existingChat} toggleSideContactsStyle={toggleSideContactsStyle} toggleHamburguerStyle={toggleHamburguerStyle} onClickHandlerJoin={onClickHandlerJoin} setCurrentchat={setCurrentchat} setShowContacts={setShowContacts} limitedUsername={limitedUsername} setIsGroup={setIsGroup} />
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
                          <ContactListItem key={contact.user_id} contact={contact} localuser={localuser} currentchat={currentchat} existingChat={existingChat} toggleSideContactsStyle={toggleSideContactsStyle} toggleHamburguerStyle={toggleHamburguerStyle} onClickHandlerJoin={onClickHandlerJoin} setCurrentchat={setCurrentchat} setShowContacts={setShowContacts} limitedUsername={limitedUsername} setIsGroup={setIsGroup} />
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
