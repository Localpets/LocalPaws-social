/* eslint-disable no-unused-vars */
import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { makeRequest } from '../../library/axios.js'
import logo from '../../assets/Icons/logo.png'
import Post from '../post/Post'
import Stories from '../Story/Stories.jsx'

const Middle = () => {
  const { isLoading, error, data } = useQuery({
    queryKey: ['posts'],
    queryFn: () =>
      makeRequest.get('/post/find/all')
        .then((res) => res.data)
  })

  if (isLoading) return 'Loading...'
  if (error) return 'An error has occurred: ' + error.message

  return (
    <div className='w-full h-screen flex flex-col justify-start items-center pt-[2em] px-10'>
      {/* Resto del contenido */}
      <Stories />
      <div className='flex flex-col items-center w-full gap-4'>
        {
          data.posts.map((post) => (<Post key={post.id} post={post} />))
        }
      </div>
      <div className='p-4 pt-20'>
        <svg className='w-8 h-8 mx-auto animate-spin-fast'>
          <circle
            cx='16'
            cy='16'
            fill='none'
            r='14'
            strokeWidth='4'
            style={{ stroke: 'rgb(29, 161, 242)', opacity: 0.2 }}
          />
          <circle
            cx='16'
            cy='16'
            fill='none'
            r='14'
            strokeWidth='4'
            style={{
              stroke: 'rgb(29, 161, 242)',
              strokeDasharray: 80,
              strokeDashoffset: 60
            }}
          />
        </svg>
      </div>
    </div>
  )
}

export default Middle
