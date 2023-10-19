import { useState } from 'react'
import { Link } from '@tanstack/router'
import { ReactionBarSelector } from '@charkour/react-reactions'
import PropTypes from 'prop-types'
import useSlaveCommentsContext from '../../hooks/Posts/useSlaveCommentsContext'

const SlaveComment = ({ slaveComment, reactions, currentUser, handleDeleteComment, handleSelectParentComment }) => {
  const {
    likeStyle,
    likeCreating,
    likes,
    handleLike,
    handleMouseEnter,
    handleMouseLeave,
    isReactionBarOpen,
    handleSelector,
    deleteLike,
    liked,
    isCurrentUserCommentAuthor,
    commentLoading,
    handleDeleteClick,
    isEditing,
    setIsEditing,
    setIsHovering,
    handleEditClick,
    isHovering
  } = useSlaveCommentsContext(slaveComment, currentUser, handleDeleteComment)

  const [commentSelectedForReply, setCommentSelectedForReply] = useState(null)
  return (
    <li className='border-l-2 ml-4 pl-4'>
      <div className='flex flex-col w-full justify-center py-2' onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
        <div className='flex gap-2'>
          <Link to={`/profile/${slaveComment.user.user_id}`}>
            <img
              className='h-8 w-8 rounded-full'
              src={slaveComment.user.avatar}
              alt='imagen-perfil-usuario'
            />
          </Link>
          <div className='ml-2 text-left text-md max-w-[65%] lg:max-w-75% lg:items-center gap-2 flex flex-col lg:flex-row'>
            {slaveComment.user.username}: {isEditing
              ? <div className='flex gap-2 items-center'>
                <input type='text' defaultValue={slaveComment.text} className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm' />
                <button
                  className='btn btn-square bg-white hover:bg-secondary border-white border-none'
                  onClick={handleEditClick}
                  disabled={commentLoading}
                >
                  {commentLoading
                    ? (
                      <span className='loading loading-sm' /> // Mostrar animación de carga
                      )
                    : (
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        height='1em'
                        viewBox='0 0 512 512'
                        color='#ffffff'
                      >
                        <path d='M16.1 260.2c-22.6 12.9-20.5 47.3 3.6 57.3L160 376V479.3c0 18.1 14.6 32.7 32.7 32.7c9.7 0 18.9-4.3 25.1-11.8l62-74.3 123.9 51.6c18.9 7.9 40.8-4.5 43.9-24.7l64-416c1.9-12.1-3.4-24.3-13.5-31.2s-23.3-7.5-34-1.4l-448 256zm52.1 25.5L409.7 90.6 190.1 336l1.2 1L68.2 285.7zM403.3 425.4L236.7 355.9 450.8 116.6 403.3 425.4z' />
                      </svg> // Mostrar "Comentar" cuando no se está cargando
                      )}
                </button>
                {/* eslint-disable-next-line react/jsx-closing-tag-location */}
              </div>
              : slaveComment.text}
          </div>
          {/* Mostrar el botón de eliminación solo si el usuario actual es el autor del comentario */}
          {isCurrentUserCommentAuthor && isHovering && (
            <div className='dropdown dropdown-end pl-8'>
              <label tabIndex={0} className='hover:cursor-pointer'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='icon icon-tabler icon-tabler-dots-horizontal'
                  width='24'
                  height='24'
                  viewBox='0 0 24 24'
                  strokeWidth='1.5'
                  stroke='#bababa'
                  fill='none'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                >
                  <path stroke='none' d='M0 0h24v24H0z' />
                  <circle cx='5' cy='12' r='1' />
                  <circle cx='12' cy='12' r='1' />
                  <circle cx='19' cy='12' r='1' />
                </svg>
              </label>
              <ul tabIndex={0} className='dropdown-content z-[1] menu p-2 shadow bg-white rounded-box w-52'>
                <li>
                  <button onClick={handleDeleteClick} className='text-black hover:text-red-600 dark:hover:text-red-600'>
                    <p>Eliminar comentario</p>
                    <i className='fa-solid fa-trash text-md' />
                  </button>
                </li>
                <li>
                  {
                    isEditing
                      ? (
                        <button onClick={() => setIsEditing(false)} className='text-black hover:text-yellow-600 dark:hover:text-yellow-600'>
                          <p>Cancelar edición</p>
                          <i className='fa-solid fa-x text-md' />
                        </button>
                        )
                      : (
                        <button onClick={() => setIsEditing(true)} className='text-black hover:text-blue-600 dark:hover:text-blue-600'>
                          <p>Editar comentario</p>
                          <i className='fa-solid fa-edit text-md' />
                        </button>
                        )
                  }
                </li>
              </ul>
            </div>
          )}
        </div>
        {/* Display the number of likes and the like button */}
        <div className='flex gap-2 py-2 items-center ml-12 h-12'>
          <section className='w-40'>
            {
            likeCreating
              ? (
                <span className='loading loading-spinner' />
                )
              : (
                <div className='flex justify-between'>
                  <div>
                    <button
                      onClick={liked ? deleteLike : handleLike}
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                    >
                      <span className='pr-2'>{likeStyle}</span>
                    </button>
                    <span>{likes}</span>
                  </div>
                  <button onClick={() => {
                    const isSelectedForReply = !commentSelectedForReply
                    setCommentSelectedForReply(isSelectedForReply)

                    if (isSelectedForReply) {
                      handleSelectParentComment(slaveComment)
                    } else {
                      handleSelectParentComment(null)
                    }
                  }}
                  >
                    <span>Responder</span>
                  </button>
                </div>
                )
            }
          </section>
          {
          isReactionBarOpen && (
            <div
              className='relative' onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}
            >
              <ReactionBarSelector onSelect={handleSelector} reactions={reactions} iconSize='18px' />
            </div>
          )
          }
        </div>
      </div>
    </li>
  )
}

SlaveComment.propTypes = {
  slaveComment: PropTypes.object.isRequired,
  reactions: PropTypes.array.isRequired,
  currentUser: PropTypes.object,
  handleDeleteComment: PropTypes.func.isRequired,
  handleSelectParentComment: PropTypes.func.isRequired
}

export default SlaveComment
