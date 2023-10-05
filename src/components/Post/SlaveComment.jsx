import { useEffect, useState } from 'react'
import { Link } from '@tanstack/router'
import { makeRequest } from '../../library/axios'
import useFindUser from '../../hooks/useFindUser'
import { ReactionBarSelector } from '@charkour/react-reactions'
import PropTypes from 'prop-types'

const Comment = ({ slaveComment, reactions, currentUser, isActive, setActiveComment, handleDeleteComment }) => {
  const { user } = useFindUser()
  const isCurrentUserCommentAuthor = user && user.userId === slaveComment.comment_user_id

  // Like variables
  const [likeCreating, setLikeCreating] = useState(false)
  const [likes, setLikes] = useState(0)
  const [userLike, setUserLike] = useState(null)
  const [liked, setLiked] = useState(false)
  const [likeStyle, setLikeStyle] = useState('fa-solid fa-heart mr-2 text-lg text-gray-400')

  // Comment variables
  const [commentLoading, setCommentLoading] = useState(false)
  const [isHovering, setIsHovering] = useState(false)

  // Input variables
  const [isEditing, setIsEditing] = useState(false)
  const [loadingUser, setLoadingUser] = useState(true)

  // Reaction bar variables
  const [isReactionBarOpen, setIsReactionBarOpen] = useState(false)
  const [closeTimeout, setCloseTimeout] = useState(null)
  const [currentReaction, setCurrentReaction] = useState(null)

  useEffect(() => {
    // Fetch likes for the comment when the component mounts
    fetchLikesForComment()
    // Set the initial state of the reaction bar
    setIsReactionBarOpen(isActive)
    if (currentUser) {
      setLoadingUser(false)
    }
  }, [isActive])

  // Fetch likes for the comment
  const fetchLikesForComment = async () => {
    try {
      // Replace 'comment_id' with the actual key to access the comment's ID in your 'comment' object
      const response = await makeRequest.get(`/comment/likes/${slaveComment.comment_id}`)
        .catch((error) => {
          console.error('Error fetching likes for comment:', error)
        })
      const likeData = response.data.likes

      setLikes(likeData.length)

      if (currentUser) {
        const userLiked = likeData.some((like) => like.user_id === currentUser.userId)
        if (userLiked) {
          setUserLike(likeData.find((like) => like.user_id === currentUser.userId))
          switch (likeData.find((like) => like.user_id === currentUser.userId).like_type) {
            case 'Like':
              setLikeStyle('fa-solid fa-heart mr-2 text-lg text-red-600')
              break
            case 'Haha':
              setLikeStyle('fa-solid fa-laugh-squint mr-2 text-lg text-yellow-500')
              break
            case 'Triste':
              setLikeStyle('fa-solid fa-sad-tear mr-2 text-lg text-blue-500')
              break
            case 'Enojado':
              setLikeStyle('fa-solid fa-angry mr-2 text-lg text-red-500')
              break
            case 'Asombrado':
              setLikeStyle('fa-solid fa-surprise mr-2 text-lg text-purple-500')
              break
            default:
              break // Do nothing
          }
          setCurrentReaction(likeData.find((like) => like.user_id === currentUser.userId).like_type)
          // Update 'likeStyle' here based on 'currentReaction' as in your 'PostPage' component
          setLiked(true)
        }
      }
    } catch (error) {
      console.error(error)
    }
  }

  // Get like style
  function getLikeStyle (type) {
    switch (type) {
      case 'Like' || 'like':
        return 'fa-solid fa-heart mr-2 text-lg text-red-600'
      case 'Haha':
        return 'fa-solid fa-laugh-squint mr-2 text-lg text-yellow-500'
      case 'Triste':
        return 'fa-solid fa-sad-tear mr-2 text-lg text-blue-500'
      case 'Enojado':
        return 'fa-solid fa-angry mr-2 text-lg text-red-500'
      case 'Asombrado':
        return 'fa-solid fa-surprise mr-2 text-lg text-purple-500'
      default:
        return ''
    }
  }

  // Delete like
  const deleteLike = async () => {
    setLikeCreating(true)
    if (currentUser) {
      setLikeStyle('fa-solid fa-heart mr-2 text-lg text-gray-400')
      setLikes(likes - 1)
      setLiked(false)
      setCurrentReaction(null)
      setUserLike(null)
      await makeRequest
        .delete(`/comment/like/delete/${slaveComment.comment_id}/${currentUser.userId}`)
        .then((res) => {
          setLikeCreating(false)
          console.log(res)
        })
        .catch((error) => {
          console.error('Error deleting like:', error)
        })
    }
  }

  // Reset like state and style
  const resetLikeState = () => {
    setLikeStyle('fa-solid fa-heart mr-2 text-lg text-gray-400')
    setLikes(likes - 1)
    setLiked(false)
    setCurrentReaction(null)
    setUserLike(null)
  }

  // HANDLE LIKES OF COMMENTS IN A CORRECT WAY
  const handleLike = async (type) => {
    setLikeCreating(true)
    if (!liked && !loadingUser) {
      setLikes(likes + 1)
      setLiked(true)
      setCurrentReaction(type)

      const likeForDto = type
      console.log('Type:', type)

      // Debug logging
      console.log('Data being sent:', {
        like_type: likeForDto,
        comment_id: slaveComment.comment_id,
        user_id: currentUser.userId
      })

      await makeRequest
        .post(`/comment/like/create/${slaveComment.comment_id}`, {
          like_type: likeForDto,
          user_id: currentUser.userId
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then((res) => {
          setLikeStyle(getLikeStyle(type))
          setLikeCreating(false)
          console.log('Response:', res)
          setUserLike({
            like_type: type,
            like_id: res.data.like.like_id,
            comment_id: slaveComment.comment_id,
            user_id: currentUser.userId
          })
        })
        .catch((error) => {
          console.error('Error creating like:', error)
        })
    }

    if (liked && type === currentReaction && !loadingUser) {
      resetLikeState()
      makeRequest
        .delete(`/comment/like/delete/${slaveComment.comment_id}/${currentUser.userId}`)
        .then((res) => {
          setLikeCreating(false)
          console.log(res)
        })
        .catch((error) => {
          console.error('Error deleting like:', error)
        })
    }

    if (liked && type !== currentReaction && userLike && !loadingUser) {
      setCurrentReaction(type)
      console.log('Data being sent:', {
        like_type: type,
        comment_id: slaveComment.comment_id,
        like_id: userLike.like_id,
        user_id: currentUser.userId
      })

      makeRequest
        .put(`/comment/like/update/${slaveComment.comment_id}`, {
          like_id: userLike.like_id,
          user_id: currentUser.userId,
          like_type: type
        })
        .then((res) => {
          setLikeStyle(getLikeStyle(type))
          setLikeCreating(false)
          console.log(res)
        })
        .catch((error) => {
          console.error('Error updating like:', error)
        })
    }
  }
  // Handle delete comment
  const handleDeleteClick = () => {
    // Lógica para eliminar el comentario, pasa el comentario como argumento
    if (isCurrentUserCommentAuthor && !loadingUser) {
      handleDeleteComment(slaveComment.comment_id)
    }
  }
  // Handle reaction selector
  const handleSelector = (type) => {
    console.log(type)
    handleMouseLeave()
    handleLike(type)
  }
  // Handle edit comment
  const handleEditClick = async (e) => {
    e.preventDefault()
    setIsEditing(true)
    setCommentLoading(true)
    // Get the updated comment text from the input field
    // Make a PUT request to update the comment
    const previousSibling = e.target.previousSibling
    if (previousSibling && previousSibling.value !== undefined) {
      const updatedCommentText = previousSibling.value
      if (updatedCommentText === slaveComment.text || updatedCommentText === null) {
        setIsEditing(false)
        setCommentLoading(false)
        return
      }
      try {
        await makeRequest.put(`/comment/update/${slaveComment.comment_id}`, {
          text: updatedCommentText
        }).then((res) => {
          console.log(res)
          slaveComment.text = updatedCommentText
        })
        setIsEditing(false)
      } catch (error) {
        console.error(error)
      } finally {
        setCommentLoading(false)
      }
    } else {
      // Manejar el caso en el que previousSibling sea null o value sea undefined.
      setIsEditing(false)
      setCommentLoading(false)
    }
  }

  // Handle mouse enter event on the button
  const handleMouseEnter = () => {
    clearTimeout(closeTimeout) // Cancelar cualquier temporizador de cierre pendiente
    setIsReactionBarOpen(true)
    setActiveComment(slaveComment.comment_id)
  }

  // Handle mouse leave event on the ReactionBar or the button
  const handleMouseLeave = () => {
    // Establecer un temporizador para cerrar la barra después de 500ms (ajusta el valor según desees)
    const timeoutId = setTimeout(() => {
      setIsReactionBarOpen(false)
      setActiveComment(null)
    }, 700)
    setCloseTimeout(timeoutId)
  }

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
          <section>
            {
            likeCreating
              ? (
                <span className='loading loading-spinner' />
                )
              : (
                <div>
                  <button
                    onClick={liked ? deleteLike : handleLike}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    <i className={likeStyle} />
                  </button>
                  <span>{likes}</span>
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

Comment.propTypes = {
  slaveComment: PropTypes.object.isRequired,
  reactions: PropTypes.array.isRequired,
  currentUser: PropTypes.object,
  isActive: PropTypes.bool.isRequired,
  setActiveComment: PropTypes.func.isRequired,
  handleDeleteComment: PropTypes.func.isRequired
}

export default Comment
