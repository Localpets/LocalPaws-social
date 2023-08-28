/* eslint-disable camelcase */
// import React from 'react'
import { Link } from '@tanstack/router'
import PropTypes from 'prop-types'
import PostSkeleton from './PostSkeleton'

const Post = ({ post, user }) => {
  const { likes, text, image, category, createdAt } = post
  const { first_name, last_name, thumbnail } = user
  const dateToLocal = new Date(createdAt).toLocaleDateString()

  return (
    <Link to='/post' className='border p-4 cursor-pointer  w-full'>
      <div className='flex  pb-0'>
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
      <div className='pl-8 xl:pl-16 pr-4'>
        <p className='font-medium text-left'>
          {text}
        </p>
        <img
          className='rounded-2xl border border-gray-700 my-3 mr-2 w-full'
          src={image}
          alt='post-image'
        />
        <div className='flex items-center w-full justify-start gap-x-10'>
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
