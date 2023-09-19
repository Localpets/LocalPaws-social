/* eslint-disable no-unused-vars */
import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { makeRequest } from '../../library/axios.js'
import useAuthStore from '../../context/AuthContext'
import useFindUser from '../../hooks/useFindUser'
import PostQueryWrapper from '../Post/PostQueryWrapper.jsx'
import Stories from '../Story/Stories.jsx'
import 'react-loading-skeleton/dist/skeleton.css'
import PostForm from '../Forms/PostForm.jsx'

const Middle = () => {
  const { loggedUser } = useAuthStore()

  const { user } = useFindUser(loggedUser)

  const [postsRef, setPostsRef] = React.useState([])

  // Función para agregar una nueva publicación al estado
  const addPost = (newPost) => {
    setPostsRef([newPost, ...postsRef])
  }

  const { isLoading, error, data } = useQuery({
    queryKey: ['posts', user],
    queryFn: async () => {
      if (!user) return
      // eslint-disable-next-line camelcase
      const { user_id } = user
      // eslint-disable-next-line camelcase
      return makeRequest.get(`post/find/follows/user/${user_id}`).then((res) => {
        // sort posts by id descending
        const sortedPosts = res.data.posts.sort((a, b) => b.post_id - a.post_id)
        setPostsRef(sortedPosts)

        return res.data
      })
    }
  })

  if (isLoading) {
    return (
      <div className='mx-auto pt-20'>
        <span className='loading loading-ring loading-lg' />
      </div>
    )
  }

  if (error) {
    /*     console.log(error)
 */ return (
   <div className='mx-auto pt-20'>
     <span className='loading loading-ring loading-lg' />
   </div>
    )
  }

  return (
    <div className='w-full pl-[25%] pr-[25%] min-h-screen flex flex-col justify-start gap-4 items-center mt-8 px-10'>

      <Stories />

      <PostForm addPost={addPost} />

      <div className='flex flex-col items-center w-full gap-4 min-h-screen'>
        {
          postsRef.map((post) => (
            <PostQueryWrapper key={post.post_id} post={post} />
          ))
        }
      </div>

    </div>
  )
}

export default Middle
