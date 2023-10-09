import { useEffect, useState } from 'react'
import { makeRequest } from '../../library/axios'
import useFindUser from '../useFindUser'
import swal from 'sweetalert'

const usePostContext = (postId) => {
  const { user } = useFindUser()
  // Estados del Usuario
  const [currentUser, setCurrentUser] = useState(null)
  const [isCurrentUserCommentAuthor, setIsCurrentUserCommentAuthor] = useState(false)

  // Estados del post y sus props
  const [post, setPost] = useState({})
  const [postUser, setPostUser] = useState({})
  const [editingLoading, setEditingLoading] = useState(false) // Nuevo estado de carga
  const [isEditingPost, setIsEditingPost] = useState(false)
  const [isDeletingPost, setIsDeletingPost] = useState(false) // Nuevo estado de carga

  // Estados de likes
  const [friendsLiked, setFriendsLiked] = useState([])
  const [likes, setLikes] = useState(0)
  const [userLike, setUserLike] = useState(null)
  const [liked, setLiked] = useState(false)
  const [likeCreating, setLikeCreating] = useState(false)
  const [likeStyle, setLikeStyle] = useState('🖤')
  const [currentReaction, setCurrentReaction] = useState(null)
  const [closeTimeout, setCloseTimeout] = useState(null)
  const [isReactionBarOpen, setIsReactionBarOpen] = useState(false)

  // Estados de comentarios
  const [comments, setComments] = useState(null)
  const [commentsLoading, setCommentsLoading] = useState(true)
  const [activeComment, setActiveComment] = useState(null)
  const [commentLoading, setCommentLoading] = useState(false)
  const [commentCreating, setCommentCreating] = useState(false)
  const [parentCommentForReply, setParentCommentForReply] = useState(null)

  // Constantes

  const ReactionsArray =
  [{ label: 'Like', node: <div>💗</div>, key: 'LIKE' },
    { label: 'Haha', node: <div>😹</div>, key: 'SMILE' },
    { label: 'Triste', node: <div>😿</div>, key: 'TEARS' },
    { label: 'Enojado', node: <div>😾</div>, key: 'ANGRY' },
    { label: 'Asombrado', node: <div>🙀</div>, key: 'SURPRISED' }]

  const ReactionsIcons = {
    Like: '💗',
    Haha: '😹',
    Triste: '😿',
    Enojado: '😾',
    Asombrado: '🙀'
  }

  // Efectos

  useEffect(() => {
    if (user !== undefined && user !== null && user.length !== 0) {
      setCurrentUser({
        userId: user.user_id,
        username: user.username,
        thumbnail: user.thumbnail
      })
      // console.log(currentUser, 'currentUser') // Agrega esta línea
      if (currentUser && currentUser.userId === post.post_user_id) {
        setIsCurrentUserCommentAuthor(true)
      }
    }
  }, [setCurrentUser, user, post])

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await makeRequest.get(`/post/find/id/${postId}`)
        setPost(response.data.post)
      } catch (error) {
        console.error(error)
      }
    }

    const fetchCommentsAndUsers = async () => {
      try {
        const response = await makeRequest.get(`/comment/find/post/${postId}`)
        const commentsData = response.data.comments

        // Cuando no hay comentarios, establecer comments en un array vacío
        setComments(commentsData)

        // Después de cargar los comentarios y usuarios, establecer commentsLoading en false
        setCommentsLoading(false)
      } catch (error) {
        console.error(error)
      }
    }

    fetchPost()
    fetchCommentsAndUsers()
  }, [postId])

  useEffect(() => {
    const fetchPostUser = async () => {
      if (post.post_user_id) {
        try {
          const response = await makeRequest.get(`/user/find/id/${post.post_user_id}`)
          setPostUser(response.data.user)
        } catch (error) {
          console.error(error)
        }
      }
    }

    fetchPostUser()
  }, [post])

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const response = await makeRequest.get(`/like/post/${postId}`)
        const likeData = response.data.likes

        setLikes(likeData.length)

        if (currentUser) {
          const userLiked = likeData.some((like) => like.user_id === currentUser.userId)
          if (userLiked) {
            setUserLike(likeData.find((like) => like.user_id === currentUser.userId))
            switch (likeData.find((like) => like.user_id === currentUser.userId).like_type) {
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
                break
            }
            setLiked(true)
            setCurrentReaction(likeData.find((like) => like.user_id === currentUser.userId).like_type)
          }
        }
      } catch (error) {
        console.error(error)
      }
    }

    const fetchFriendsLiked = async () => {
      try {
        const response = await makeRequest.get('/user/find/all')
        const users = response.data.users
        if (currentUser) {
          const followers = await makeRequest.get(`/follow/find/followed/${currentUser.userId}`)
          const friends = followers.data.follows.map((follow) => follow.user_id)
          const friendsData = users.filter((user) => friends.includes(user.user_id))
          // console.log(friendsData)
          // filter people who liked this post
          const likesData = await makeRequest.get(`/like/post/${postId}`)
          const likes = likesData.data.likes
          const friendsLiked = friendsData.filter((friend) => likes.some((like) => like.user_id === friend.user_id))
          // set max 3 friends
          setFriendsLiked(friendsLiked.slice(0, 3))
        }
      } catch (error) {
        console.error(error)
      }
    }

    fetchFriendsLiked()
    fetchLikes()
  }, [postId, currentUser])

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
        post_id: postId,
        user_id: currentUser.userId
      })

      await makeRequest
        .post('/like/create/', {
          like_type: type,
          post_id: postId,
          user_id: currentUser.userId
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then((res) => {
          setLikeCreating(false)
          setUserLike({
            like_type: type,
            post_id: postId,
            user_id: currentUser.userId,
            like_id: res.data.newLike.like_id
          })
          console.log('Response:', res)
          setLikeStyle(getLikeStyle(type))
          setUserLike({
            like_type: type,
            like_id: res.data.newLike.like_id,
            post_id: postId,
            user_id: currentUser.userId
          })
        })
        .catch((error) => {
          console.error('Error creating like:', error)
        })
    }

    if (liked && type === currentReaction && currentUser) {
      resetLikeState()
      makeRequest
        .delete(`/like/delete/${postId}/${currentUser.userId}`)
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
        post_id: postId,
        like_id: userLike.like_id,
        user_id: currentUser.userId
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

  function resetLikeState () {
    setLikeStyle('🖤')
    setLikes(likes - 1)
    setLiked(false)
    setCurrentReaction(null)
    setUserLike(null)
  }

  const handleDeleteLike = async () => {
    setLikeCreating(true)
    if (currentUser) {
      setLikeStyle('🖤')
      setLikes(likes - 1)
      setLiked(false)
      setCurrentReaction(null)
      setUserLike(null)
      await makeRequest.delete(`/like/delete/${postId}/${currentUser.userId}`)
        .then((res) => {
          setLikeCreating(false)
          console.log(res)
        })
        .catch((error) => {
          console.error('Error deleting like:', error)
        })
    }
  }

  const handleDeletePost = async (postId) => {
    setIsDeletingPost(true) // Habilitar la animación de carga
    try {
      await makeRequest.delete(`/post/delete/${postId}/${user.user_id}`)
      console.log('Post eliminado')

      // Agrega cualquier otra lógica que necesites después de eliminar el post
    } catch (err) {
      console.error(err)
    } finally {
      // Deshabilita la vista de carga después de completar la eliminación, ya sea con éxito o error
      setIsDeletingPost(false)

      // Redirige o realiza otras acciones después de la eliminación del post
      setTimeout(() => {
        window.location.href = '/home'
      }, 2000)
    }
  }

  const handleEditPost = async () => {
    console.log('Editing Post...')
    setIsEditingPost(true)
    console.log('isEditingPost:', isEditingPost)
    setEditingLoading(true) // Habilitar la animación de carga
    try {
      const text = document.getElementById('postText').value
      const body = {
        text
      }
      console.log('Data being sent:', body, post.post_id, currentUser.userId)
      await makeRequest.put(`/post/update/${post.post_id}/${currentUser.userId}`, body)
        .then((res) => {
          console.log(res)
          setPost({
            ...post,
            text
          })
          setEditingLoading(false)
          setIsEditingPost(false)
          console.log('isEditingPost:', isEditingPost)
        })
        .catch((error) => {
          console.error('Error updating post:', error)
        })
    } catch (error) {
      console.error(error)
    } finally {
      setEditingLoading(false) // Deshabilitar la animación de carga después de completar la solicitud
    }
  }

  const handleCancelEditPost = () => {
    setIsEditingPost(false)
  }

  const handleCommentSubmit = async () => {
    console.log('handleCommentSubmit')
    // If i press enter, submit the comment
    const text = document.getElementById('commentInput').value
    if (currentUser) {
      console.log(text)
      if (!text) {
        swal('Error', 'No puedes enviar un comentario vacío', 'error')
        return
      }
      const body = {
        comment_post_id: postId,
        comment_user_id: currentUser.userId,
        parent_comment_id: parentCommentForReply ? parentCommentForReply.comment_id : null,
        text
      }

      try {
        setCommentLoading(true) // Habilitar la animación de carga
        setCommentCreating(true)
        await makeRequest.post('/comment/create/', body)
          .then((res) => {
            if (!parentCommentForReply) {
              setCommentCreating(false)
              document.getElementById('commentInput').value = ''
              console.log(res)
              setComments([
                ...comments,
                res.data.comment
              ])
            } else if (parentCommentForReply) {
              setCommentCreating(false)
              document.getElementById('commentInput').value = ''
              console.log(res)
              // Change children prop in that comment parent
              const newComments = comments.map((comment) => {
                if (comment.comment_id === parentCommentForReply.comment_id) {
                  return {
                    ...comment,
                    children: [
                      ...comment.children,
                      res.data.comment
                    ]
                  }
                }
                return comment
              })
              setComments(newComments)
              setParentCommentForReply(null)
            } else {
              setCommentCreating(false)
              setParentCommentForReply(null)
              document.getElementById('commentInput').value = ''
              console.log(res)
            }
          })
          .catch((error) => {
            console.error('Error creating comment:', error)
          })
      } catch (error) {
        console.error(error)
      } finally {
        setCommentLoading(false) // Deshabilitar la animación de carga después de completar la solicitud
      }
    }
  }

  const handleSelectParentComment = (comment) => {
    setParentCommentForReply(comment)
    console.log('handleSelectParentComment', comment)
  }

  const handleDeleteComment = async (comment) => {
    if (currentUser) {
      try {
        await makeRequest.delete(`/comment/delete/${comment.comment_id}`)
        // delete each child comment
        if (comment.children) {
          comment.children.forEach(async (childComment) => {
            await makeRequest.delete(`/comment/delete/${childComment.comment_id}`)
          })
        }
        console.log('Comment deleted')
        if (!comment.parent_comment_id) {
          const newComments = comments.filter((c) => c.comment_id !== comment.comment_id)
          setComments(newComments)
        } else {
          const newComments = comments.map((c) => {
            if (c.comment_id === comment.parent_comment_id) {
              const newChildren = c.children.filter((child) => child.comment_id !== comment.comment_id)
              return {
                ...c,
                children: newChildren
              }
            }
            return c
          })
          setComments(newComments)
        }
      } catch (error) {
        console.error(error)
      }
    }
  }

  const handleSelector = (e) => {
    handleLike(e)
    setIsReactionBarOpen(false)
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
      setActiveComment(null)
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
        title: `${postUser.first_name} en PawsPlorer: ${post.text}`,
        url: pageUrl
      })
        .then(() => console.log('Página compartida con éxito'))
        .catch((error) => console.error('Error al compartir:', error))
    } else {
      // Si el navegador no admite la API de compartir, puedes proporcionar un mensaje alternativo o implementar una lógica personalizada.
      alert(`Comparte esta página: ${pageUrl}`)
    }
  }

  return {
    post,
    postUser,
    editingLoading,
    isEditingPost,
    isDeletingPost,
    friendsLiked,
    likes,
    userLike,
    liked,
    likeCreating,
    likeStyle,
    currentReaction,
    closeTimeout,
    isReactionBarOpen,
    comments,
    commentsLoading,
    activeComment,
    commentLoading,
    commentCreating,
    parentCommentForReply,
    ReactionsArray,
    handleLike,
    getLikeStyle,
    resetLikeState,
    handleDeleteLike,
    handleDeletePost,
    handleEditPost,
    handleCancelEditPost,
    handleCommentSubmit,
    handleSelectParentComment,
    handleDeleteComment,
    handleSelector,
    handleMouseEnter,
    handleMouseLeave,
    handleShareClick,
    setIsReactionBarOpen,
    setActiveComment,
    isCurrentUserCommentAuthor,
    currentUser,
    setParentCommentForReply
  }
}

export default usePostContext
