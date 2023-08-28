/* eslint-disable no-unused-vars */
import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { makeRequest } from '../../library/axios.js'
import PostQueryWrapper from '../Post/PostQueryWrapper.jsx'
import Stories from '../Story/Stories.jsx'
import 'react-loading-skeleton/dist/skeleton.css'
import PostForm from '../Forms/PostForm.jsx'
// import useAuthStore from '../../context/AuthContext.js'

const Middle = () => {
  // const { user } = useAuthStore()
  const [user, setUser] = React.useState({})
  const [posts, setPosts] = React.useState([])

  React.useEffect(() => {
    if (localStorage.getItem('user')) {
      const newUser = JSON.parse(localStorage.getItem('user'))
      setUser(newUser)
    }
  }, [])

  const { isLoading, error, data } = useQuery({
    queryKey: ['posts', user],
    queryFn: async () => {
      const user = JSON.parse(localStorage.getItem('user'))
      const id = user.userId
      return await makeRequest.get(`post/find/follows/user/${id}`).then((res) => {
        console.log(res.data)
        setPosts(res.data.posts)
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
  if (error) return 'An error has occurred: ' + error.message

  return (
    <div className='w-full pl-[25%] pr-[25%] min-h-screen flex flex-col justify-start gap-4 items-center mt-8 px-10'>

      <Stories />

      <PostForm />

      <div className='flex flex-col items-center w-full gap-4 min-h-screen'>
        {
          posts.map((post) => (
            <PostQueryWrapper key={post.post_id} post={post} />
          ))
        }
      </div>

    </div>
  )
}

export default Middle
