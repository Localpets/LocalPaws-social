/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
import React from 'react'
import { Link } from '@tanstack/router'
import PropTypes from 'prop-types'
import { makeRequest } from '../../library/axios'
import useAuthStore from '../../context/AuthContext'
import useFindUser from '../../hooks/useFindUser'

const Post = ({ post, postUser, deletePost }) => {
  // Initialization of states
  // userState
  const { loggedUser } = useAuthStore()
  const { user } = useFindUser(loggedUser)
  const [isCurrentUserCommentAuthor, setIsCurrentUserCommentAuthor] = React.useState(false)
  // imageLoaded state
  const [imageLoaded, setImageLoaded] = React.useState(false)
  const [componentStyle, setComponentStyle] = React.useState('border p-4 bg-white rounded-lg w-full h-auto')
  // like states
  const [likes, setLikes] = React.useState(0)
  const [liked, setLiked] = React.useState(false)
  const [likeStyle, setLikeStyle] = React.useState('fa-solid fa-heart mr-2 text-lg')
  // post props
  const { text, image, category, createdAt, post_id, post_user_id } = post
  // post user props
  const { first_name, last_name, thumbnail } = postUser
  const dateToLocal = new Date(createdAt).toLocaleDateString()

  React.useEffect(() => {
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
        setLikeStyle('fa-solid fa-heart mr-2 text-lg text-red-600')
      }
    }

    if (user?.user_id === post_user_id) {
      setIsCurrentUserCommentAuthor(true)
    }

    fetchLikes()
  }, [image, setLiked, post_id, user, setIsCurrentUserCommentAuthor, post_user_id])

  const handleLike = async () => {
    setLiked(!liked)
    if (!liked) {
      setLikeStyle('fa-solid fa-heart mr-2 text-lg text-red-600')
      setLikes(likes + 1)
      // /create/:like_type/:user_id/:post_id
      const data = {
        like_type: 'Like',
        post_id,
        user_id: loggedUser
      }
      const res = await makeRequest.post('/like/create/', data, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      console.log(res)
    }

    if (liked) {
      setLikeStyle('fa-solid fa-heart mr-2 text-lg')
      setLikes(likes - 1)
      const res = await makeRequest.delete(`/like/delete/${post_id}/${loggedUser}`)
      console.log(res)
    }
  }

  return (
    <article className={componentStyle}>
      <div className='flex w-full'>
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
      </div>
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
        <div className='flex items-center w-full justify-start gap-x-10 py-4 pl-1'>
          <button onClick={handleLike} className='flex items-center  text-xs text-gray-400 hover:text-red-600 dark:hover:text-red-600'>
            <i className={likeStyle} />
            {likes}
          </button>
          <div className=' flex items-center  text-xs text-gray-400  hover:text-blue-400 dark:hover:text-blue-400'>
            <i className='fa-solid fa-share mr-2 text-lg' />
          </div>
        </div>
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
