import { useState, useEffect } from 'react'
import { makeRequest } from '../../library/axios'
import { PiUserCirclePlusDuotone, PiUserCircleMinusDuotone, PiUserSwitchDuotone } from 'react-icons/pi'
import useFindUser from '../../hooks/useFindUser'

const RightBar = () => {
  const [localuser, setLocaluser] = useState({})
  const [userlist, setUserlist] = useState([])
  const [userFollows, setUserFollows] = useState([])
  const [loading, setLoading] = useState(false)
  const [randomUsers, setRandomUsers] = useState([])

  const userFromDB = useFindUser()

  useEffect(() => {
    if (localStorage.getItem('user')) {
      const user = userFromDB.user
      setLocaluser(user)
    }
  }, [setLocaluser, userFromDB])

  useEffect(() => {
    const getUserlist = async () => {
      try {
        const res = await makeRequest.get('/user/find/all')
        setUserlist(res.data.users)
      } catch (err) {
        console.error(err)
      }
    }

    getUserlist()

    const getfollowers = async () => {
      if (localuser) {
        try {
          setLoading(true)
          const res = await makeRequest.get(`/follow/find/followed/${localuser.user_id}`)
          setUserFollows(res.data.follows)
          setLoading(false)
        } catch (err) {
          console.error(err)
        }
      } else {
        console.log('El usuario no está definido')
      }
    }

    getfollowers()
  }, [setUserlist, localuser, setUserFollows])

  const getRandomUsers = () => {
    if (localuser) {
      const shuffledUsers = [...userlist].filter(user => user.user_id !== localuser.user_id).sort(() => 0.5 - Math.random())
      const selectedUsers = shuffledUsers.slice(0, 4)
      return selectedUsers
    }
  }

  useEffect(() => {
    const selectedRandomUsers = getRandomUsers()
    setRandomUsers(selectedRandomUsers)
  }, [userlist])

  const FollowClick = async (user, userFollows, setUserFollows, localuser, followeduser) => {
    try {
      setLoading(prevLoading => ({
        ...prevLoading,
        [user.user_id]: true // Iniciar la animación de carga para el usuario actual
      }))

      if (followeduser) {
        await makeRequest.delete(`/follow/delete/${localuser.user_id}/${user.user_id}`)
        console.log('Seguidor eliminado correctamente', localuser.user_id, user.user_id)
      } else {
        await makeRequest.post('/follow/create', {
          followedId: user.user_id,
          followerId: localuser.user_id
        })
        console.log('Seguidor añadido correctamente', localuser.user_id, user.user_id)
      }

      setLoading(prevLoading => ({
        ...prevLoading,
        [user.user_id]: false // Detener la animación de carga para el usuario actual
      }))

      const updatedFollows = followeduser
        ? userFollows.filter((follow) => follow.user_id !== user.user_id)
        : [...userFollows, { user_id: user.user_id }]
      setUserFollows(updatedFollows)
    } catch (err) {
      console.log(err)
      setLoading(prevLoading => ({
        ...prevLoading,
        [user.user_id]: false // Detener la animación de carga en caso de error
      }))
    }
  }

  return (
    <section className='hidden fixed right-0 w-[20%] xl:flex xl:flex-col items-center justify-center gap-5 h-auto text-[#0D1B2AS] text-left mt-10 mr-8'>
      <div className='bg-white w-full h-auto text-[#0D1B2AS] text-left border-2 rounded-lg border-[#E0E1DD] px-4 py-4'>
        <h3 className='text-[#0D1B2AS] font-bold dark:border-dim-200'>
          Personas populares
        </h3>
        <div>
          <div className='p-2 dark:border-dim-200 flex flex-col'>
            {randomUsers
              ? randomUsers.map(user => {
                const followeduser = userFollows.find((follows) => follows.user_id === user.user_id)
                const FollowStatus = followeduser
                  ? <PiUserCircleMinusDuotone className='text-[2em] text-red-500' />
                  : <PiUserCirclePlusDuotone className='text-[2em] text-green-500' />

                return user.user_id === localuser.user_id
                  ? null
                  : (<div key={user.user_id}>
                    <div className='flex items-center mb-2 justify-between'>
                      <div className='flex items-center '>
                        <img
                          className='w-10 h-10 rounded-full'
                          src={user.thumbnail}
                          alt={user.username}
                        />
                        <div className='ml-2 text-sm'>
                          <h5 className='text-[#0D1B2A] font-bold'>
                            {user.first_name} {user.last_name}
                          </h5>
                          <p className='text-gray-400'>{user.username}</p>
                        </div>
                      </div>
                      <div className='flex items-center'>
                        {loading[user.user_id]
                          ? (<PiUserSwitchDuotone className='animate-spin rounded-full text-[2em]' />
                            )
                          : <button
                              className='ml-auto content-end'
                              onClick={() => {
                                FollowClick(user, userFollows, setUserFollows, localuser, followeduser)
                              }}
                              disabled={Object.values(loading).some(value => value)}
                            >
                            {FollowStatus}
                            {/* eslint-disable-next-line react/jsx-closing-tag-location */}
                          </button>}
                      </div>

                    </div>
                    {/* eslint-disable-next-line react/jsx-closing-tag-location */}
                  </div>
                    )
              })
              : null}
          </div>

          <div className='text-blue-400 cursor-pointer p-2'>Ver más</div>
        </div>
      </div>
      <div className='bg-white w-full h-auto text-[#0D1B2AS] text-left border-2 rounded-lg border-[#E0E1DD] px-4 py-4'>
        <h3 className='text-[#0D1B2AS] font-bold dark:border-dim-200'>
          Veterinarias populares
        </h3>
        <div>
          <div className='p-2 dark:border-dim-200 flex justify-between items-center'>
            <div className='flex items-center '>
              <img
                className='w-10 h-10 rounded-full '
                src='https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
                alt=''
              />
              <div className='ml-2 text-sm'>
                <h5 className='text-[#0D1B2A] font-bold'>veterinaria prinx</h5>
                <p className='text-gray-400'>@Vet_Prinx</p>
              </div>
            </div>
            <span className='text-right text-solid text-[#415A77] cursor-pointer ml-auto'>Seguir</span>
          </div>
          <div className='p-2 dark:border-dim-200 flex justify-between items-center'>
            <div className='flex items-center '>
              <img
                className='w-10 h-10 rounded-full '
                src='https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
                alt=''
              />
              <div className='ml-2 text-sm'>
                <h5 className='text-[#0D1B2A] font-bold'>Veterinaria leon</h5>
                <p className='text-gray-400'>@vet_leon</p>
              </div>
            </div>
            <span className='text-right text-solid text-[#415A77] cursor-pointer ml-auto'>Seguir</span>
          </div>
          <div className='p-2 dark:border-dim-200 flex justify-between items-center'>
            <div className='flex items-center '>
              <img
                className='w-10 h-10 rounded-full '
                src='https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
                alt=''
              />
              <div className='ml-2 text-sm'>
                <h5 className='text-[#0D1B2A] font-bold'>Fundación Veterinaria Labrador</h5>
                <p className='text-gray-400'>@fundacionlabrador</p>
              </div>
            </div>
            <span className='text-right text-solid text-[#415A77] cursor-pointer ml-auto'>Seguir</span>
          </div>
          <div className='text-blue-400 cursor-pointer p-2'>Ver más</div>
        </div>
      </div>
    </section>
  )
}

export default RightBar
