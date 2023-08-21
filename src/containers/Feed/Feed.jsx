// import React from 'react'
import LeftBar from '../../components/Feed/LeftBar.jsx'
import RightBar from '../../components/Feed/RightBar.jsx'
import Middle from '../../components/Feed/Middle.jsx'

const Feed = () => {
  return (
    <div className='flex text-black w-full h-full'>
      <LeftBar />
      <Middle />
      <RightBar />
    </div>
  )
}

export default Feed
