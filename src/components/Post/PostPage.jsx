/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable camelcase */
import { Link } from '@tanstack/router'
import CommentSkeleton from './CommentSkeleton'
import Comment from './Comment'
import Header from '../Header/Header'
import usePostContext from '../../hooks/Posts/usePostContext'
import LoadingGif from '../LoadingState/LoadingGif'
import { ReactionBarSelector } from '@charkour/react-reactions'
import './Comments.css'

const PostPage = () => {
  const postId = new URL(window.document.location).pathname.split('/').pop()
  const {
    post,
    loadingPost,
    postError,
    comments,
    commentCreating,
    commentsLoading,
    commentLoading,
    likeCreating,
    editingLoading,
    isEditingPost,
    isDeletingPost,
    currentUser,
    handleCommentSubmit,
    handleDeleteComment,
    handleLike,
    handleDeleteLike,
    handleEditPost,
    handleCancelEditPost,
    handleDeletePost,
    handleShareClick,
    handleMouseEnter,
    handleMouseLeave,
    handleSelector,
    isReactionBarOpen,
    ReactionsArray,
    likeStyle,
    liked,
    likes,
    friendsLiked,
    userLike,
    parentCommentForReply,
    activeComment,
    setActiveComment,
    handleSelectParentComment,
    isCurrentUserCommentAuthor
  } = usePostContext(postId)

  if (loadingPost) {
    return (
      <section>
        <Header />
        <div className='flex gap-4 bg-base-100 flex-col justify-center items-center h-screen'>
          <article className='bg-white gap-8 h-[70%] w-[70%] p-10 rounded-lg flex flex-col items-center justify-center'>
            <h1 className='text-4xl text-gray-400'>Cargando publicación...</h1>
            <LoadingGif />
            <div className='spinner-border mb-2' role='status'>
              <span className='sr-only'>Cargando publicación...</span>
            </div>
          </article>
        </div>
      </section>
    )
  }

  if (!post || postError) {
    return (
      <section>
        <Header />
        {/* Make a 404 page */}
        <div className='flex gap-4 bg-base-100 flex-col justify-center items-center h-screen'>
          <article className='bg-white gap-8 h-80 p-10 rounded-lg flex flex-col items-center justify-center'>
            <h1 className='text-4xl text-gray-400'>Error 404 :(</h1>
            <h2 className='text-2xl'>Parece que esta publicación no existe</h2>
            <Link to='/home' className='btn btn-primary mt-4 text-white'>Volver al inicio</Link>
          </article>
        </div>
      </section>
    )
  }

  const { text, image, post_id } = post
  const { first_name, last_name, thumbnail, username } = post.postUser

  return (
    <div>
      <Header />
      <section className='Comments pb-10 pt-24 flex flex-col lg:flex-row rounded-b-xl'>
        {isDeletingPost && (
          <div className='fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-50'>
            <div className='flex flex-col items-center text-white'>
              <div className='spinner-border mb-2' role='status'>
                <span className='sr-only'>Eliminando publicación...</span>
              </div>
              <span className='text-xl'>Eliminando publicación...</span>
            </div>
          </div>
        )}
        <header className='flex lg:hidden items-center justify-between border-b px-2 py-4 h-20 bg-white rounded-t-xl'>
          <div className='flex items-center'>
            <div className='flex md:items-start md:ml-2 text-sm items-start ml-2 flex-col'>
              <h5 className='text-[#0D1B2A] font-bold mb-1'>
                {first_name} {last_name}
              </h5>
              <p className='text-gray-400 '>{username}</p>
            </div>
          </div>
          {
            isCurrentUserCommentAuthor && (
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
                        onClick={() => handleDeletePost(post_id)}
                        className='text-black hover:text-red-600 dark:hover:text-red-600'
                      >
                        <p>Eliminar publicación</p>
                        <i className='fa-solid fa-trash text-md' />
                      </button>
                    </li>
                    <li>
                      {
                        isEditingPost
                          ? (
                            <button className='text-black hover:text-blue-600 dark:hover:text-yellow-600' onClick={handleCancelEditPost}>
                              <p>Cancelar edición</p>
                              <i className='fa-solid fa-x text-md' />
                            </button>
                            )
                          : (
                            <button className='text-black hover:text-blue-600 dark:hover:text-blue-600' onClick={handleEditPost}>
                              <p>Editar publicación</p>
                              <i className='fa-solid fa-edit text-md' />
                            </button>
                            )
                        }
                    </li>
                  </ul>
                </div>
              </div>
            )
            }
          <Link to='/home' className='flex justify-between items-center'>
            <i className='fa-solid fa-close text-xl text-[#0D1B2A] pr-6' />
          </Link>
        </header>
        {image === 'no image'
          ? null
          : (
            <div className='h-[30rem] lg:h-[41.25rem] w-full'>
              <img
                id='img-post'
                className='w-full h-full flex bg-white lg:rounded-l-xl'
                src={image || 'https://img.freepik.com/free-photo/abstract-surface-textures-white-concrete-stone-wall_74190-8189.jpg'}
              />
            </div>
            )}
        <article className={image === 'no image' ? 'flex flex-col pb-4 w-full h-full lg:w-[80%] mx-auto bg-white lg:rounded-r-xl lg:rounded-l-xl rounded-b-r-xl' : 'flex flex-col w-full bg-white h-full pb-4 lg:rounded-r-xl rounded-b-xl lg:rounded-b-none'}>
          <header className='hidden lg:flex items-center justify-between border-b px-4 py-4 h-20'>
            <div className='flex items-center'>
              <div className='flex'>
                <img
                  className='w-12 h-12 rounded-full '
                  src={thumbnail || 'http://localhost:8080/icons/6.png'}
                  alt='user-thumbnail'
                />
              </div>
              <div className='flex md:items-start md:ml-2 text-sm items-start ml-2 flex-col'>
                <h5 className='text-[#0D1B2A] font-bold mb-1'>
                  {first_name} {last_name}
                </h5>
                <p className='text-gray-400 '>{username}</p>
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
                        onClick={() => handleDeletePost(post_id)}
                        className='text-black hover:text-red-600 dark:hover:text-red-600'
                      >
                        <p>Eliminar publicación</p>
                        <i className='fa-solid fa-trash text-md' />
                      </button>
                    </li>
                    <li>
                      {
                            isEditingPost
                              ? (
                                <button className='text-black hover:text-blue-600 dark:hover:text-yellow-600' onClick={handleCancelEditPost}>
                                  <p>Cancelar edición</p>
                                  <i className='fa-solid fa-x text-md' />
                                </button>
                                )
                              : (
                                <button className='text-black hover:text-blue-600 dark:hover:text-blue-600' onClick={handleEditPost}>
                                  <p>Editar publicación</p>
                                  <i className='fa-solid fa-edit text-md' />
                                </button>
                                )
                            }
                    </li>
                  </ul>
                </div>
              </div>
            )}
            <Link to='/home' className='flex justify-between items-center'>
              <i className='fa-solid fa-close text-xl text-[#0D1B2A] pr-6' />
            </Link>
          </header>

          <section className='overflow-auto flex items-center p-4'>
            {/* User post text */}
            <div className='comentario flex items-center py-2'>
              <Link to='#'>
                <img
                  className='h-8 w-8 rounded-full'
                  src={thumbnail || 'http://localhost:8080/icons/6.png'}
                  alt='imagen-perfil-usuario'
                />
              </Link>
              {
                      isEditingPost
                        ? (
                          <div className='w-full px-4 ml-2 flex gap-4'>
                            <textarea
                              className='w-[85%] rounded-lg border border-gray-300 focus:border-secondary focus:ring-0'
                              defaultValue={text || ''}
                              id='postText'
                            />
                            <button
                              className='btn btn-square bg-white hover:bg-secondary border-white border-none'
                              onClick={handleEditPost}
                              disabled={editingLoading}
                            >
                              {editingLoading
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
                          )
                        : (
                          <div className='contenido-comentario ml-2 text-left text-md'>
                            {text}
                          </div>
                          )
                    }
            </div>
          </section>

          <div className='divider w-[95%] mx-auto m-2 mt-0' />

          <div id='style-7' className='min-h-32 max-h-60 lg:h-[17.1rem] lg:max-h-none w-full p-[1em] flex text-black overflow-auto'>
            <ul className='w-full'>
              <li className='mb-4'>
                <h2 className='font-bold text-2xl text-left'>Comentarios</h2>
              </li>
              {commentsLoading
                ? (
                  <div className='mx-auto pt-20 w-full flex justify-center'>
                    <LoadingGif />
                  </div>
                  )
                : (
                  <section>
                    <ul className='py-2'>
                      {Array.isArray(comments) && comments.length > 0
                        ? (
                            comments.map((comment) => (
                              <Comment
                                key={comment.comment_id}
                                comment={comment}
                                handleDeleteComment={handleDeleteComment}
                                reactions={ReactionsArray}
                                currentUser={currentUser}
                                isActive={comment.comment_id === activeComment}
                                setActiveComment={setActiveComment}
                                handleSelectParentComment={handleSelectParentComment}
                                slaveComments={comment.children}
                              />
                            ))
                          )
                        : !commentCreating && Array.isArray(comments) && comments.length === 0
                            ? (
                              <div className='mx-auto pt-20 w-full flex justify-center'>
                                <p className='text-2xl text-gray-400 text-center'>Sé el primero en comentar!</p>
                              </div>
                              )
                            : null}
                      {commentCreating && (
                        <CommentSkeleton />
                      )}
                    </ul>
                  </section>
                  )}
            </ul>
          </div>
          <footer className='relative'>
            {isReactionBarOpen && (
              <div
                className={image === 'no image' ? 'absolute -top-8 pb-2 ml-4 md:ml-[0.500rem] lg:ml-[4.75rem] w-[14rem] md:w-[16rem]' : 'absolute -top-8 pb-2 w-[14rem] md:w-[16rem]'} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}
              >
                <ReactionBarSelector onSelect={handleSelector} reactions={ReactionsArray} iconSize='28px' />
              </div>
            )}
            <div className='flex flex-col pt-10'>
              <div className='flex justify-around items-center px-6 py-2 border-t'>
                {
                  likeCreating
                    ? (
                      <span className='loading loading-spinner' />
                      )
                    : (
                      <div className='text-lg'>
                        <button onClick={liked ? handleDeleteLike : handleLike} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                          <span className='pr-2'>{likeStyle}</span>
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
                                      <img src={currentUser.thumbnail || 'https://cdn-icons-png.flaticon.com/512/2815/2815428.png'} className='rounded-xl' />
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
                            likeCreating
                              ? <span className='font-bold'>A {likes} personas más les gusta esto</span>
                              : <span>
                                Le gusta a {friendsLiked[0].first_name} {friendsLiked[0].last_name} {likes - 1 !== 0 ? `${likes - 1} y apersonas más` : null}
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
              <div className='py-2 '>
                <div className='form-control px-4'>
                  <div className='input-group'>
                    <input
                      type='text'
                      id='commentInput'
                      placeholder={
                          parentCommentForReply
                            ? `Respondiendo a ${parentCommentForReply.user.username}`
                            : 'Escribe un comentario...'
                      }
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleCommentSubmit()
                        }
                      }}
                      className='border-secondary bg-white w-full text-black active:border-secondary focus:border-secondary focus:ring-0'
                    />
                    {
                      parentCommentForReply && (
                        <button
                          className='btn btn-square border-secondary commentInput bg-white hover:bg-secondary'
                          onClick={() => {
                            setActiveComment(null)
                            handleSelectParentComment(null)
                          }}
                        >
                          {/* X svg */}
                          <svg xmlns='http://www.w3.org/2000/svg' className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M6 18L18 6M6 6l12 12' /></svg>
                        </button>
                      )
                    }
                    <button
                      className='btn btn-square border-secondary commentInput bg-white hover:bg-secondary'
                      onClick={handleCommentSubmit}
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
          </footer>
        </article>
      </section>
    </div>
  )
}

export default PostPage
