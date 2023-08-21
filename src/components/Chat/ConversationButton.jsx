import PropTypes from 'prop-types'
import useChatStore from '../../context/ChatStore'
const ConversationButton = ({ user, lastMessage, thumbnail }) => {
  const { toggleSideContactsStyle, toggleHamburguerStyle } = useChatStore()
  return (
    <li className='w-full'>
      <button
        className='btn-ghost p-2 rounded-lg w-full flex justify-left gap-2' onClick={() => {
          toggleSideContactsStyle()
          toggleHamburguerStyle()
        }}
      >
        <div className='text-black'>
          <img className='w-12 h-12 rounded-full' src={thumbnail} />
        </div>
        <div className='flex flex-col items-start justify-center'>
          <div className='text-black font-bold text-md'>{user}</div>
          <div className='text-black text-sm'>{lastMessage}</div>
        </div>
      </button>
    </li>
  )
}

ConversationButton.propTypes = {
  user: PropTypes.string.isRequired,
  lastMessage: PropTypes.string.isRequired,
  thumbnail: PropTypes.string.isRequired
}

export default ConversationButton
