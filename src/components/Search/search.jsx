import { useState, useEffect } from 'react'
import LeftBar from '../Feed/LeftBar'
import Header from '../Header/Header'
import RightBar from '../Feed/RightBar'
import { makeRequest } from '../../library/axios'
import useFindUser from '../../hooks/useFindUser'
import { Link } from '@tanstack/router'
import { PiUserCirclePlusDuotone, PiUserCircleMinusDuotone } from 'react-icons/pi'

const Search = () => {
  const [users, setUsers] = useState([])
  const [posts, setPosts] = useState([])
  const [searchText, setSearchText] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const { user } = useFindUser()
  const [localuser, setLocalUser] = useState([])
  const [userFollows, setUserFollows] = useState([])
  const [loading, setLoading] = useState(false)

  const handleSearch = (event) => {
    setSearchText(event.target.value)
  }

  useEffect(() => {
    console.log('Información del hook useFindUser:', user)
    setLocalUser(user)
  }, [user])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersResponse = await makeRequest.get('/user/find/all')
        if (usersResponse.data && Array.isArray(usersResponse.data.users)) {
          setUsers(usersResponse.data.users)
        } else {
          console.error('La respuesta de usuarios es inválida:', usersResponse)
        }

        const postsResponse = await makeRequest.get('/post/find/all')
        if (postsResponse.data && Array.isArray(postsResponse.data.posts)) {
          setPosts(postsResponse.data.posts)
        } else {
          console.error('La respuesta de posts es inválida:', postsResponse)
        }
      } catch (err) {
        console.error(err)
      }
    }

    fetchData()

    const getfollowers = async () => {
      if (localuser) {
        try {
          setLoading(true)
          if (localuser !== null) {
            const res = await makeRequest.get(`/follow/find/followed/${localuser.user_id}`)
            setUserFollows(res.data.follows)
          }
          setLoading(false)
        } catch (err) {
          console.error(err)
        }
      } else {
        console.log('El usuario no está definido')
      }
    }

    getfollowers()
  }, [localuser])

  useEffect(() => {
    const combinedResults = []

    for (const user of users) {
      const fullName = `${user.first_name} ${user.last_name}`
      if (
        user.username.toLowerCase().includes(searchText.toLowerCase()) ||
        fullName.toLowerCase().includes(searchText.toLowerCase())
      ) {
        combinedResults.push({
          user_id: user.user_id,
          user_thumbnail: user.thumbnail,
          username: user.username,
          text: '',
          followeduser: userFollows.some((follow) => follow.user_id === user.user_id)
        })
      }
    }

    for (const post of posts) {
      if (
        post.text.toLowerCase().includes(searchText.toLowerCase()) ||
        (post.post_id.toString() === searchText && post.user_thumbnail)
      ) {
        const otherUser = users.find((user) => user.user_id === post.post_user_id)
        if (otherUser) {
          combinedResults.push({
            post_id: post.post_id,
            user_thumbnail: otherUser.thumbnail,
            username: otherUser.username,
            text: post.text,
            image: post.image,
            followeduser: userFollows.some((follow) => follow.user_id === otherUser.user_id)
          })
        }
      }
    }

    setSearchResults(combinedResults)
  }, [searchText, users, posts, userFollows])

  const FollowClick = async (user, followeduser) => {
    try {
      setLoading(true)
      console.log(user.user_id, followeduser, localuser.user_id)

      if (followeduser) {
        await makeRequest.delete(`/follow/delete/${localuser.user_id}/${user.user_id}`)
        console.log('Seguidor eliminado correctamente', user.user_id)
      } else {
        await makeRequest.post('/follow/create', {
          followedId: user.user_id,
          followerId: localuser.user_id
        })
        console.log('Seguidor añadido correctamente', user.user_id)
      }

      setLoading(false)

      const updatedFollows = followeduser
        ? userFollows.filter((follow) => follow.user_id !== user.user_id)
        : [...userFollows, { user_id: user.user_id }]

      setUserFollows(updatedFollows)
    } catch (err) {
      console.log(err)
      setLoading(false)
    }
  }

  return (
    <div className='text-black w-full mx-auto min-h-screen fixed'>
      <Header />
      <section className='flex pt-16'>
        <div className='w-full pl-[25%] pr-[25%] min-h-screen flex flex-col rounded-lg justify-start gap-4 items-center px-10'>
          <LeftBar className='' />
          <div className='w-full max-h-screen p-[2em] flex flex-col px-8 border-[#E0E1DD] bg-white rounded-lg mt-8 justify-start items-left pt-[2em] '>
            <div className='w-full pl-3 pb-4'>
              <h1 className='flex font-bold text-3xl text-left'>Búsqueda</h1>
              <div className='form-control'>
                <div className='input-group text-white p-4 '>
                  <input
                    type='text'
                    placeholder='Buscar...'
                    value={searchText}
                    onChange={handleSearch}
                    className='input input-bordered bg-white w-full text-black'
                  />
                  <button className='btn btn-square bg-white'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-6 w-6'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            <div className='max-h-screen overflow-auto'>
              {searchText && (
                <>
                  {searchResults.map((result) => {
                    const isUser = result.hasOwnProperty('user_id')
                    const followeduser = userFollows.find((follows) => follows.user_id === result.user_id)
                    console.log(followeduser)
                    return (
                      <div
                        key={result.user_id || result.post_id}
                        className='flex p-2 border-b cursor-pointer hover:bg-slate-100 '
                      >
                        <div className='p-2'>
                          {result.user_thumbnail && (
                            <img
                              src={result.user_thumbnail}
                              alt={result.username}
                              className='h-10 w-10  flex items-center rounded-full'
                            />
                          )}
                        </div>
                        <Link to={`/post/${result.post_id}`}>
                          <div className='p-2'>
                            <h2 className='text-lg font-semibold'>{result.username}</h2>
                            {result.text && (
                              <>
                                <p className='text-gray-500'>{result.text}</p>
                                <img className='object-fill rounded max-w-lg' src={result.image} alt={result.text} />
                              </>
                            )}
                          </div>
                        </Link>
                        {isUser && (
                          <button
                            className={`ml-auto content-end ${loading[result.user_id] ? 'bg-black' : ''}`}
                            onClick={() => {
                              FollowClick(result, result.followeduser, localuser)
                            }}
                            disabled={Object.values(loading).some((value) => value)}
                          >
                            {loading[result.user_id]
                              ? (
                                <div className='animate-spin rounded-full'>
                                  <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    className='h-6 w-6'
                                    fill='none'
                                    viewBox='0 0 24 24'
                                    stroke='currentColor'
                                  >
                                    <path
                                      strokeLinecap='round'
                                      strokeLinejoin='round'
                                      strokeWidth='2'
                                      d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                                    />
                                  </svg>
                                </div>
                                )
                              : followeduser
                                ? (
                                  <PiUserCircleMinusDuotone className='text-[2em] text-red-500' />
                                  )
                                : (
                                  <PiUserCirclePlusDuotone className='text-[2em] text-green-500' />

                                  )}
                          </button>
                        )}
                      </div>
                    )
                  })}
                </>
              )}
            </div>
          </div>
          <RightBar />
        </div>
      </section>
    </div>
  )
}

export default Search
