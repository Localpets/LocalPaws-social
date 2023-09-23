/* eslint-disable react-hooks/rules-of-hooks */
import { useState, useEffect } from 'react'
import { Link } from '@tanstack/router'
import LeftBar from '../../components/Feed/LeftBar'
import Posts from '../Profile/ProfilePost.json'
import Header from '../../components/Header/Header'
import useAuthStore from '../../context/AuthContext'
import { useQuery } from '@tanstack/react-query'
import { makeRequest } from '../../library/axios'

const Profile = () => {
  const [userLogged, setUserLogged] = useState({})
  const [userprofile, setUserprofile] = useState({})
  const { setUser } = useAuthStore()
  const [followed, setFollowed] = useState({})
  const [followers, setFollowers] = useState({})
  const [loading, setLoading] = useState(true)

  const { error, data } = useQuery({
    queryKey: ['usuarios'],
    queryFn: async () => {
      return await makeRequest.get('/user/find/id/48').then((res) => {
        setUserprofile(res.data.user)

        return userprofile
      })
    }
  })

  useEffect(() => {
    /// RUTA SEGUIDOS

    const getFollowed = async () => {
      try {
        const res = await makeRequest.get('/follow/followed/count/48')
        setFollowed(res.data)
      } catch (error) {
        console.log(error)
      }
    }
    getFollowed()

    /// RUTA SEGUIDORES

    const getFollowers = async () => {
      try {
        const res = await makeRequest.get('/follow/followers/count/48')
        setFollowers(res.data)
      } catch (error) {
        console.log(error)
      }
    }
    getFollowers()
    setLoading(false)
  }, [setFollowed])

  /// OBTENER DATOS DE USUARIO LOGUEADO

  useEffect(() => {
    if (localStorage.getItem('user')) {
      setUserLogged(JSON.parse(localStorage.getItem('user')))
    } else {
      setUserLogged(useAuthStore.getState().user)
    }
  }, [setUser])

  return (
    <section className='min-h-screen min-w-screen pb-10'>
      <Header />
      <section className='pl-[25%] pt-16'>
        <LeftBar user={userLogged} />
        {loading
          ? (
            <div className='flex justify-center gap-4 pt-8 '>
              <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900' />
              <h1 className='text-black '>Cargando Perfil</h1>
            </div>
            )
          : (
            <div className='bg-white rounded-lg mt-8 mr-8 text-black'>
              <div className='flex items-center pt-4 justify-center gap-20'>
                <img
                  className='w-[10vw] h-[10vw] rounded-full'
                  src={userprofile.thumbnail}
                  alt='user-thumbnail'
                />
                <div className='flex flex-col gap-2 pt-8'>
                  <h1 className='text-lg text-left font-bold'>{userprofile.first_name} {userprofile.last_name}</h1>
                  <h2 className='text-left text-lg'>{userprofile.username}</h2>
                  <div className='flex gap-4 text-[0.8em]'>
                    <h2 className=''><span className='font-bold'>{followers.followersCount}</span> Seguidores</h2>
                    <h2 className=''><span className='font-bold'>{followed.followedCount}</span> Seguidos</h2>
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
            </div>
            )}

      </section>
    </section>
  )
}
export default Profile
