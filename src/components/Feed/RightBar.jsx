// import { useState, useEffect } from 'react'

const RightBar = () => {
  return (
    <section className='hidden fixed right-0 w-[20%] xl:flex xl:flex-col items-center justify-center gap-5 h-auto text-[#0D1B2AS] text-left mt-10 mr-8'>
      <div className='bg-white w-full h-auto text-[#0D1B2AS] text-left border-2 rounded-lg border-[#E0E1DD] px-4 py-4'>
        <h3 className='text-[#0D1B2AS] font-bold dark:border-dim-200'>
          Personas populares
        </h3>
        <div>
          <div className='p-2 dark:border-dim-200 flex justify-between items-center'>
            <div className='flex items-center '>
              <img
                className='w-10 h-10 rounded-full '
                src='https://pbs.twimg.com/profile_images/1635417140118290438/_O05STkG_400x400.jpg'
                alt=''
              />
              <div className='ml-2 text-sm'>
                <h5 className='text-[#0D1B2A] font-bold'>Camilo Correa</h5>
                <p className='text-gray-400'>@Brayan57963</p>
              </div>
            </div>
            <span className='text-right text-solid text-[#415A77] cursor-pointer ml-auto'>Seguir</span>
          </div>
          <div className='p-2 dark:border-dim-200 flex justify-between items-center'>
            <div className='flex items-center '>
              <img
                className='w-10 h-10 rounded-full '
                src='https://pbs.twimg.com/profile_images/1512090674635542529/xZUiesiF_400x400.jpg'
                alt=''
              />
              <div className='ml-2 text-sm'>
                <h5 className='text-[#0D1B2A] font-bold'>Ricardo Villanueva</h5>
                <p className='text-gray-400'>@Ricardoarsv</p>
              </div>
            </div>
            <span className='text-right text-solid text-[#415A77] cursor-pointer ml-auto'>Seguir</span>
          </div>
          <div className='p-2 dark:border-dim-200 flex justify-between items-center'>
            <div className='flex items-center '>
              <img
                className='w-10 h-10 rounded-full '
                src='https://pbs.twimg.com/profile_images/1565904417789968385/5XmhSo3N_400x400.jpg'
                alt=''
              />
              <div className='ml-2 text-sm'>
                <h5 className='text-[#0D1B2A] font-bold'>Santiago Diaz</h5>
                <p className='text-gray-400'>@santiagodiaz_11</p>
              </div>
            </div>
            <span className='text-right text-solid text-[#415A77] cursor-pointer ml-auto'>Seguir</span>
          </div>
          <div className='text-blue-400 cursor-pointer p-2'>Ver más</div>
        </div>
      </div>
      <div className='bg-white w-full h-auto text-[#0D1B2AS] text-left border-2 rounded-lg border-[#E0E1DD] px-4 py-4'>
        <h3 className='text-[#0D1B2AS] font-bold dark:border-dim-200'>
          Veterinarias populares
        </h3>
        <div>
          <div className='p-2 dark:border-dim-200 flex justify-between items-center'>
            <div className='flex items-center '>
              <img
                className='w-10 h-10 rounded-full '
                src='https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
                alt=''
              />
              <div className='ml-2 text-sm'>
                <h5 className='text-[#0D1B2A] font-bold'>veterinaria prinx</h5>
                <p className='text-gray-400'>@Vet_Prinx</p>
              </div>
            </div>
            <span className='text-right text-solid text-[#415A77] cursor-pointer ml-auto'>Seguir</span>
          </div>
          <div className='p-2 dark:border-dim-200 flex justify-between items-center'>
            <div className='flex items-center '>
              <img
                className='w-10 h-10 rounded-full '
                src='https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
                alt=''
              />
              <div className='ml-2 text-sm'>
                <h5 className='text-[#0D1B2A] font-bold'>Veterinaria leon</h5>
                <p className='text-gray-400'>@vet_leon</p>
              </div>
            </div>
            <span className='text-right text-solid text-[#415A77] cursor-pointer ml-auto'>Seguir</span>
          </div>
          <div className='p-2 dark:border-dim-200 flex justify-between items-center'>
            <div className='flex items-center '>
              <img
                className='w-10 h-10 rounded-full '
                src='https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
                alt=''
              />
              <div className='ml-2 text-sm'>
                <h5 className='text-[#0D1B2A] font-bold'>Fundación Veterinaria Labrador</h5>
                <p className='text-gray-400'>@fundacionlabrador</p>
              </div>
            </div>
            <span className='text-right text-solid text-[#415A77] cursor-pointer ml-auto'>Seguir</span>
          </div>
          <div className='text-blue-400 cursor-pointer p-2'>Ver más</div>
        </div>
      </div>
    </section>
  )
}

export default RightBar
