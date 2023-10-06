/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { makeRequest } from '../../library/axios.js'
import useAuthStore from '../../context/AuthContext'
import useFindUser from '../../hooks/useFindUser'
import PostQueryWrapper from '../Post/PostQueryWrapper.jsx'
import 'react-loading-skeleton/dist/skeleton.css'
import PostForm from '../Forms/PostForm.jsx'

const Middle = () => {
  const { loggedUser } = useAuthStore()

  const { user } = useFindUser(loggedUser)

  const [postsRef, setPostsRef] = useState([])

  useEffect(() => {
    const fetchPosts = async () => {
      if (!user) return {} // Devuelve un objeto vacío si no necesitas datos
      const { user_id } = user
      return makeRequest.get(`post/find/follows/user/${user_id}`).then((res) => {
        const sortedPosts = res.data.posts.sort((a, b) => b.post_id - a.post_id)
        setPostsRef(sortedPosts)
        return res.data
      })
    }
    fetchPosts()
  }, [user])
  // Función para agregar una nueva publicación al estado
  const addPost = (newPost) => {
    setPostsRef([newPost, ...postsRef])
  }

  const deletePost = async (postId) => {
    setPostsRef(postsRef.filter((post) => post.post_id !== postId))
    // postRouter.delete("/delete/:id/:post_user_id", verifyToken, deletePost);
    await makeRequest.delete(`/post/delete/${postId}/${user.user_id}`)
      .then(res => {
        console.log(res.data)
      }
      )
      .catch(err => console.error(err))
  }

  const { isLoading, error, data } = useQuery({
    queryKey: ['posts', user],
    queryFn: async () => {
      if (!user) return {} // Devuelve un objeto vacío si no necesitas datos
      const { user_id } = user
      return makeRequest.get(`post/find/follows/user/${user_id}`).then((res) => {
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
    return error.message
  }

  return (
    <div className='w-full lg:pl-[23%] lg:pr-[22.7%] min-h-screen flex flex-col justify-start gap-4 items-center mt-8 px-10'>

      <PostForm addPost={addPost} />

      <div className='flex flex-col items-center w-full gap-4 min-h-screen'>
        {
          postsRef.map((post) => (
            <PostQueryWrapper key={post.post_id} post={post} deletePost={deletePost} />
          ))
        }
      </div>

    </div>
  )
}

export default Middle
