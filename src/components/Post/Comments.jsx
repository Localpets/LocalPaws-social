// import React from 'react'

const Comments = () => {
  return (

    <div className='py-[2em] flex flex-col md:flex-row'>

      <div className='border border-r border-[#E0E1DD] md:w-1/2'>
        <img
          className=' '
          src='https://scontent.fcuc1-1.fna.fbcdn.net/v/t1.6435-9/77414073_10157912000298734_845404547747676160_n.jpg?_nc_cat=110&cb=99be929b-59f725be&ccb=1-7&_nc_sid=84a396&_nc_eui2=AeGOu9XTpfaYLl-Iq_EVcMXAWBCFUO-cnnZYEIVQ75yedsrS60rGFiywWQGmNdWo-1D6hWtxNo4LpP4dD3TOFjVs&_nc_ohc=4RzrU8c6Z9UAX9T4LmY&_nc_ht=scontent.fcuc1-1.fna&oh=00_AfBgkRrwcmP8KK8xxuJtK1e1BqtIQUUiXwlr2bgRdSdUlw&oe=64FB912E'
          alt=''
        />
      </div>

      <div className=' border-b border-[#E0E1DD] md:w-1/2 flex flex-col md:flex-row justify-between'>

        <div className='p-[1em] items-center md:order-2 flex items-center md:items-start justify-center md:justify-start md:ml-2 mb-2 md:mb-0'>
          <i className='fa-solid fa-ellipsis text-xl text-[#0D1B2A]' />
        </div>

        <div className='flex'>
          <div className='flex'>
            <img
              className='w-10 h-10 rounded-full border-2 border-green-600'
              src='https://pbs.twimg.com/profile_images/1636962643876478977/MZB-blU6_400x400.jpg'
              alt=''
            />
          </div>

          <div className='flex  md:items-start md:ml-2 text-sm flex  md:items-start md:ml-2 text-sm flex flex-col'>
            <h5 className='text-[#0D1B2A] font-bold mb-1'>Diego Garcia</h5>
            <p className='text-gray-400 '>@Ripdiegozz</p>
          </div>
        </div>

      </div>
    </div>

  )
}

export default Comments
