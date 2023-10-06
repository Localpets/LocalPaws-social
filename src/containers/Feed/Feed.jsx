import LeftBar from '../../components/Feed/LeftBar.jsx'
import RightBar from '../../components/Feed/RightBar.jsx'
import Middle from '../../components/Feed/Middle.jsx'
import Header from '../../components/Header/Header.jsx'

const Feed = () => {
  return (
    <div className='text-black w-full min-h-screen'>
      <Header />
      <section className='flex py-16 w-full'>
        <div className='hidden lg:flex'>
          <LeftBar />
        </div>
        <Middle />
        <div className='hidden lg:flex'>
          <RightBar />
        </div>
      </section>
    </div>
  )
}

export default Feed
