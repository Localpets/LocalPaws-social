/* eslint-disable camelcase */
import { useEffect, useState } from 'react'
import swal from 'sweetalert'
import { Link } from '@tanstack/router'
import { makeRequest } from '../../library/axios'
import CommentSkeleton from './CommentSkeleton'
import Comment from './comment'
import { ReactionBarSelector } from '@charkour/react-reactions'
import useFindUser from '../../hooks/useFindUser'
import './Comments.css'

const PostPage = () => {
  const postId = new URL(window.document.location).pathname.split('/').pop()
  const { user } = useFindUser()
  // Estados del componente
  const [currentUser, setCurrentUser] = useState(null)
  const [isCurrentUserCommentAuthor, setIsCurrentUserCommentAuthor] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false) // Nuevo estado de carga
  const [friendsLiked, setFriendsLiked] = useState([])
  // Estados del post y sus props
  const [post, setPost] = useState({})
  const [postUser, setPostUser] = useState({})

  // Estados de likes
  const [likes, setLikes] = useState(0)
  const [userLike, setUserLike] = useState(null)
  const [liked, setLiked] = useState(false)
  const [likeCreating, setLikeCreating] = useState(false)
  const [isHoveringLike, setIsHoveringLike] = useState(false)
  const [likeStyle, setLikeStyle] = useState('fa-solid fa-heart mr-2 text-lg text-gray-400')
  const [currentReaction, setCurrentReaction] = useState(null)

  // Estados de comentarios
  const [comments, setComments] = useState(null)
  const [commentsLoading, setCommentsLoading] = useState(true)
  const [commentLoading, setCommentLoading] = useState(false)
  const [commentCreating, setCommentCreating] = useState(false)

  // Constantes

  const ReactionsArray =
  [{ label: 'Like', node: <div>💗</div>, key: 'LIKE' },
    { label: 'Haha', node: <div>😹</div>, key: 'SMILE' },
    { label: 'Triste', node: <div>😿</div>, key: 'TEARS' },
    { label: 'Enojado', node: <div>😾</div>, key: 'ANGRY' },
    { label: 'Asombrado', node: <div>🙀</div>, key: 'SURPRISED' }]

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

        const validComments = await Promise.all(
          commentsData.map(async (comment) => {
            if (comment.comment_user_id) {
              const userResponse = await makeRequest.get(`/user/find/id/${comment.comment_user_id}`)
              const commentUser = userResponse.data.user

              return {
                comment_id: comment.comment_id,
                comment_user_id: comment.comment_user_id,
                text: comment.text,
                username: commentUser.username,
                ImageUser: commentUser.thumbnail
              }
            }
            return null
          })
        )

        // Cuando no hay comentarios, establecer comments en un array vacío
        if (validComments.length === 0) {
          setComments([])
        } else {
          setComments(validComments.filter(Boolean))
        }

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

  function resetLikeState () {
    setLikeStyle('fa-solid fa-heart mr-2 text-lg')
    setLikes(likes - 1)
    setLiked(false)
    setCurrentReaction(null)
    setUserLike(null)
  }

  const deleteLike = async () => {
    setLikeCreating(true)
    if (currentUser) {
      setLikeStyle('fa-solid fa-heart mr-2 text-lg')
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

  const deletePost = async (postId) => {
    setIsDeleting(true) // Habilitar la animación de carga
    try {
      await makeRequest.delete(`/post/delete/${postId}/${user.user_id}`)
      console.log('Post eliminado')

      // Agrega cualquier otra lógica que necesites después de eliminar el post
    } catch (err) {
      console.error(err)
    } finally {
      // Deshabilita la vista de carga después de completar la eliminación, ya sea con éxito o error
      setIsDeleting(false)

      // Redirige o realiza otras acciones después de la eliminación del post
      setTimeout(() => {
        window.location.href = '/home'
      }, 2000)
    }
  }

  const submitComment = async () => {
    if (currentUser) {
      const text = document.querySelector('.commentInput').value
      if (!text) {
        swal('Error', 'No puedes enviar un comentario vacío', 'error')
        return
      }
      const body = {
        comment_post_id: postId,
        comment_user_id: currentUser.userId,
        parent_comment_id: null,
        text
      }

      try {
        setCommentLoading(true) // Habilitar la animación de carga
        setCommentCreating(true)
        await makeRequest.post('/comment/create/', body)
          .then((res) => {
            setCommentCreating(false)
            document.querySelector('.commentInput').value = ''
            console.log(res)
            setComments([
              ...comments,
              {
                ImageUser: res.data.comment.user.avatar,
                comment_user_id: res.data.comment.user.user_id,
                comment_id: res.data.comment.comment_id,
                text: res.data.comment.text,
                username: res.data.comment.user.username
              }
            ])
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

  const deleteComment = async (commnet_id) => {
    if (currentUser) {
      try {
        setComments(comments.filter((comment) => comment.comment_id !== commnet_id))
        const response = await makeRequest.delete(`/comment/delete/${commnet_id}`)
        console.log(response)
      } catch (error) {
        console.error(error)
      }
    }
  }

  const handleSelector = (e) => {
    handleLike(e)
    setIsHoveringLike(false)
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

  return (
    <div className='Comments py-10'>
      {isDeleting && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
          <div className='flex flex-col items-center text-white'>
            <div className='spinner-border mb-2' role='status'>
              <span className='sr-only'>Eliminando publicación...</span>
            </div>
            <span className='text-xl'>Eliminando publicación...</span>
          </div>
        </div>
      )}
      {
        post.image === 'no image'
          ? (
            <div className='hidden justify-center items-center w-full h-[40em] bg-gray-200 rounded-l-xl rounded-r-xl'>
              <div className='flex flex-col items-center justify-center'>
                <i className='fa-regular fa-image text-9xl text-[#0D1B2A]' />
                <p className='text-[#0D1B2A] text-2xl font-bold'>No hay imagen</p>
              </div>
            </div>
            )
          : (
            <img
              id='img-post'
              className='w-10 max-h-screen flex rounded-l-xl'
              src={post.image}
            />
            )
      }
      <div className={post.image === 'no image' ? 'flex flex-col w-[80vw] mx-auto bg-white h-full rounded-r-xl rounded-l-xl' : 'flex flex-col w-full bg-white h-full rounded-r-xl'}>
        <div className='flex items-center justify-between border-b px-4 py-4 h-20'>
          <div className='flex items-center'>
            <div className='flex'>
              <img
                className='w-12 h-12 rounded-full '
                src={postUser.thumbnail || 'http://localhost:8080/icons/6.png'}
                alt='user-thumbnail'
              />
            </div>
            <div className='flex md:items-start md:ml-2 text-sm items-start ml-2 flex-col'>
              <h5 className='text-[#0D1B2A] font-bold mb-1'>
                {postUser.first_name} {postUser.last_name}
              </h5>
              <p className='text-gray-400 '>{postUser.username}</p>
            </div>
          </div>
          {isCurrentUserCommentAuthor && (
            <div className='flex justify-end w-[50%] mr-5'>
              <div className='dropdown pt-0 dropdown-end'>
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
                      onClick={() => deletePost(post.post_id)}
                      className='text-gray-400 hover:text-red-600 dark:hover:text-red-600'
                    >
                      <p>Eliminar publicación</p><i className='fa-solid fa-trash text-md' />
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          )}
          <a href='/home' className='flex justify-between items-center cursor-pointer '>
            <i className='fa-solid fa-close text-xl text-[#0D1B2A] pr-6' />
          </a>
        </div>
        <div
          id='style-7'
          className='h-[40em] w-full p-[1em] flex text-black overflow-auto'
        >
          <ul className='w-full'>
            <li>
              {/* User post text */}
              <div className='comentario flex items-center py-2'>
                <Link to='#'>
                  <img
                    className='h-8 w-8 rounded-full'
                    src={postUser.thumbnail || 'http://localhost:8080/icons/6.png'}
                    alt='imagen-perfil-usuario'
                  />
                </Link>
                <div className='contenido-comentario ml-2 text-left text-md'>
                  {post.text}
                </div>
              </div>
            </li>

            <div className='divider' />

            <li className='mb-4'>
              <h2 className='font-bold text-2xl text-left'>Comentarios</h2>
            </li>

            {commentsLoading
              ? (
                <div className='mx-auto pt-20 w-full flex justify-center'>
                  <span className='loading loading-ring loading-lg' />
                </div>
                )
              : (
                <section>
                  {Array.isArray(comments) && comments.length > 0
                    ? (
                        comments.map((comment) => (
                          <Comment comment={comment} deleteComment={deleteComment} key={comment.comment_id} reactions={ReactionsArray} currentUser={currentUser} />
                        ))
                      )
                    : !commentCreating && Array.isArray(comments) && comments.length === 0
                        ? (
                          <div className='mx-auto pt-20 w-full flex justify-center'>
                            <p className='text-2xl text-gray-400'>Sé el primero en comentar!</p>
                          </div>
                          )
                        : null}
                  {commentCreating && (
                    <CommentSkeleton />
                  )}
                </section>
                )}
          </ul>
        </div>
        {isHoveringLike && (
          <div
            className={post.image === 'no image' ? 'pb-2 ml-4 md:ml-[0.500rem] lg:ml-[4.75rem] w-[14rem] md:w-[16rem]' : 'pb-2 w-[14rem] md:w-[16rem]'} onMouseEnter={() => setIsHoveringLike(true)} onMouseLeave={() =>
              setTimeout(() => {
                setIsHoveringLike(false)
              }, 800)}
          >
            <ReactionBarSelector onSelect={handleSelector} reactions={ReactionsArray} iconSize='28px' />
          </div>
        )}
        <div className='flex flex-col'>
          <div className='flex justify-around items-center px-6 py-2 border-t'>
            {
            likeCreating
              ? (
                <span className='loading loading-spinner' />
                )
              : (
                <div>
                  <button onClick={liked ? deleteLike : handleLike} onMouseEnter={() => setIsHoveringLike(true)}>
                    <i className={likeStyle} />
                  </button>
                  <span>{likes}</span>
                </div>
                )
            }
            {/* Make a share button with page link */}
            <button onClick={handleShareClick}>
              <i className='fa-regular fa-share-square text-xl text-[#0D1B2A] p-2 cursor-pointer' />
            </button>
            <i className='fa-regular fa-bookmark text-xl text-[#0D1B2A] p-2 cursor-pointer' />
          </div>
          {/* Montar las fotos un poco encima de otras */}
          <div className='flex items-center px-4 pt-2 border-t '>
            {
              likes > 0 && (
                friendsLiked > 0
                  ? (
                      friendsLiked.map((friend) => (
                        <div className='avatar' key={friend.user_id}>
                          <div className='w-6'>
                            <img src={friend.thumbnail} className='rounded-xl' />
                          </div>
                        </div>
                      ))
                    )
                  : userLike && friendsLiked.length > 0
                    ? (
                        friendsLiked.map((friend) => (
                          <div className='avatar' key={friend.user_id}>
                            <div className='w-6'>
                              <img src={friend.thumbnail} className='rounded-xl' />
                            </div>
                          </div>
                        ))
                      )
                    : !userLike && friendsLiked.length > 0 && likes > 0
                        ? (
                            friendsLiked.map((friend) => (
                              <div className='avatar' key={friend.user_id}>
                                <div className='w-6'>
                                  <img src={friend.thumbnail} className='rounded-xl' />
                                </div>
                              </div>
                            ))
                          )
                        : userLike
                          ? (
                            <div className='avatar'>
                              <div className='w-6'>
                                <img src={currentUser.thumbnail} className='rounded-xl' />
                              </div>
                            </div>
                            )
                          : null
              )

            }
            <div className='flex ml-2 text-black '>
              <p className='mb-0 text-sm'>
                {
                likes > 0 && friendsLiked.length > 0 && !userLike
                  ? (
                    <span>
                      Le gusta a <span className='font-bold'>{friendsLiked.length === 3 ? friendsLiked[Math.floor(Math.random(friendsLiked.length))].first_name : null}</span> y <span className='font-bold'>{likes - 1} personas más</span>
                    </span>
                    )
                  : userLike && friendsLiked.length > 0
                    ? (
                      <span className='font-bold'>Te gusta a ti y a {likes - 1} personas más</span>
                      )
                    : userLike
                      ? (
                        <span className='font-bold'>A ti te gusta esto</span>
                        )
                      : (
                        <span className='font-bold'>Sé el primero en darle like!</span>
                        )
               }
              </p>
            </div>
          </div>
          <div className='py-2'>
            <div className='form-control px-4'>
              <div className='input-group'>
                <input
                  type='text'
                  placeholder='Haz un comentario...'
                  className='input input-bordered bg-white w-full commentInput text-black'
                />
                <button
                  className='btn btn-square bg-white hover:bg-purple-700 border-white border-none'
                  onClick={submitComment}
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostPage
