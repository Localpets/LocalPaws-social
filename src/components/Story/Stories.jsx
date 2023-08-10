// import React from 'react'

const Stories = () => {
  return (
    <div className='flex flex-row w-full text-solid text-[#0D1B2A] text-center'>
      <ul className='flex'>
        <li className='flex-none p-2 text-center flex flex-col items-center'>
          <img
            className='rounded-full w-16 h-16 border-2 border-green-600'
            src='https://pbs.twimg.com/profile_images/1636962643876478977/MZB-blU6_400x400.jpg'
            alt=''
          />
          <span>Ripdiegozz</span>
        </li>

        <li className='flex-none p-2 text-center flex flex-col items-center'>
          <img
            className='rounded-full w-16 h-16 border-2 border-green-600'
            src='https://pbs.twimg.com/profile_images/1635417140118290438/_O05STkG_400x400.jpg'
            alt=''
          />
          <span>Brayan57963</span>
        </li>

        <li className='flex-none p-2 text-center flex flex-col items-center'>
          <img
            className='rounded-full w-16 h-16 border-2 border-green-600'
            src='https://pbs.twimg.com/profile_images/1512090674635542529/xZUiesiF_400x400.jpg'
            alt=''
          />
          <span> ricardoarsv</span>
        </li>
      </ul>
    </div>
  )
}

export default Stories
