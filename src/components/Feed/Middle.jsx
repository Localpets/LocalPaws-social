/* eslint-disable no-unused-vars */
// import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { makeRequest } from '../../library/axios.js'
import logo from '../../assets/logo.png'
import Post from '../post/Post'
import Stories from '../Story/Stories.jsx'

const Middle = () => {
  /* const { isLoading, error, data } = useQuery({
    queryKey: ['posts'],
    queryFn: () =>
      makeRequest.get('/post?post_id_req=2')
        .then((res) => res.data)
  })

  if (isLoading) return 'Loading...'
  if (error) return 'An error has occurred: ' + error.message */

  return (
    <div className='w-full h-screen flex flex-col justify-start items-center pt-[2em] px-10'>
      {/* Resto del contenido */}
      <Stories />

      <div className='p-4 border border-gray-700'>
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

