/* eslint-disable react/prop-types */
import { BsFillSendFill } from 'react-icons/bs'
const GroupSubmitchat = () => {
  return (
    <section className='bg-base-200'>
      <form
        className='p-4 pt-2 pb-4 flex w-full items-center'
        encType='multipart/form-data' // Configura el tipo de contenido como 'multipart/form-data'
      >
        <div className='mr-5 h-10'>
          <label htmlFor='image' className='badge rounded-lg cursor-pointer flex gap-2 h-full mx-auto bg-neutral hover:bg-[#4c3720cd] text-white ml-2'>
            <i className='fa-solid fa-image' />
          </label>
          <input
            type='file'
            name='image'
            id='image'
            accept='image/jpeg,image/png,image/jpg'
            className='hidden'
          />
        </div>
        <input
          id='SubmitChat'
          type='text'
          placeholder='Mensaje'
          className='input bg-white text-black rounded-md w-full placeholder:font-semibold'
          minLength={10}
          maxLength={450}
        />
        <button
          className='btn btn-ghost'
        >
          <BsFillSendFill className='text-white text-xl hover:text-primary' />
        </button>
      </form>
    </section>
  )
}

export default GroupSubmitchat
