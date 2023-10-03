/* eslint-disable react/prop-types */
import { BsFillSendFill } from 'react-icons/bs'
import { useState, useEffect } from 'react'
import { swal } from 'sweetalert'

const ChatForms = ({ issending, message, setMessage, handleSubmit, setSelectedImage, selectedImage, setPreviewMsg, previewMsg, localuser, currentchat }) => {
  const [imageError, setImageError] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  useEffect(() => {
    if (imageError) {
      swal('Error', 'La imagen no puede pesar más de 5MB y los formatos permitidos son .jpg, .jpeg, .png', 'error')
      setImageError(false)
    }
  }, [imageError])

  const handleImageChange = (e) => {
    const file = e.target.files[0]

    if (file) {
      if (file.size > 5000000 || !['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
        setImageError(true)
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result)
      }
      reader.readAsDataURL(file)

      // Guarda el archivo seleccionado
      setSelectedImage(file)
    }
  }

  const handleDeleteImage = () => {
    setPreviewImage('')
    setSelectedImage(null)
  }

  const handleDeleteMsg = () => {
    setPreviewMsg('')
  }

  return (
    <section>
      {previewImage
        ? (
          <div className={previewImage ? 'flex justify-center w-full pt-2 bg-[#ddb89288] rounded-t-xl' : 'hidden'}>
            <img
              src={previewImage}
              alt='preview'
              className={previewImage ? 'w-80 max-h-72 rounded-lg border-2 bg-[#ddb89288] border-[#E0E1DD] object-cover' : 'hidden'}
            />
            <button
              className={previewImage ? 'relative right-[23%] self-start mt-3 disabled:hidden' : 'hidden'}
              type='button'
              onClick={handleDeleteImage}
              disabled={issending}
            >
              <i className='fa-solid fa-trash text-red-600 hover:text-red-400 text-lg' />
            </button>
          </div>
          )
        : (
          <div className={previewMsg ? 'flex items-center pt-6 p-4 h-28  bg-[#ddb89288] rounded-t-xl' : 'hidden'}>
            <i className='p-8' />
            <div className='h-24 max-h-72 w-full bg-neutral rounded-xl flex flex-col justify-center'>
              <div className={`absolute w-2 h-24 rounded-s-xl ${previewMsg.sender_id === localuser.user_id ? 'bg-yellow-500' : 'bg-orange-800'}`} />
              <div>
                {currentchat.sender_id === message.sender_id
                  ? (
                    <p className={previewMsg.sender_id === localuser.user_id ? 'hidden' : `${previewMsg.messageText === '' ? 'absolute' : ''} ml-4 text-white`}>Tu</p>
                    )
                  : (
                    <p className={previewMsg.sender_id === localuser.user_id ? 'hidden' : `${previewMsg.messageText === '' ? 'absolute' : ''} ml-4 text-white`}>{currentchat.username}</p>
                    )}
                {previewMsg.messageText === ''
                  ? (
                    <div className='flex justify-end mr-4'>
                      <img
                        src={previewMsg.imageUrl}
                        alt='preview'
                        className={previewMsg.imageUrl ? 'w-auto h-20 rounded-lg border-2 bg-[#ffffff35] border-[#E0E1DD] object-cover' : 'hidden'}
                      />
                    </div>
                    )
                  : (
                    <p className='ml-4 text-white text-lg'>{previewMsg.messageText}</p>
                    )}
              </div>

            </div>
            <button
              className={previewMsg ? 'disabled:hidden' : 'hidden'}
              type='button'
              onClick={handleDeleteMsg}
            >
              <i className='p-4 text-3xl fa-solid fa-xmark text-white hover:text-red-600' />
            </button>
          </div>
          )}

      <form
        className={previewImage || previewMsg ? 'p-4 pt-2 pb-4 flex bg-[#ddb89288] w-full items-center' : 'p-4 pt-0 pb-4 flex w-full items-center'}
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
            disabled={issending}
            className='hidden'
            onChangeCapture={handleImageChange}
          />
        </div>
        <input
          id='SubmitChat'
          type='text'
          placeholder='Mensaje'
          className='input bg-white text-black rounded-md w-full placeholder:font-semibold'
          value={message}
          minLength={10}
          maxLength={450}
          disabled={issending}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          className='btn btn-ghost'
          onClick={(e) => handleSubmit(e, selectedImage, handleDeleteImage())}
        >
          <BsFillSendFill className={previewImage ? 'text-white text-xl hover:text-primary' : 'text-neutral text-xl hover:text-[#2a3d60cd]'} />
        </button>
      </form>
    </section>
  )
}

export default ChatForms
