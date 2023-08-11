/* eslint-disable no-unused-vars */
// import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { makeRequest } from '../../library/axios.js'
import logo from '../../assets/Icons/logo.png'
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

      <div className='p-4 pt-20'>
        <span className='loading loading-ring loading-lg' />
      </div>
    </div>
  )
}

export default Middle
