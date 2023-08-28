import { useEffect } from 'react'
import LeftBar from '../../components/Feed/LeftBar.jsx'
import RightBar from '../../components/Feed/RightBar.jsx'
import Middle from '../../components/Feed/Middle.jsx'

const Feed = () => {
  useEffect(() => {
    if (!localStorage.getItem('user')) {
      window.alert('No se ha iniciado sesión. Redireccionando...')
      window.location.href = '/'
    }
  }, [])

  return (
    <div className='flex text-black bg-white w-full min-h-screen'>
      <LeftBar />
      <Middle />
      <RightBar />
    </div>
  )
}

export default Feed
