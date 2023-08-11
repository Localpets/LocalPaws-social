/* eslint-disable no-unused-vars */
// import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { makeRequest } from '../../library/axios.js'
import logo from '../../assets/Icons/logo.png'
import Post from '../post/Post'
import Share from '../share/Share'

const Middle = () => {
  const { isLoading, error, data } = useQuery({
    queryKey: ['posts'],
    queryFn: () =>
      makeRequest.get('/post?post_id_req=2')
        .then((res) => res.data)
  })

  if (isLoading) return 'Loading...'
  if (error) return 'An error has occurred: ' + error.message

  return (
    <div className='w-full xl:w-1/2 h-screen overflow-y-auto'>

      <div className='flex justify-between items-center border px-4 py-2 sticky top-0 bg-transparent rounded-sm border-gray-700'>
        <h4 className='text-white font-bold '>Home</h4>
        <img src={logo} className='w-10' />
      </div>

      <Share />

      <Post likes={data.likes} text={data.text} User={data.user} />

      <div className=' p-4 border border-gray-700'>
        <svg className='w-8 h-8 mx-auto animate-spin-fast '>
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
