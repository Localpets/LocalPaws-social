import { Link } from '@tanstack/router'
import dayjs from 'dayjs'
import PropTypes from 'prop-types'

const CommentsRegistryComponent = ({ comments, onClose }) => {
  const setCommentsModal = (value) => {
    onClose(value)
  }

  return (
    <div className='fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-[99999]'>
      <div className='bg-white rounded-md p-4 w-full max-w-2xl h-[85%] overflow-y-scroll'>
        <div className='flex items-center justify-between mb-4'>
          <h2 className='text-xl font-bold'>Registro de comentarios</h2>
          <button
            className='btn btn-primary btn-sm'
            onClick={() => setCommentsModal(false)}
          >
            Cerrar
          </button>
        </div>
        <div className='h-full'>
          <ul className='grid grid-cols-1 gap-4 p-6'>
            {comments.map((comment) => (
              <li className='grid grid-cols-3 gap-4' key={comment.comment_id}>
                <div className='flex flex-col justify-center items-center'>
                  <img
                    className='w-16 h-16 rounded-full'
                    src={comment.user.avatar}
                    alt={comment.user.username}
                  />
                  <p className='text-xs text-gray-400'>
                    {comment.user.username}
                  </p>
                </div>
                <div>
                  <p className='text-sm font-semibold text-gray-600'>
                    {comment.text}
                  </p>
                  <p className='text-xs text-gray-400'>
                    {dayjs(comment.created_at).format('DD/MM/YYYY HH:mm:ss')}
                  </p>
                </div>
                <div className='flex flex-col justify-center items-center'>
                  <Link
                    className='btn btn-primary btn-sm'
                    to={`/profile/${comment.user.user_id}`}
                  >
                    Ver perfil
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>

  )
}

CommentsRegistryComponent.propTypes = {
  comments: PropTypes.arrayOf(PropTypes.string).isRequired,
  onClose: PropTypes.func.isRequired
}

export default CommentsRegistryComponent
