import { useEffect, useState } from 'react'
import { makeRequest } from '../../library/Axios'
import useFindUser from '../useFindUser'

export default function useCommentContext (comment, currentUser, handleDeleteComment, isActive, setActiveComment, handleSelectParentComment, slaveComments) {
  const { user } = useFindUser()
  // user variables
  const isCurrentUserCommentAuthor = user !== null && comment.comment_user_id === user.user_id

  // Like variables
  const [likeCreating, setLikeCreating] = useState(false)
  const [likes, setLikes] = useState(0)
  const [userLike, setUserLike] = useState(null)
  const [liked, setLiked] = useState(false)
  const [likeStyle, setLikeStyle] = useState('🖤')

  // Comment variables
  const [commentLoading, setCommentLoading] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Input variables
  const [isEditing, setIsEditing] = useState(false)
  const [loadingUser, setLoadingUser] = useState(true)

  // Reaction bar variables
  const [isReactionBarOpen, setIsReactionBarOpen] = useState(false)
  const [closeTimeout, setCloseTimeout] = useState(null)
  const [currentReaction, setCurrentReaction] = useState(null)

  // Constantes
  const ReactionsIcons = {
    Like: '💗',
    Haha: '😹',
    Triste: '😿',
    Enojado: '😾',
    Asombrado: '🙀'
  }

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
      const response = await makeRequest.get(`/comment/likes/${comment.comment_id}`)
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
            case 'Like' || 'like':
              setLikeStyle(ReactionsIcons.Like)
              break
            case 'Haha' || 'haha':
              setLikeStyle(ReactionsIcons.Haha)
              break
            case 'Triste' || 'triste':
              setLikeStyle(ReactionsIcons.Triste)
              break
            case 'Enojado' || 'enojado':
              setLikeStyle(ReactionsIcons.Enojado)
              break
            case 'Asombrado' || 'asombrado':
              setLikeStyle(ReactionsIcons.Asombrado)
              break
            default:
              setLikeStyle(ReactionsIcons.Like)
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
        return ReactionsIcons.Like
      case 'Haha' || 'haha':
        return ReactionsIcons.Haha
      case 'Triste' || 'triste':
        return ReactionsIcons.Triste
      case 'Enojado' || 'enojado':
        return ReactionsIcons.Enojado
      case 'Asombrado' || 'asombrado':
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
      await makeRequest
        .delete(`/comment/like/delete/${comment.comment_id}/${currentUser.userId}`)
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
    setLikeStyle('🖤')
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
      // if type !== string then type = 'Like'
      if (typeof type !== 'string') {
        type = 'Like'
      }

      setLiked(true)
      setCurrentReaction(type)

      const likeForDto = type
      console.log('Type:', type)

      // Debug logging
      console.log('Data being sent:', {
        like_type: likeForDto,
        comment_id: comment.comment_id,
        user_id: currentUser.userId
      })

      await makeRequest
        .post(`/comment/like/create/${comment.comment_id}`, {
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
            comment_id: comment.comment_id,
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
        .delete(`/comment/like/delete/${comment.comment_id}/${currentUser.userId}`)
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
      setIsDeleting(true)
      handleDeleteComment(comment)
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
      if (updatedCommentText === comment.text || updatedCommentText === null) {
        setIsEditing(false)
        setCommentLoading(false)
        return
      }
      try {
        await makeRequest.put(`/comment/update/${comment.comment_id}`, {
          text: updatedCommentText
        }).then((res) => {
          console.log(res)
          comment.text = updatedCommentText
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
    setActiveComment(comment.comment_id)
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

  return {
    isCurrentUserCommentAuthor,
    likeCreating,
    likes,
    userLike,
    liked,
    likeStyle,
    commentLoading,
    isHovering,
    isEditing,
    loadingUser,
    isReactionBarOpen,
    currentReaction,
    handleLike,
    handleDeleteClick,
    setIsHovering,
    handleEditClick,
    handleMouseEnter,
    handleMouseLeave,
    handleSelector,
    setIsEditing,
    setIsReactionBarOpen,
    setCurrentReaction,
    resetLikeState,
    fetchLikesForComment,
    getLikeStyle,
    deleteLike,
    slaveComments,
    handleSelectParentComment,
    isDeleting
  }
}
