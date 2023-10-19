/* eslint-disable camelcase */
import { makeRequest } from '../../library/Axios'
import { useState, useEffect } from 'react'
import useFindUser from '../useFindUser'

const useFeedPostsContext = (post, postUser, deletePost) => {
  // Initialization of states
  // userState
  const { user } = useFindUser()
  const [currentUser, setCurrentUser] = useState(null)
  const [isCurrentUserCommentAuthor, setIsCurrentUserCommentAuthor] = useState(false)

  // like states
  const [likes, setLikes] = useState(0)
  const [liked, setLiked] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [componentStyle, setComponentStyle] = useState('border p-4 bg-white rounded-lg w-full h-auto')
  const [likeStyle, setLikeStyle] = useState('🖤')
  const [userLike, setUserLike] = useState(null)
  const [isReactionBarOpen, setIsReactionBarOpen] = useState(false)
  const [currentReaction, setCurrentReaction] = useState(null)
  const [closeTimeout, setCloseTimeout] = useState(null)
  const [likeCreating, setLikeCreating] = useState(false)
  const [fetchingReaction, setFetchingReaction] = useState(true)

  // post props
  const { text, image, category, createdAt, post_id, post_user_id } = post

  // post user props
  const { first_name, last_name, thumbnail } = postUser
  const dateToLocal = new Date(createdAt).toLocaleDateString()

  // coments states
  const [comments, setComments] = useState(0)

  const ReactionsArray =
  [{ label: 'Like', node: <div>💗</div>, key: 'Like' },
    { label: 'Haha', node: <div>😹</div>, key: 'Haha' },
    { label: 'Triste', node: <div>😿</div>, key: 'Triste' },
    { label: 'Enojado', node: <div>😾</div>, key: 'Enojado' },
    { label: 'Asombrado', node: <div>🙀</div>, key: 'Asombrado' }]

  const ReactionsIcons = {
    Like: '💗',
    Haha: '😹',
    Triste: '😿',
    Enojado: '😾',
    Asombrado: '🙀'
  }

  useEffect(() => {
    if (image !== 'no image') {
      setImageLoaded(true)
      setComponentStyle('border p-4 bg-white rounded-lg w-full h-auto')
    }
  }, [image, setLiked, post_id, user, setIsCurrentUserCommentAuthor, post_user_id])

  useEffect(() => {
    if (user) {
      setCurrentUser(user)
    }
  }, [user])

  useEffect(() => {
    const fetchLikes = async () => {
      setFetchingReaction(true)
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
                setLikeStyle(ReactionsIcons.Like)
                break
              case 'Haha':
                setLikeStyle(ReactionsIcons.Haha)
                break
              case 'Triste':
                setLikeStyle(ReactionsIcons.Triste)
                break
              case 'Enojado':
                setLikeStyle(ReactionsIcons.Enojado)
                break
              case 'Asombrado':
                setLikeStyle(ReactionsIcons.Asombrado)
                break
              default:
                setLikeStyle(ReactionsIcons.Like)
            }
            setLiked(true)
            setCurrentReaction(likeData.find((like) => like.user_id === currentUser.user_id).like_type)
          }
          setFetchingReaction(false)
        }
      } catch (error) {
        console.error(error)
        setFetchingReaction(false)
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
        return ReactionsIcons.Like
      case 'Haha':
        return ReactionsIcons.Haha
      case 'Triste':
        return ReactionsIcons.Triste
      case 'Enojado':
        return ReactionsIcons.Enojado
      case 'Asombrado':
        return ReactionsIcons.Asombrado
      default:
        return ReactionsIcons.Like
    }
  }

  // Delete like
  const deleteLike = async () => {
    setLikeCreating(true)
    if (currentUser) {
      setLikeStyle('🖤')
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
    setLikeStyle('🖤')
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
  const postUrl = `/post/${post_id}`

  // Función para manejar el clic del botón de compartir
  const handleShareClick = () => {
    // Puedes usar la función `navigator.share` para abrir un cuadro de diálogo de compartir si está disponible en el navegador.
    if (navigator.share) {
      navigator.share({
        title: `${first_name} en PawsPlorer: ${text}`,
        url: postUrl
      })
        .then(() => console.log('Página compartida con éxito'))
        .catch((error) => console.error('Error al compartir:', error))
    } else {
      // Si el navegador no admite la API de compartir, puedes proporcionar un mensaje alternativo o implementar una lógica personalizada.
      alert(`Comparte esta página: ${postUrl}`)
    }
  }

  return {
    isCurrentUserCommentAuthor,
    likeCreating,
    likes,
    liked,
    likeStyle,
    isReactionBarOpen,
    handleLike,
    deleteLike,
    handleMouseEnter,
    handleMouseLeave,
    handleSelector,
    handleShareClick,
    imageLoaded,
    componentStyle,
    ReactionsArray,
    image,
    text,
    category,
    post_id,
    comments,
    thumbnail,
    first_name,
    last_name,
    dateToLocal,
    fetchingReaction
  }
}

export default useFeedPostsContext
