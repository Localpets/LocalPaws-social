/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
import { useState, useEffect } from 'react'
import { Link } from '@tanstack/router'
import PropTypes from 'prop-types'
import { makeRequest } from '../../library/axios'
import { ReactionBarSelector } from '@charkour/react-reactions'
import useAuthStore from '../../context/AuthContext'
import useFindUser from '../../hooks/useFindUser'

const Post = ({ post, postUser, deletePost }) => {
  // Initialization of states
  // userState
  const { user } = useFindUser()
  const [currentUser, setCurrentUser] = useState(null)
  const [isCurrentUserCommentAuthor, setIsCurrentUserCommentAuthor] = useState(false)

  // imageLoaded state
  const [imageLoaded, setImageLoaded] = useState(false)
  const [componentStyle, setComponentStyle] = useState('border p-4 bg-white rounded-lg w-full h-auto')

  // like states
  const [likes, setLikes] = useState(0)
  const [liked, setLiked] = useState(false)
  const [likeStyle, setLikeStyle] = useState('fa-solid fa-heart mr-2 text-lg text-gray-400')
  const [userLike, setUserLike] = useState(null)
  const [isReactionBarOpen, setIsReactionBarOpen] = useState(false)
  const [currentReaction, setCurrentReaction] = useState(null)
  const [closeTimeout, setCloseTimeout] = useState(null)
  const [likeCreating, setLikeCreating] = useState(false)

  // post props
  const { text, image, category, createdAt, post_id, post_user_id } = post

  // post user props
  const { first_name, last_name, thumbnail } = postUser
  const dateToLocal = new Date(createdAt).toLocaleDateString()

  // coments states
  const [comments, setComments] = useState(0)

  useEffect(() => {
    if (image !== 'no image') {
      setImageLoaded(true)
      setComponentStyle('border p-4 bg-white rounded-lg w-full h-auto')
    }

    const fetchLikes = async () => {
      const { data } = await makeRequest.get(`/like/post/${post_id}`)
      setLikes(data.likes.length)
      const checkIfUserLiked = data.likes.find(like => like.user_id === user?.user_id)
      if (checkIfUserLiked) {
        setLiked(true)
      }
    }

    if (user?.user_id === post_user_id) {
      setIsCurrentUserCommentAuthor(true)
    }

    fetchLikes()
  }, [image, setLiked, post_id, user, setIsCurrentUserCommentAuthor, post_user_id])

  useEffect(() => {
    if (user) {
      setCurrentUser(user)
    }
  }, [user])

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const response = await makeRequest.get(`/like/post/${post_id}`)
        const likeData = response.data.likes

        setLikes(likeData.length)

        if (currentUser) {
          const userLiked = likeData.some((like) => like.user_id === currentUser.user_id)
          if (userLiked) {
            setUserLike(likeData.find((like) => like.user_id === currentUser.user_id))
            switch (likeData.find((like) => like.user_id === currentUser.user_id).like_type) {
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
            setLiked(true)
            setCurrentReaction(likeData.find((like) => like.user_id === currentUser.user_id).like_type)
          }
        }
      } catch (error) {
        console.error(error)
      }
    }

    const fetchComments = async () => {
      try {
        const response = await makeRequest.get(`/comment/find/post/${post.post_id}`)
        setComments(response.data.comments.length)
      } catch (error) {
        console.error(error)
      }
    }

    fetchComments()
    fetchLikes()
  }, [post_id, currentUser, setComments, comments])

  const ReactionsArray =
  [{ label: 'Like', node: <div>💗</div>, key: 'LIKE' },
    { label: 'Haha', node: <div>😹</div>, key: 'SMILE' },
    { label: 'Triste', node: <div>😿</div>, key: 'TEARS' },
    { label: 'Enojado', node: <div>😾</div>, key: 'ANGRY' },
    { label: 'Asombrado', node: <div>🙀</div>, key: 'SURPRISED' }]

  async function handleLike (type = 'Like') {
    setLikeCreating(true)
    if (!liked && currentUser) {
      setLikes(likes + 1)
      setLiked(true)
      setCurrentReaction(type)

      if (typeof type !== 'string') {
        type = 'Like'
      }

      // Debug logging
      console.log('Data being sent:', {
        like_type: type,
        post_id: post.post_id,
        user_id: currentUser.user_id
      })

      await makeRequest
        .post('/like/create/', {
          like_type: type,
          post_id: post.post_id,
          user_id: currentUser.user_id
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then((res) => {
          setLikeCreating(false)
          setUserLike({
            like_type: type,
            post_id: post.post_id,
            user_id: currentUser.user_id,
            like_id: res.data.newLike.like_id
          })
          console.log('Response:', res)
          setLikeStyle(getLikeStyle(type))
        })
        .catch((error) => {
          console.error('Error creating like:', error)
        })
    }

    if (liked && type === currentReaction && currentUser) {
      resetLikeState()
      makeRequest
        .delete(`/like/delete/${post.post_id}/${currentUser.user_id}`)
        .then((res) => {
          setLikeCreating(false)
          console.log(res)
        })
        .catch((error) => {
          console.error('Error deleting like:', error)
        })
    }

    if (liked && type !== currentReaction && userLike && currentUser) {
      setLikeStyle(getLikeStyle(type))
      setLiked(true)
      setCurrentReaction(type)
      setUserLike({
        like_type: type,
        post_id: post.post_id,
        like_id: userLike.like_id,
        user_id: currentUser.user_id
      })

      makeRequest
        .put(`/like/update/${userLike.like_id}`, {
          like_id: userLike.like_id,
          like_type: type
        })
        .then((res) => {
          setLikeCreating(false)
          console.log(res)
        })
        .catch((error) => {
          console.error('Error updating like:', error)
        })
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

  // Delete like
  const deleteLike = async () => {
    setLikeCreating(true)
    if (currentUser) {
      setLikeStyle('fa-solid fa-heart mr-2 text-lg')
      setLikes(likes - 1)
      setLiked(false)
      setCurrentReaction(null)
      setUserLike(null)
      await makeRequest.delete(`/like/delete/${post_id}/${currentUser.user_id}`)
        .then((res) => {
          setLikeCreating(false)
          console.log(res)
        })
        .catch((error) => {
          console.error('Error deleting like:', error)
        })
    }
  }

  const handleSelector = (e) => {
    handleLike(e)
    setIsReactionBarOpen(false)
  }

  function resetLikeState () {
    setLikeStyle('fa-solid fa-heart mr-2 text-lg')
    setLikes(likes - 1)
    setLiked(false)
    setCurrentReaction(null)
    setUserLike(null)
  }

  // Handle mouse enter event on the button
  const handleMouseEnter = () => {
    clearTimeout(closeTimeout) // Cancelar cualquier temporizador de cierre pendiente
    setIsReactionBarOpen(true)
  }

  // Handle mouse leave event on the ReactionBar or the button
  const handleMouseLeave = () => {
    // Establecer un temporizador para cerrar la barra después de 500ms (ajusta el valor según desees)
    const timeoutId = setTimeout(() => {
      setIsReactionBarOpen(false)
    }, 700)
    setCloseTimeout(timeoutId)
  }

  // Aquí puedes obtener la URL de la página actual, por ejemplo:
  const pageUrl = window.location.href

  // Función para manejar el clic del botón de compartir
  const handleShareClick = () => {
    // Puedes usar la función `navigator.share` para abrir un cuadro de diálogo de compartir si está disponible en el navegador.
    if (navigator.share) {
      navigator.share({
        title: `${first_name} en PawsPlorer: ${text}`,
        url: pageUrl
      })
        .then(() => console.log('Página compartida con éxito'))
        .catch((error) => console.error('Error al compartir:', error))
    } else {
      // Si el navegador no admite la API de compartir, puedes proporcionar un mensaje alternativo o implementar una lógica personalizada.
      alert(`Comparte esta página: ${pageUrl}`)
    }
  }

  return (
    <article className={componentStyle}>
      <header className='flex w-full'>
        <Link to={`/post/${post_id}`} className='flex p-4 w-[50%]'>
          <img
            className='h-9 w-9 rounded-full '
            src={thumbnail}
            alt='user-thumbnail'
          />
          <p className='ml-2 flex flex-shrink-0 items-center font-medium'>
            {first_name} {last_name}
            <span className='ml-1 text-sm leading-5 '>
              {dateToLocal} · {category}
            </span>
          </p>
        </Link>
        {/* Si el usuario es el duenho del post que sea capaz de elimnarlo */}
        {isCurrentUserCommentAuthor && (
          <div className='flex justify-end w-[50%] mr-5'>
            <div className='dropdown pt-4 dropdown-end'>
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
                  <button
                    onClick={() => deletePost(post_id)}
                    className='text-gray-400 hover:text-red-600 dark:hover:text-red-600'
                  >
                    <p>Eliminar publicación</p><i className='fa-solid fa-trash text-md' />
                  </button>
                </li>
              </ul>
            </div>
          </div>
        )}
      </header>
      <div className='pl-4 xl:pl-4 pr-4'>
        <p className='font-medium text-left py-2 pl-1'>
          {text}
        </p>
        {imageLoaded && (
          <img
            className='rounded-lg border my-3 mr-2 w-full object-cover h-[40rem]'
            src={image}
            alt='post-image'
          />
        )}
        <footer className='relative'>
          {isReactionBarOpen && (
            <div
              className='pb-2 w-[14rem] md:w-[14rem] absolute -top-12 -left-4' onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}
            >
              <ReactionBarSelector onSelect={handleSelector} reactions={ReactionsArray} iconSize='28px' />
            </div>
          )}
          <div className='flex items-center w-full justify-around gap-x-10 py-4 pl-1'>
            {
            likeCreating
              ? (
                <span className='loading loading-spinner' />
                )
              : (
                <div>
                  <button onClick={liked ? deleteLike : handleLike} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                    <i className={likeStyle} />
                  </button>
                  <span>{likes}</span>
                </div>
                )
            }
            <Link to={`/post/${post_id}`} className='flex items-center  text-xs text-gray-400 hover:text-blue-400 dark:hover:text-blue-400'>
              <i className='fa-solid fa-comment mr-2 text-lg' />
              {comments}
            </Link>
            <button onClick={handleShareClick}>
              <i className='fa-regular fa-share-square text-xl text-[#0D1B2A] p-2 cursor-pointer' />
            </button>
          </div>
        </footer>
      </div>
    </article>
  )
}

Post.propTypes = {
  post: PropTypes.object.isRequired,
  postUser: PropTypes.object.isRequired,
  deletePost: PropTypes.func.isRequired
}

export default Post
