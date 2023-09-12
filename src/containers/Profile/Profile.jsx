/// ESTE ES MI CODIGO DE PERFIL, NO SE SI LO VAYAMOS A USAR, PERO LO DEJO POR SI ACASO
// By: Diaxxi
import { useState, useEffect } from 'react'
import LeftBar from '../../components/Feed/LeftBar'
import Posts from '../Profile/ProfilePost.json'
import { Link } from '@tanstack/router'

const Profile = () => {
  const [user, setUser] = useState([])

  useEffect(() => {
    if (localStorage.getItem('user')) {
      const user = JSON.parse(localStorage.getItem('user'))
      setUser(user)
    } else {
      window.alert('No se ha iniciado sesión. Redireccionando...')
      window.location.href = '/'
    }
  }, [setUser])

  return (
    <section className='min-h-screen min-w-screen pb-10'>
      <LeftBar />
      <section className='pl-[25%]'>
        <div className='flex items-center pt-4 justify-center gap-20'>
          <img
            className='w-[10vw] h-[10vw] rounded-full'
            src={user.profilePicture}
            alt='user-thumbnail'
          />
          <div className='flex flex-col gap-2 pt-8'>
            <h1 className='text-lg text-left font-bold'>{user.firstName} {user.lastName}</h1>
            <h2 className='text-left text-lg'>{user.user}</h2>
            <div className='flex gap-4 text-[0.8em]'>
              <h2 className=''><span className='font-bold'>12</span> Seguidores</h2>
              <h2 className=''><span className='font-bold'>25</span> Seguidos</h2>
            </div>
            <div className='max-w-[35vw]'>
              <h2 className='font-bold text-left text-lg'>Biografia</h2>
              <p className='text-left text-md'>Hola,me llamo ricardo, me gusta el anime y leer novelas de chinos coreanos. Espero te guste mi actitud</p>
            </div>
          </div>
        </div>
        <div className='flex gap-8 m-8 pl-24 pt-2 mt-8  mb-8'>
          <div>
            <img
              className='w-[5vw] h-30 rounded-full'
              src='https://i.pinimg.com/564x/46/74/a3/4674a3e9525f7ad39e3e3c5d54673bfb.jpg'
            />
            <h1>Me</h1>
          </div>
          <div>
            <img
              className='w-[5vw] h-30 rounded-full'
              src='https://i.pinimg.com/564x/1f/9b/fe/1f9bfea8792704eb419f0f4d1024388a.jpg'
            />
            <h1>Amigos</h1>
          </div>
          <div>
            <img
              className='w-[5vw] h-30 rounded-full'
              src='https://i.pinimg.com/564x/9f/2b/17/9f2b179938393ae626c04c5683b0ad45.jpg'
            />
            <h1>Familia</h1>
          </div>
        </div>
        <section className='m-8 mx-12'>
          <div className='border-t-2 border-white'>
            <h1 className='mt-2 mb-2 font-bold'>Publicaciones</h1>
          </div>

          <div className='grid gap-1 grid-cols-3 grid-rows-3'>

            {Posts.Posts2.map(Posts => {
              return (
                <Link key={Posts.id} to='/post'>
                  <img
                    className='w-[40vw] h-[40vh]'
                    src={Posts.imagePost}
                  />
                </Link>
              )
            })};

          </div>
        </section>
      </section>
    </section>
  )
}
export default Profile
