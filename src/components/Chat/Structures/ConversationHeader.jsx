/* eslint-disable react/prop-types */
const ConversationHeader = ({ currentchat, toggleSideContactsStyle, toggleHamburguerStyle }) => {
  return (
    <section className='flex w-full items-center justify-between px-2 bg-neutral'>
      <div className='flex'>
        <div className='flex items-center gap-2 py-4 md:gap-4 md:pt-4 md:pl-4 md:pb-4'>
          {currentchat.conversation
            ? (
              <img
                className='w-10 h-10 md:w-14 md:h-14 rounded-full'
                src={currentchat.thumbnail}
                alt={currentchat.username}
              />
              )
            : (
              <h1 className='text-white text-3xl FontTitle'>
                Pawsplorer <span className='font-bold text-white'> Messenger</span>
              </h1>
              )}

          <h2 className='font-bold text-lg text-white'>
            {currentchat.username}
          </h2>
        </div>
      </div>

      <label className='z-20 btn btn-sm btn-circle swap swap-rotate mr-2 md:hidden'>
        <input
          type='checkbox' className='hidden' onClick={() => {
            toggleSideContactsStyle()
            toggleHamburguerStyle()
          }}
        />

        <svg
          className='swap-off fill-current'
          xmlns='http://www.w3.org/2000/svg'
          width='24'
          height='24'
          viewBox='0 0 512 512'
        >
          <path d='M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z' />
        </svg>

        <svg
          className='swap-on fill-current'
          xmlns='http://www.w3.org/2000/svg'
          width='24'
          height='24'
          viewBox='0 0 512 512'
        >
          <polygon points='400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49' />
        </svg>
      </label>
    </section>
  )
}

export default ConversationHeader
