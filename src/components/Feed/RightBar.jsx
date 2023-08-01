// import React from 'react'

const RightBar = () => {
  return (
    <div className='hidden ml-10 w-[30%] xl:block text-white'>
      <div className='bg-[#192734] rounded-2xl m-2 mt-4'>
        <h3 className='text-white font-bold p-3 border-b border-gray-200 dark:border-dim-200'>
          En tendencia
        </h3>
        <div className='p-3 border-b border-gray-200 dark:border-dim-200'>
          <h4 className='font-bold  text-white'>
            #Adopcion
          </h4>
          <p className='text-xs text-gray-400'>29.7K Tweets</p>
        </div>
        <div className='text-blue-400  p-3 cursor-pointer'>Ver más</div>
      </div>

      <div className='bg-gray-800 rounded-2xl m-2 mt-4'>
        <h3 className='text-white font-bold p-3 border-b border-gray-200 dark:border-dim-200'>
          A quién seguir
        </h3>
        <div className='p-5 border-b border-gray-200 dark:border-dim-200 flex justify-between items-center'>
          <div className='flex '>
            <img
              className='w-10 h-10 rounded-full'
              src='https://pbs.twimg.com/profile_images/1636962643876478977/MZB-blU6_400x400.jpg'
              alt=''
            />
            <div className=' ml-2  text-sm '>
              <h5 className='text-white font-bold'>
                Diego Garcia
              </h5>
              <p className='text-gray-400 '>@Ripdiegozz</p>
            </div>
          </div>
          <a
            href='#'
            className='text-sm font-bold text-blue-400 px-5 py-2 rounded-full border-2 border-blue-400'
          >
            Seguir
          </a>
        </div>

        <div className='p-5 border-b border-[#192734] dark:border-dim-200 '>
          <div className='flex gap-x-4 animate-pulse'>
            <div className='rounded-full bg-gray-400 h-12 w-12' />
            <div className='flex-1  space-y-2 py-1'>
              <div className='h-4 bg-gray-400 rounded w-5/6' />
              <div className='h-4 bg-gray-400 rounded w-3/4' />
              <div className='h-4 bg-gray-400 rounded w-4/6' />
            </div>
          </div>
        </div>

        <div className='text-blue-400  p-3 cursor-pointer'>Ver más</div>
      </div>
    </div>
  )
}

export default RightBar
