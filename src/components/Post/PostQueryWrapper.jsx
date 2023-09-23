// import React from 'react'
import PropTypes from 'prop-types'
import { useQuery } from '@tanstack/react-query'
import { makeRequest } from '../../library/axios'
import Post from './Post.jsx'
import PostSkeleton from './PostSkeleton.jsx'

const PostQueryWrapper = ({ post, deletePost }) => {
  const { isLoading, error, data } = useQuery({
    queryKey: ['post', post.post_user_id], // Usa el ID del usuario para la consulta
    queryFn: async () => {
      return await makeRequest.get(`user/find/id/${post.post_user_id}`).then((res) => {
        return res.data
      })
    }
  })

  if (isLoading) {
    return <PostSkeleton />
  }
  if (error) return 'An error has occurred: ' + error.message

  return <Post post={post} postUser={data.user} deletePost={deletePost} />
}

PostQueryWrapper.propTypes = {
  post: PropTypes.object.isRequired,
  deletePost: PropTypes.func.isRequired
}

export default PostQueryWrapper
