import React from 'react'
import { Link } from '@tanstack/router'
import { makeRequest } from '../../library/axios'
import useFindUser from '../../hooks/useFindUser'
import { ReactionBarSelector } from '@charkour/react-reactions'
import PropTypes from 'prop-types'

const Comment = ({ comment, deleteComment, reactions, currentUser }) => {
  const { user } = useFindUser()

  const [isHovering, setIsHovering] = React.useState(false)
  const [loadingUser, setLoadingUser] = React.useState(true)

  const isCurrentUserCommentAuthor = user !== null && comment.comment_user_id === user.user_id
  const [likes, setLikes] = React.useState(0)
  const [userLike, setUserLike] = React.useState(null)
  const [liked, setLiked] = React.useState(false)
  const [likeStyle, setLikeStyle] = React.useState('fa-solid fa-heart mr-2 text-lg text-purple-700')
  const [currentReaction, setCurrentReaction] = React.useState(null)
  const [isHoveringLike, setIsHoveringLike] = React.useState(false)

  React.useEffect(() => {
    // Fetch likes for the comment when the component mounts
    fetchLikesForComment()
    if (currentUser) {
      setLoadingUser(false)
    }
  }, [])

  const fetchLikesForComment = async () => {
    try {
      // Replace 'comment_id' with the actual key to access the comment's ID in your 'comment' object
      const response = await makeRequest.get(`/comment/likes/${comment.comment_id}`)
      const likeData = response.data.likes

      setLikes(likeData.length)

      if (currentUser) {
        const userLiked = likeData.some((like) => like.user_id === currentUser.userId)
        if (userLiked) {
          setLikeStyle('fa-solid fa-heart mr-2 text-lg text-red-600')
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
              break
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

  function getLikeStyle (type) {
    switch (type) {
      case 'Like':
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

  const deleteLike = async () => {
    if (currentUser) {
      setLikeStyle('fa-solid fa-heart mr-2 text-lg')
      setLikes(likes - 1)
      setLiked(false)
      setCurrentReaction(null)
      setUserLike(null)
      await makeRequest
        .delete(`/comment/like/delete/${comment.comment_id}/${currentUser.userId}`)
        .then((res) => {
          console.log(res)
        })
        .catch((error) => {
          console.error('Error deleting like:', error)
        })
    }
  }

  const resetLikeState = () => {
    setLikeStyle('fa-solid fa-heart mr-2 text-lg text-purple-700')
    setLikes(likes - 1)
    setLiked(false)
    setCurrentReaction(null)
    setUserLike(null)
  }

  // HANDLE LIKES OF COMMENTS IN A CORRECT WAY
  const handleLike = async (type) => {
    if (!liked && !loadingUser) {
      setLikes(likes + 1)
      setLiked(true)
      setCurrentReaction(type)
      setUserLike({
        like_type: type,
        comment_id: comment.comment_id,
        user_id: currentUser.userId
      })

      if (typeof type !== 'string') {
        type = 'Like'
      }

      // Debug logging
      console.log('Data being sent:', {
        like_type: type,
        comment_id: comment.comment_id,
        user_id: currentUser.userId
      })

      await makeRequest
        .post(`/comment/like/create/${comment.comment_id}`, {
          like_type: type,
          user_id: currentUser.userId
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then((res) => {
          console.log('Response:', res)
          setLikeStyle(getLikeStyle(type))
        })
        .catch((error) => {
          console.error('Error creating like:', error)
        })
    }

    if (liked && type === currentReaction && !loadingUser) {
      resetLikeState()
      makeRequest
        .delete(`/comment/like/delete/${comment.comment_id}/${currentUser.userId}`)
        .then((res) => {
          console.log(res)
        })
        .catch((error) => {
          console.error('Error deleting like:', error)
        })
    }

    if (liked && type !== currentReaction && userLike && !loadingUser) {
      setLikeStyle(getLikeStyle(type))
      setLiked(true)
      setCurrentReaction(type)
      setUserLike({
        like_type: type,
        comment_id: comment.comment_id,
        like_id: userLike.like_id,
        user_id: currentUser.userId
      })

      console.log('Data being sent:', {
        like_type: type,
        comment_id: comment.comment_id,
        like_id: userLike.like_id,
        user_id: currentUser.userId
      })

      makeRequest
        .put(`/comment/like/update/${comment.comment_id}`, {
          like_id: userLike.like_id,
          user_id: currentUser.userId,
          like_type: type
        })
        .then((res) => {
          console.log(res)
        })
        .catch((error) => {
          console.error('Error updating like:', error)
        })
    }
  }

  const handleDeleteClick = () => {
    // Lógica para eliminar el comentario, pasa el comentario como argumento
    if (isCurrentUserCommentAuthor && !loadingUser) {
      deleteComment(comment.comment_id)
    }
  }

  const handleSelector = (type) => {
    console.log(type)
    handleLike(type)
  }

  return (
    <li>
      <div className='flex flex-col justify-center py-2' onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
        <div className='flex gap-2'>
          <Link to={`/profile/${comment.comment_user_id}`}>
            <img
              className='h-8 w-8 rounded-full'
              src={comment.ImageUser}
              alt='imagen-perfil-usuario'
            />
          </Link>
          <div className='ml-2 text-left text-md'>
            {comment.usuario}: {comment.text}
          </div>
          {/* Mostrar el botón de eliminación solo si el usuario actual es el autor del comentario */}
          {isCurrentUserCommentAuthor && isHovering && (
            <div className='dropdown pl-8'>
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
                  <button onClick={handleDeleteClick} className='hover:text-black'>Borrar comentario</button>
                </li>
              </ul>
            </div>
          )}
        </div>
        {/* Display the number of likes and the like button */}
        <div className='flex gap-2 py-2 items-center h-12'>
          <div>
            <button onClick={liked ? deleteLike : handleLike} onMouseEnter={() => setIsHoveringLike(true)}>
              <i className={likeStyle} />
            </button>
            <span>{likes}</span>
          </div>
          {
          isHoveringLike && (
            <div className='relative' onMouseEnter={() => setIsHoveringLike(true)} onMouseLeave={() => setIsHoveringLike(false)}>
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
  comment: PropTypes.object.isRequired,
  deleteComment: PropTypes.func.isRequired,
  reactions: PropTypes.array.isRequired,
  currentUser: PropTypes.object.isRequired
}

export default Comment
