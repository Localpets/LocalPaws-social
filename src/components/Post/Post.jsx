// import React from 'react'
import PropTypes from 'prop-types'

const Post = ({ likes, text, User }) => {
  return (
    <div className='border border-gray-700 cursor-pointer  w-full'>
      <div className='flex  pb-0'>
        <img
          className='h-9 w-9 rounded-full '
          src='https://pbs.twimg.com/profile_images/1636962643876478977/MZB-blU6_400x400.jpg'
          alt='#'
        />
        <p className='ml-2 flex flex-shrink-0 items-center font-medium text-white'>
          {Pedro} {Pascal}
          <span className='ml-1 text-sm leading-5  text-white'>
            Nov 2
          </span>
        </p>
      </div>
      <div className='pl-8 xl:pl-16 pr-4'>
        <p className='font-medium text-white text-left'>
          Hola soy pedro
        </p>
        <img
          className='rounded-2xl border border-gray-700 my-3 mr-2 w-full'
          src='https://images.nature.com/original/magazine-assets/d41586-019-00653-5/d41586-019-00653-5_16459150.jpg'
          alt=''
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
    </div>
  )
}

Post.propTypes = {
  likes: PropTypes.number,
  text: PropTypes.string,
  User: PropTypes.object
}

export default Post
