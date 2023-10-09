/* eslint-disable camelcase */
import { Link } from '@tanstack/router'
import PropTypes from 'prop-types'
import { ReactionBarSelector } from '@charkour/react-reactions'
import useFeedPostsContext from '../../hooks/Posts/useFeedPostsContext'

const Post = ({ post, postUser, deletePost }) => {
  const {
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
    last_name
  } = useFeedPostsContext(post, postUser, deletePost)

  return (
    <article className={componentStyle}>
      <header className='flex w-full'>
        <Link to={`/post/${post_id}`} className='flex p-4 w-full'>
          <img
            className='h-9 w-9 rounded-full '
            src={thumbnail}
            alt='user-thumbnail'
          />
          <p className='ml-2 flex w-full items-center font-medium'>
            {first_name} {last_name}
            <span className='ml-1 text-sm'>
              · {category}
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
                <div className='text-lg'>
                  <button onClick={liked ? deleteLike : handleLike} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                    <span className='pr-2'>{likeStyle}</span>
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
