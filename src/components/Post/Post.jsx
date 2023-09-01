/* eslint-disable camelcase */
import React from 'react'
import { Link } from '@tanstack/router'
import PropTypes from 'prop-types'

const Post = ({ post, user }) => {
  const [imageLoaded, setImageLoaded] = React.useState(false)
  const [componentStyle, setComponentStyle] = React.useState('border p-4 bg-white rounded-lg cursor-pointer w-full h-auto')
  const { likes, text, image, category, createdAt, post_id } = post

  React.useEffect(() => {
    if (image !== 'no image') {
      setImageLoaded(true)
      setComponentStyle('border p-4 bg-white rounded-lg cursor-pointer w-full h-auto')
    }
  }, [image])

  const { first_name, last_name, thumbnail } = user
  const dateToLocal = new Date(createdAt).toLocaleDateString()

  return (
    <Link to={`/post/${post_id}`} className={componentStyle}>
      <div className='flex p-4'>
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
      </div>
      <div className='pl-4 xl:pl-4 pr-4'>
        <p className='font-medium text-left py-2 pl-1'>
          {text}
        </p>
        {imageLoaded && (
          <img
            className='rounded-lg border my-3 mr-2 w-full object-fit h-[40rem]'
            src={image}
            alt='post-image'
          />
        )}
        <div className='flex items-center w-full justify-start gap-x-10 py-4 pl-1'>
          <div className=' flex items-center  text-xs text-gray-400 hover:text-red-600 dark:hover:text-red-600'>
            <i className='fa-solid fa-heart mr-2 text-lg' />
            {likes}
          </div>
          <div className=' flex items-center  text-xs text-gray-400  hover:text-blue-400 dark:hover:text-blue-400'>
            <i className='fa-solid fa-share mr-2 text-lg' />
          </div>
        </div>
      </div>
    </Link>
  )
}

Post.propTypes = {
  post: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired
}

export default Post
