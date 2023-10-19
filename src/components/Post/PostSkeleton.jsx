const PostSkeleton = () => {
  return (
    <div className='border p-4 cursor-pointer  w-full'>
      <div className='flex pb-0'>
        <div className='h-9 w-9 rounded-full bg-gray-300 animate-pulse' />
        <div className='ml-2 flex flex-shrink-0 items-center font-medium'>
          <div className='h-4 w-20 bg-gray-300 animate-pulse' />
          <div className='ml-1 text-sm leading-5 h-4 w-10 bg-gray-300 animate-pulse' />
        </div>
      </div>
      <div className='pl-8 xl:pl-16 pr-4'>
        <div className='font-medium text-left h-4 w-20 bg-gray-300 animate-pulse' />
        <div className='rounded-2xl border border-gray-700 my-3 mr-2 w-full h-96 bg-gray-300 animate-pulse' />
        <div className='flex items-center w-full justify-start gap-x-10'>
          <div className=' flex items-center  text-xs text-gray-400 hover:text-red-600 dark:hover:text-red-600'>
            <div className='h-4 w-10 bg-gray-300 animate-pulse' />
            <div className='h-4 w-10 bg-gray-300 animate-pulse' />
          </div>
          <div className=' flex items-center  text-xs text-gray-400  hover:text-blue-400 dark:hover:text-blue-400'>
            <div className='h-4 w-10 bg-gray-300 animate-pulse' />
            <div className='h-4 w-10 bg-gray-300 animate-pulse' />
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostSkeleton
