/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react' // Importa useState para gestionar el valor de visualización
import { makeRequest } from '../../../library/axios'

const UnreadMessageCounter = ({ setUnreadmsg, unreadmsg, user }) => {
  useEffect(() => {
    const fetchStatus = () => {
      if (user) {
        makeRequest.get(`message/get-unread-status/${user.user_id}`)
          .then((response) => {
            setUnreadmsg(response.data.unreadMessages)
          })
          .catch((error) => {
            console.log('Error:', error)
          })
      }
    }

    fetchStatus()
  }, [setUnreadmsg, user])

  // Utiliza useState para gestionar el valor de visualización
  const [displayCount, setDisplayCount] = useState('0')

  useEffect(() => {
    if (unreadmsg.length > 9) {
      setDisplayCount('9+')
    } else {
      setDisplayCount(unreadmsg.length.toString())
    }
  }, [unreadmsg])

  return (
    <div>
      {displayCount !== '0' && (
        <div className='fixed bg-red-600 rounded-full h-5 w-5 top-[24em] left-[11.8em] text-white'>
          <p className='flex p-[0.2em] justify-center'>{displayCount}</p>
        </div>
      )}
    </div>
  )
}

export default UnreadMessageCounter
