// import React from 'react'
import PropTypes from 'prop-types'
import { useQuery } from '@tanstack/react-query'
import { makeRequest } from '../../library/axios'
import Post from './Post.jsx'
import PostSkeleton from './PostSkeleton.jsx'

const PostQueryWrapper = ({ post }) => {
  const { isLoading, error, data } = useQuery({
    queryKey: ['post', post.post_user_id], // Usa el ID del usuario para la consulta
    queryFn: async () => {
      return await makeRequest.get(`user/find/id/${post.post_user_id}`).then((res) => {
        console.log(res.data)
        return res.data
      })
    }
  })

  if (isLoading) {
    return <PostSkeleton />
  }
  if (error) return 'An error has occurred: ' + error.message

  return <Post post={post} user={data.user} />
}

PostQueryWrapper.propTypes = {
  post: PropTypes.object.isRequired
}

export default PostQueryWrapper
