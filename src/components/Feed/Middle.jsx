/* eslint-disable no-unused-vars */
import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { makeRequest } from '../../library/axios.js'
import PostQueryWrapper from '../Post/PostQueryWrapper.jsx'
import Stories from '../Story/Stories.jsx'
import 'react-loading-skeleton/dist/skeleton.css'
import PostForm from '../Forms/PostForm.jsx'
import PropTypes from 'prop-types'

const Middle = ({ user }) => {
  const [posts, setPosts] = React.useState([])

  const postsRef = React.useRef(posts)

  const { isLoading, error, data } = useQuery({
    queryKey: ['posts', user],
    queryFn: async () => {
      const id = user.userId
      return makeRequest.get(`post/find/follows/user/${id}`).then((res) => {
        // sort posts by id descending
        const sortedPosts = res.data.posts.sort((a, b) => b.post_id - a.post_id)
        postsRef.current = sortedPosts
        setPosts(sortedPosts)

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
          postsRef.current.map((post) => (
            <PostQueryWrapper key={post.post_id} post={post} />
          ))
        }
      </div>

    </div>
  )
}

Middle.propTypes = {
  user: PropTypes.object.isRequired
}

export default Middle
