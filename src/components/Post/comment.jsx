// import React from 'react'
import { useEffect, useState } from 'react'
// import CommentsData from './Comments.json'
import './Comments.css'
import { makeRequest } from '../../library/axios'

const Comment = ({comment_user_id, text}) => {
  const [user, setUser] = useState({})

  useEffect(() => {
    const getUser = async () => {
      await makeRequest.get(`/user/find/id/${comment_user_id}`)
        .then(res => {
          setUser(res.data.user)
        })
        .catch(err => console.log(err))
    }

    getUser()
  }, [])

  return (
    <li key={user.user_id}>
        <div className='comentario flex items-center py-4'>
            <img className='h-12 w-12 rounded-full' src={user.thumbnail} alt='Imagen de usuario' />
            <div className='contenido-comentario ml-2 text-left '>
                <strong>{user.username}</strong>: {text}
            </div>
        </div>
    </li>
  )
}

export default Comment