// import React from 'react'
import { useEffect, useState } from 'react'
// import CommentsData from './Comments.json'
import './Comments.css'
import { makeRequest } from '../../library/axios'

const Comentarios = () => {
  const [post, setPost] = useState({})
  const [user, setUser] = useState({})
  const postId = new URL(window.document.location).pathname.split('/').pop()

  useEffect(() => {
    const getPost = async () => {
      await makeRequest.get(`/post/find/id/${postId}`)
        .then(res => {
          setPost(res.data.post)
        })
        .catch(err => console.log(err))
    }

    getPost()
  }, [setPost, postId])

  useEffect(() => {
    const newPost = post
    if (newPost.post_user_id) {
      const getUser = async () => {
        await makeRequest.get(`/user/find/id/${newPost.post_user_id}`)
          .then(res => {
            setUser(res.data.user)
          })
          .catch(err => console.log(err))
      }
      getUser()
    }
  }, [post])

  const postDate = new Date(post.createdAt).toLocaleDateString()
  return (
    <div className='Comments'>
      <img id='img-post' className='w-10 max-h-screen flex p-10 border border-r border-[#E0E1DD]' src={post.image} />
      <div className='flex flex-col w-full'>
        <div className=' flex justify-between border-b border-black  p-[1em]'>
          <div className='flex '>
            <div className='flex'>
              <img
                className='w-12 h-12 rounded-full '
                src={user.thumbnail}
                alt='user-thumbnail'
              />
            </div>
            <div className='flex md:items-start md:ml-2 text-sm items-start ml-2 flex-col'>
              <h5 className='text-[#0D1B2A] font-bold mb-1'>{user.first_name} {user.last_name}</h5>
              <p className='text-gray-400 '>{user.username}</p>
            </div>
          </div>
          <div className='flex justify-between items-center cursor-pointer '>
            <i className='fa-solid fa-ellipsis text-xl text-[#0D1B2A]' />
          </div>
        </div>
        <div id='style-7' className='h-[50%] p-[1em] border-b border-black flex text-black overflow-auto'>
          {/* <ul>
            {CommentsValidos.map(Comments => (
              <li key={Comments.id}>
                <div className='comentario flex items-center py-4'>
                  <img className='h-12 w-12 rounded-full' src={Comments.ImageUser} alt='Imagen de usuario' />
                  <div className='contenido-comentario ml-2 text-left '>
                    <strong>{Comments.usuario}</strong>: {Comments.Comentario}
                  </div>
                </div>
              </li>
            ))}
          </ul> */}
        </div>
        <div className='flex justify-between mt-1 py-1.5 px-4 '>
          <div>
            <i className='fa-regular fa-heart text-xl text-[#0D1B2A] p-2 cursor-pointer' />
            <span className='text-black'>{post.likes}</span>
          </div>
          <i className='fa-regular fa-share-from-square text-xl text-[#0D1B2A] p-2 cursor-pointer' />
          <div className='flex '><i className='fa-regular fa-bookmark text-xl text-[#0D1B2A] p-2 cursor-pointer' /></div>
        </div>
        <div className='flex items-center pl-2 pr-2 pt-2 border-t-black'>
          <div className='avatar-group -space-x-4 '>
            <div className='avatar'>
              <div className='w-8 flex '>
                <img src='https://pbs.twimg.com/profile_images/1683325380441128960/yRsRRjGO_400x400.jpg' />
              </div>
            </div>
            <div className='avatar'>
              <div className='w-8'>
                <img src='https://th.bing.com/th/id/R.56e0bc4e289568f1be79b4a1de53def6?rik=FTrHSGthAHS%2fwA&pid=ImgRaw&r=0' />
              </div>
            </div>
            <div className='avatar'>
              <div className='w-8'>
                <img src='https://pbs.twimg.com/profile_images/1512090674635542529/xZUiesiF_400x400.jpg' />
              </div>
            </div>
            <div className='avatar'>
              <div className='w-8'>
                <img src='https://pbs.twimg.com/profile_images/1635417140118290438/_O05STkG_400x400.jpg' />
              </div>
            </div>

          </div>
          <div className='flex ml-4 text-black '>
            <p className='mb-0'>Le gusta a Brayan57963 y a 8K personas más</p>
          </div>
        </div>
        <div className='flex p-2 text-black'>
          <p>{postDate}</p>
        </div>

        <div className=''>
          <div className='form-control '>
            <div className='input-group border-t border-black'>
              <i className='fa-regular fa-grin-beam text-xl text-[#0D1B2A] btn border-white bg-white hover:bg-gray-400 p-4 cursor-pointer' />
              <input type='text' placeholder='Cumparte tu opinión...' className='input input-bordered bg-white w-full ' />
              <button className='btn btn-square bg-white hover:bg-gray-400 border-white '>
                <svg xmlns='http://www.w3.org/2000/svg' height='1em' viewBox='0 0 512 512'><path d='M16.1 260.2c-22.6 12.9-20.5 47.3 3.6 57.3L160 376V479.3c0 18.1 14.6 32.7 32.7 32.7c9.7 0 18.9-4.3 25.1-11.8l62-74.3 123.9 51.6c18.9 7.9 40.8-4.5 43.9-24.7l64-416c1.9-12.1-3.4-24.3-13.5-31.2s-23.3-7.5-34-1.4l-448 256zm52.1 25.5L409.7 90.6 190.1 336l1.2 1L68.2 285.7zM403.3 425.4L236.7 355.9 450.8 116.6 403.3 425.4z' /></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Comentarios
