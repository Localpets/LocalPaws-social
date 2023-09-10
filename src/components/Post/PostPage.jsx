import { useEffect, useState } from 'react'
import { Link } from '@tanstack/router'
import { makeRequest } from '../../library/axios'
import './Comments.css'

const PostPage = () => {
  const postId = new URL(window.document.location).pathname.split('/').pop()

  // Estados del componente
  const [post, setPost] = useState({})
  const [postUser, setPostUser] = useState({})
  const [likes, setLikes] = useState(0)
  const [liked, setLiked] = useState(false)
  const [likeStyle, setLikeStyle] = useState('fa-solid fa-heart mr-2 text-lg')
  const [comments, setComments] = useState([])

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await makeRequest.get(`/post/find/id/${postId}`)
        setPost(response.data.post)
      } catch (error) {
        console.error(error)
      }
    }

    const fetchCommentsAndUsers = async () => {
      try {
        const response = await makeRequest.get(`/comment/find/post/${postId}`)
        const commentsData = response.data.comments

        const validComments = await Promise.all(
          commentsData.map(async (comment) => {
            if (comment.comment_user_id) {
              const userResponse = await makeRequest.get(`/user/find/id/${comment.comment_user_id}`)
              const commentUser = userResponse.data.user

              return {
                comment_id: comment.comment_id,
                text: comment.text,
                usuario: commentUser.username,
                ImageUser: commentUser.thumbnail
              }
            }
            return null
          })
        )

        setComments(validComments.filter(Boolean))
      } catch (error) {
        console.error(error)
      }
    }

    fetchPost()
    fetchCommentsAndUsers()
  }, [postId])

  useEffect(() => {
    const fetchPostUser = async () => {
      if (post.post_user_id) {
        try {
          const response = await makeRequest.get(`/user/find/id/${post.post_user_id}`)
          setPostUser(response.data.user)
        } catch (error) {
          console.error(error)
        }
      }
    }

    fetchPostUser()
  }, [post])

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const response = await makeRequest.get(`/like/post/${postId}`)
        const likeData = response.data.likes

        setLikes(likeData.length)

        const user = JSON.parse(localStorage.getItem('user'))
        const userLiked = likeData.some((like) => like.user_id === user.userId)

        if (userLiked) {
          setLikeStyle('fa-solid fa-heart mr-2 text-lg text-red-600')
          setLiked(true)
        }
      } catch (error) {
        console.error(error)
      }
    }

    fetchLikes()
  }, [postId])

  const handleLike = async () => {
    const user = JSON.parse(localStorage.getItem('user'))

    setLiked(!liked)

    try {
      if (!liked) {
        setLikeStyle('fa-solid fa-heart mr-2 text-lg text-red-600')
        setLikes(likes + 1)

        const data = {
          like_type: 'Like',
          post_id: postId,
          user_id: user.userId
        }

        const response = await makeRequest.post('/like/create/', data, {
          headers: {
            'Content-Type': 'application/json'
          }
        })

        console.log(response)
      }

      if (liked) {
        setLikeStyle('fa-solid fa-heart mr-2 text-lg')
        setLikes(likes - 1)

        const response = await makeRequest.delete(`/like/delete/${postId}/${user.userId}`)
        console.log(response)
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className='Comments py-10'>
      <img
        id='img-post'
        className='w-10 max-h-screen flex rounded-l-xl'
        src={post.image}
      />
      <div className='flex flex-col w-full bg-white h-full rounded-r-xl'>
        <div className='flex items-center justify-between border-b px-4 py-4 h-20'>
          <div className='flex items-center'>
            <div className='flex'>
              <img
                className='w-12 h-12 rounded-full '
                src={postUser.thumbnail || 'http://localhost:8080/icons/6.png'}
                alt='user-thumbnail'
              />
            </div>
            <div className='flex md:items-start md:ml-2 text-sm items-start ml-2 flex-col'>
              <h5 className='text-[#0D1B2A] font-bold mb-1'>
                {postUser.first_name} {postUser.last_name}
              </h5>
              <p className='text-gray-400 '>{postUser.username}</p>
            </div>
          </div>
          <a href='/home' className='flex justify-between items-center cursor-pointer '>
            <i className='fa-solid fa-close text-xl text-[#0D1B2A] pr-6' />
          </a>
        </div>
        <div
          id='style-7'
          className='h-[40em] w-full p-[1em] flex text-black overflow-auto'
        >
          <ul>
            <li>
              {/* User post text */}
              <div className='comentario flex items-center py-2'>
                <Link to='#'>
                  <img
                    className='h-8 w-8 rounded-full'
                    src={postUser.thumbnail || 'http://localhost:8080/icons/6.png'}
                    alt='imagen-perfil-usuario'
                  />
                </Link>
                <div className='contenido-comentario ml-2 text-left text-sm'>
                  {post.text}
                </div>
              </div>
            </li>
            {comments.map((Comments) => (
              <li key={Comments.comment_id}>
                <div className='comentario flex items-center py-2'>
                  <Link to='#'>
                    <img
                      className='h-8 w-8 rounded-full'
                      src={Comments.ImageUser}
                      alt='imagen-perfil-usuario'
                    />
                  </Link>
                  <div className='contenido-comentario ml-2 text-left text-sm'>
                    {Comments.usuario}: {Comments.text}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className='flex flex-col'>
          <div className='flex justify-between items-center px-6 py-2 border-t'>
            <button onClick={handleLike}>
              <i className={likeStyle} />
              <span>{likes}</span>
            </button>
            <i className='fa-regular fa-share-from-square text-xl text-[#0D1B2A] p-2 cursor-pointer' />
            <i className='fa-regular fa-bookmark text-xl text-[#0D1B2A] p-2 cursor-pointer' />
          </div>
          <div className='flex items-center px-4 pt-2 border-t'>
            <div className='avatar-group -space-x-4'>
              <div className='avatar'>
                <div className='w-6'>
                  <img src='https://pbs.twimg.com/profile_images/1683325380441128960/yRsRRjGO_400x400.jpg' />
                </div>
              </div>
              <div className='avatar'>
                <div className='w-6'>
                  <img src='https://th.bing.com/th/id/R.56e0bc4e289568f1be79b4a1de53def6?rik=FTrHSGthAHS%2fwA&pid=ImgRaw&r=0' />
                </div>
              </div>
              <div className='avatar'>
                <div className='w-6'>
                  <img src='https://pbs.twimg.com/profile_images/1512090674635542529/xZUiesiF_400x400.jpg' />
                </div>
              </div>
              <div className='avatar'>
                <div className='w-6'>
                  <img src='https://pbs.twimg.com/profile_images/1635417140118290438/_O05STkG_400x400.jpg' />
                </div>
              </div>
            </div>
            <div className='flex ml-2 text-black '>
              <p className='mb-0 text-sm'>
                Le gusta a Brayan57963 y a 8K personas más
              </p>
            </div>
          </div>
          <div className='py-2'>
            <div className='form-control px-4'>
              <div className='input-group'>
                <i className='fa-regular fa-grin-beam text-xl text-[#0D1B2A] btn border-white bg-white p-4 cursor-pointer hover:bg-purple-700 border-none' />
                <input
                  type='text'
                  placeholder='Cumparte tu opinión...'
                  className='input input-bordered bg-white w-full '
                />
                <button className='btn btn-square bg-white hover:bg-purple-700 border-white border-none'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    height='1em'
                    viewBox='0 0 512 512'
                  >
                    <path d='M16.1 260.2c-22.6 12.9-20.5 47.3 3.6 57.3L160 376V479.3c0 18.1 14.6 32.7 32.7 32.7c9.7 0 18.9-4.3 25.1-11.8l62-74.3 123.9 51.6c18.9 7.9 40.8-4.5 43.9-24.7l64-416c1.9-12.1-3.4-24.3-13.5-31.2s-23.3-7.5-34-1.4l-448 256zm52.1 25.5L409.7 90.6 190.1 336l1.2 1L68.2 285.7zM403.3 425.4L236.7 355.9 450.8 116.6 403.3 425.4z' />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostPage
