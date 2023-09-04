import { useEffect } from 'react'
import LeftBar from '../../components/Feed/LeftBar.jsx'
import RightBar from '../../components/Feed/RightBar.jsx'
import Middle from '../../components/Feed/Middle.jsx'
import Header from '../../components/Header/Header.jsx'
import useAuthStore from '../../context/AuthContext.js'
import useValidateUserLogged from '../../hooks/ValidateUserLogged.jsx'

const Feed = () => {
  const { user, setUser } = useAuthStore()
  useEffect(() => {
    if (localStorage.getItem('user')) {
      const user = JSON.parse(localStorage.getItem('user'))
      setUser(user)
    }
  }, [setUser])

  return (
    <div className='text-black w-full min-h-screen'>
      <Header />
      <section className='flex pt-16'>
        <LeftBar />
        <Middle />
        <RightBar />
      </section>
    </div>
  )
}

export default Feed
