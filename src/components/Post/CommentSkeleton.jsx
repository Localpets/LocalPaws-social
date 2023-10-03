const CommentSkeleton = () => {
  return (
    <li>
      <div className='flex flex-col w-full justify-center py-2'>
        <div className='flex gap-2'>
          <div className='h-8 w-8 rounded-full bg-gray-300' />
          <div className='ml-2 text-left text-md w-[50%] lg:w-[40%] lg:items-center gap-2 flex flex-col lg:flex-row'>
            <div className='w-full px-3 py-2 bg-gray-300 rounded-md animate-pulse' style={{ height: '1.5rem' }} />
          </div>
        </div>
        <div className='flex gap-2 py-2 ml-12 items-center h-12'>
          <div>
            <button className='bg-gray-300 h-4 w-4 rounded-full' disabled />
            <span className='bg-gray-300 w-4 h-4 mt-1 rounded-full' />
          </div>
        </div>
      </div>
    </li>
  )
}

export default CommentSkeleton
