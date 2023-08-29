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
    <div className='w-full pl-[25%] pr-[25%] bg-white min-h-full flex flex-col justify-start items-center pt-[2em] px-10'>
      {/* Resto del contenido */}
      <Stories />
      <div className='flex flex-col items-center w-full gap-4'>
        {
          data.posts.map((post) => (<Post key={post.id} post={post} />))
        }
      </div>
      <div className='p-4 pt-20'>
        <span className='loading loading-ring loading-lg' />
      </div>
    </div>
  )
}

export default Middle