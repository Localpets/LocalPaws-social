/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
import { useState, useEffect } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { makeRequest } from '../../library/Axios'
import PostQueryWrapper from '../Post/PostQueryWrapper.jsx'
import LoadingGif from '../LoadingState/LoadingGif'
import PostForm from '../Forms/PostForm.jsx'
import useFindUser from '../../hooks/useFindUser'
import IntersectionObserverComponent from './utilities/IntersectionObserverComponent'

const Middle = () => {
  const { user } = useFindUser()
  const [postsRef, setPostsRef] = useState([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [currentUser, setCurrentUser] = useState({})

  const handleScroll = () => {
    const currentScroll = window.pageYOffset

    if (currentScroll) {
      window.localStorage.setItem('scroll', currentScroll)
    }
  }

  useEffect(() => {
    if (user) {
      const newUser = user
      setCurrentUser(newUser)
    }

    // Retrieve last scroll if exists
    const lastScroll = window.localStorage.getItem('scroll')

    if (lastScroll) {
      window.setTimeout(() => {
        window.scrollTo(0, parseInt(lastScroll, 10))
        console.log('scrolling... to: ', lastScroll)
        window.localStorage.removeItem('scroll')
      }, 5000)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }
  , [user])

  // Function to add a new post to the state
  const addPost = (newPost) => {
    setPostsRef([newPost, ...postsRef])
  }

  const deletePost = async (postId) => {
    setPostsRef(postsRef.filter((post) => post.post_id !== postId))
    try {
      await makeRequest.delete(`/post/delete/${postId}/${currentUser.user_id}`)
    } catch (err) {
      console.error(err)
    }
  }

  // Use infinite query to made a infinite scroll on my page
  const {
    data,
    isLoading,
    error,
    fetchNextPage
  } = useInfiniteQuery(
    ['posts', currentUser.user_id],
    async ({ pageParam = page, hasMoreParam = hasMore }) => {
      if (typeof pageParam === 'object') {
        hasMoreParam = pageParam.hasMore
        pageParam = pageParam.page
      }

      if (!hasMoreParam) {
        console.log('No hay más publicaciones')
        return { posts: [], hasMore: false }
      }

      const { data } = await makeRequest.get(`/post/find/follows/user/${currentUser.user_id}/page/${pageParam}`)

      if (pageParam !== 1) {
        const newPage = page + 1
        setPage(newPage)
        setHasMore(hasMoreParam)
        setPostsRef((prevPosts) => [...prevPosts, ...data.posts.posts])
      } else {
        setPostsRef(data.posts.posts)
        setHasMore(data.posts.hasMore)
      }

      return data
    },
    {
      getNextPageParam: (lastPage) => {
        return {
          page: page + 1,
          hasMore: lastPage.posts.hasMore
        }
      },
      refetchOnWindowFocus: false, // Prevent refetching when the window/tab regains focus
      refetchOnMount: false// Prevent refetching when the query mounts
    }
  )

  // Definimos una función para cargar más publicaciones cuando el elemento es visible
  const loadMorePosts = () => {
    fetchNextPage()
  }

  if (isLoading) {
    return (
      <div className='mx-auto w-full lg:pl-[23%] lg:pr-[22.7%] min-h-screen flex flex-col justify-start gap-4 items-center mt-8 px-10'>
        <PostForm addPost={addPost} />
        <LoadingGif />
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
        {postsRef.map((post, index) => (
          <div key={post.post_id} className='w-full'>
            {index === postsRef.length - 1 && (
              <IntersectionObserverComponent onIntersect={loadMorePosts} />
            )}
            <PostQueryWrapper
              post={post}
              deletePost={deletePost}
              user={currentUser}
            />
          </div>
        ))}
      </div>
      {!hasMore && <p className='text-gray-400'>No more posts</p>}
    </div>
  )
}

export default Middle
