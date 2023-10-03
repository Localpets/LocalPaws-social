/* eslint-disable react/prop-types */
function ContactListItem ({
  contact,
  localuser,
  currentchat,
  existingChat,
  toggleSideContactsStyle,
  toggleHamburguerStyle,
  onClickHandlerJoin,
  setCurrentchat,
  setShowContacts,
  limitedUsername
}) {
  const handleItemClick = () => {
    toggleSideContactsStyle()
    toggleHamburguerStyle()
    onClickHandlerJoin(contact.user_id, localuser, currentchat)
    setCurrentchat({
      conversation: existingChat || {
        0: {
          receiver_id: contact.user_id,
          sender_id: localuser.user_id
        }
      },
      username: limitedUsername,
      thumbnail: contact.thumbnail
    })
    setShowContacts(false)
  }

  return (
    <li key={contact.user_id}>
      <button
        className='btn-ghost p-2 w-full rounded-lg flex justify-left gap-2'
        onClick={handleItemClick}
      >
        <div className='text-black flex gap-2 items-center'>
          <img className='w-12 h-12 rounded-full' src={contact.thumbnail} alt='avatar' />
          <h1 className='text-black font-bold text-m'>{contact.username}</h1>
        </div>
      </button>
    </li>
  )
}

export default ContactListItem
