import { useEffect } from 'react'
import LeftBar from '../../components/Feed/LeftBar.jsx'
import RightBar from '../../components/Feed/RightBar.jsx'
import Middle from '../../components/Feed/Middle.jsx'
import Header from '../../components/Header/Header.jsx'
const Feed = () => {
  useEffect(() => {
    if (!localStorage.getItem('user')) {
      window.alert('No se ha iniciado sesión. Redireccionando...')
      window.location.href = '/'
    }
  }, [])

  return (
    <div className='text-black w-full min-h-screen'>
      <Header />
      <section className='flex'>
        <LeftBar />
        <Middle />
        <RightBar />
      </section>
    </div>
  )
}

export default Feed
