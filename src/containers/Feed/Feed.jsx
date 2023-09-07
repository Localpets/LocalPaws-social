import { useEffect, useState } from 'react'
import LeftBar from '../../components/Feed/LeftBar.jsx'
import RightBar from '../../components/Feed/RightBar.jsx'
import Middle from '../../components/Feed/Middle.jsx'
import Header from '../../components/Header/Header.jsx'
import useAuthStore from '../../context/AuthContext.js'

const Feed = () => {
  const { setUser } = useAuthStore()
  const [userExists, setUserExists] = useState({})

  useEffect(() => {
    const fetchUserFromLocal = async () => {
      if (localStorage.getItem('user')) {
        const user = await JSON.parse(localStorage.getItem('user'))
        setUser(user)
        setUserExists(user)
      }
    }

    fetchUserFromLocal()
  }, [setUser])

  return (
    <div className='text-black w-full min-h-screen'>
      <Header />
      <section className='flex pt-16'>
        <LeftBar user={userExists} />
        <Middle user={userExists} />
        <RightBar />
      </section>
    </div>
  )
}

export default Feed
