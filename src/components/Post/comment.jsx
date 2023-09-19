import { Link } from '@tanstack/router'
import { makeRequest } from '../../library/axios'
import useFindUser from '../../hooks/useFindUser'
import PropTypes from 'prop-types'

const Comment = ({ Comments, deleteComment }) => {
  const { user } = useFindUser()
  console.log(user)

  const handleDeleteComment = () => {
    makeRequest.delete(`/comment/delete/${Comments.comment_id}`)
      .then(res => {
        console.log(res)
      })
      .catch(err => {
        console.log(err)
      })
  }

  return (
    <li>
      <div className='comentario flex items-center py-2'>
        <Link to='#'>
          <img
            className='h-8 w-8 rounded-full'
            src={Comments.ImageUser}
            alt='imagen-perfil-usuario'
          />
        </Link>
        <div className='contenido-comentario ml-2 text-left text-md'>
          {Comments.usuario}: {Comments.text}
        </div>
        {/* if the user is logged in and the user is the same as the comment, show the delete button */}
        {user !== null && Comments.comment_user_id === user.user_id && (
          <button
            className='ml-2 text-red-500 flex'
            onClick={handleDeleteComment}
          >
            <svg
              className='w-4 h-4 justify-self-end'
              fill='currentColor'
              viewBox='0 0 20 20'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                fillRule='evenodd'
                d='M14.293 5.293a1 1 0 010 1.414L7.414
                14H9a1 1 0 110 2H5a1 1 0 110-2h1.586l6.293
                -6.293a1 1 0 011.414 0z'
                clipRule='evenodd'
              />
            </svg>
          </button>
        )}
      </div>
    </li>
  )
}

Comment.propTypes = {
  Comments: PropTypes.object.isRequired
}

export default Comment
