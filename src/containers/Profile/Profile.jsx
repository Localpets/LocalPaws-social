import { useState, useEffect } from 'react'
import LeftBar from '../../components/Feed/LeftBar'
import Header from '../../components/Header/Header'
import { useQuery } from '@tanstack/react-query'
import { makeRequest } from '../../library/axios'
import PostQueryWrapper from '../../components/Post/PostQueryWrapper'
import PostForm from '../../components/Forms/PostForm'
import ProfileSettings from './ProfileSettings'

const Profile = () => {
  const profileId = new URL(window.document.location).pathname.split('/').pop()
  const [userLogged, setUserLogged] = useState({})
  const [userprofile, setUserprofile] = useState({})
  const [followed, setFollowed] = useState({})
  const [followers, setFollowers] = useState({})
  const [loading, setLoading] = useState(true)
  const [userpost, setUserpost] = useState([])
  const [postloading, setPostLoading] = useState(true)
  const [loadedImage, setLoadedImage] = useState(null)
  const [showLoadedImage, setShowLoadedImage] = useState(false)
  const [uploadedImage, setUploadedImage] = useState(null)
  const [showNewSection, setShowNewSection] = useState(false)
  const [settings, setSettings] = useState(false)

  /// MOSTRAR PAWSTEAR EN VISTA DE PERFIL

  const toggleNewSection = () => {
    setShowNewSection(!showNewSection)
  }

  /// MOSTRAR VISTA DE SETTINGS
  const toggleSettings = () => {
    setSettings(!settings)
  }

  /// MOSTRAR HISTORIAS DE PERFIL

  // Manejador de clic en la imagen y el texto "Add"
  const handleAddClick = () => {
    // Aquí puedes cargar la imagen, por ejemplo, desde un formulario o una API.
    // Supongamos que cargamos una imagen de ejemplo.
    const imageUrl = 'https://i.pinimg.com/564x/46/74/a3/4674a3e9525f7ad39e3e3c5d54673bfb.jpg'

    localStorage.setItem('loadedImage', imageUrl)
    // Actualiza el estado de la imagen cargada
    setLoadedImage(imageUrl)
    // Muestra la imagen cargada y el botón
    setShowLoadedImage(true)
  }

  const handleImageUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      const imageUrl = URL.createObjectURL(file)
      setUploadedImage(imageUrl)
      // También puedes enviar la imagen al servidor en este punto si es necesario
    }
  }

  ///

  const currentUser = 48

  const { error, data } = useQuery({
    queryKey: ['usuarios'],
    queryFn: async () => {
      return await makeRequest.get(`/user/find/id/${profileId}`).then((res) => {
        setUserprofile(res.data.user)
        return userprofile
      })
    }
  })

  /// RUTA SEGUIDOS

  useEffect(() => {
    const getFollowed = async () => {
      try {
        const res = await makeRequest.get(`/follow/followed/count/${profileId}`)
        setFollowed(res.data)
      } catch (error) {
        console.log(error)
      }
    }
    getFollowed()

    /// RUTA SEGUIDORES

    const getFollowers = async () => {
      try {
        const res = await makeRequest.get(`/follow/followers/count/${profileId}`)
        setFollowers(res.data)
      } catch (error) {
        console.log(error)
      }
    }
    getFollowers()
    setLoading(false)
  }, [setFollowed])

  /// OBTENER POST DE USUARIO

  const { } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      // eslint-disable-next-line camelcase
      return makeRequest.get(`/post/user/${currentUser}`).then((res) => {
        // sort posts by id descending
        const sortedPosts = res.data.posts.sort((a, b) => b.post_id - a.post_id)
        setUserpost(sortedPosts)
        setPostLoading(false)

        return res.data
      })
    }
  })

  return (
    <section className='min-h-screen min-w-screen pb-8'>
      {settings && (
        <ProfileSettings />
      )}
      <Header />
      <section className='pl-[25%] pt-16'>
        <LeftBar user={userLogged} isProfileView toggleNewSection={toggleNewSection} />
        {loading
          ? (
            <div className='flex justify-center gap-4 pt-8 '>
              <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900' />
              <h1 className='text-black '>Cargando Perfil</h1>
            </div>
            )
          : (
            <div className='bg-white rounded-lg mt-8 pb-6 mr-8 text-black'>
              <div className=''>
                <div className='flex items-center pt-4 justify-center gap-10'>
                  <label htmlFor='imageUpload' style={{ cursor: 'pointer' }}>
                    <img
                      className='w-[10vw] h-[10vw] rounded-full'
                      src={uploadedImage || userprofile.thumbnail}
                      alt='user-thumbnail'
                    />
                    <input
                      type='file'
                      id='imageUpload'
                      accept='image/*'
                      style={{ display: 'none' }}
                      onChange={handleImageUpload}
                    />
                  </label>
                  <div className='flex flex-col gap-2 pt-8'>
                    <h1 className='text-lg text-left font-bold'>{userprofile.first_name} {userprofile.last_name}</h1>
                    <h2 className='text-left text-lg'>{userprofile.username}</h2>
                    <div className='flex gap-4 text-[0.8em]'>
                      <h2 className=''><span className='font-bold'>{followers.followersCount}</span> Seguidores</h2>
                      <h2 className=''><span className='font-bold'>{followed.followedCount}</span> Seguidos</h2>
                    </div>
                    <div className='max-w-[35vw]'>
                      <h2 className='font-bold text-left text-lg'>Biografia</h2>
                      <p className='text-left text-md'>Hola, me llamo ricardo, me gusta el anime y leer novelas de chinos coreanos. Espero te guste mi actitud</p>
                    </div>
                  </div>
                  <section className='h-full flex self-start pt-8'>
                    <button onClick={toggleSettings} className='btn btn-ghost justify-self-start rounded-lg cursor-pointer flex gap-2 bg-primary text-white border-primary '>
                      <h1>Edit profile</h1>
                    </button>
                  </section>
                </div>
              </div>
            </div>

            )}
        {showNewSection && (
          <section className='min-h-auto min-w-screen pr-8'>
            <div className='rounded-lg pt-2 text-black'>
              <section className='  '>
                <div className='rounded-lg flex justify-center bg-white'>
                  <PostForm />
                </div>
              </section>
            </div>
          </section>

        )}
        <section className='min-h-auto min-w-screen '>
          <div className='rounded-lg pt- text-black '>
            <section className='mt-2 mr-8'>
              <div className='rounded-lg border flex justify-center bg-white'>
                <h1 className='mt-2 mb-2 font-bold'>Publicaciones</h1>
              </div>

              <div className='flex flex-col pb-4 pt-2 items-center gap-4 min-h-screen'>
                {postloading
                  ? (
                    <div className='flex justify-center gap-4 pt-8 '>
                      <div className='animate-spin rounded-full h-8 border-b-2 border-gray-900' />
                      <h1 className='text-black '>Cargando Posts</h1>
                    </div>
                    )
                  : (
                      userpost.map((post) => (
                        <PostQueryWrapper key={post.post_id} post={post} />
                      ))
                    )}
              </div>
            </section>
          </div>
        </section>
      </section>
    </section>
  )
}
export default Profile
