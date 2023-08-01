const Share = () => {
  return (
    <div className=' border pb-3 border-gray-700'>
      <div className='flex p-4 gap-4'>
        <img
          className='w-10 h-10 rounded-full '
          src='https://pbs.twimg.com/profile_images/1636962643876478977/MZB-blU6_400x400.jpg'
          alt='Profile Picture'
        />
        <textarea
          className='p-2 text-white rounded-md w-full h-20 bg-transparent focus:outline-none resize-none'
          placeholder='En qué estás pensando?'
        />
      </div>

      <div className='flex items-center justify-between p-4 pl-10 w-full'>
        <div className='flex'>
          <a href='#' className='text-blue-400 rounded-full p-2'>
            <i className='fa-solid fa-image text-lg' />
          </a>
          <a href='#' className='text-blue-400 rounded-full p-2'>
            <i className='fa-solid fa-image text-lg' />
          </a>
        </div>
        <button
          href='#'
          className='font-bold btn rounded-full px-6 mr-1 flex items-center'
        >
          Publicar
        </button>
      </div>
    </div>
  )
}

export default Share
