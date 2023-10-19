/* eslint-disable react/prop-types */
import React, { useState } from 'react'
import { makeRequest } from '../../library/Axios.js'
import swal from 'sweetalert'

const ProfileSettings = ({ profileId, userprofile }) => {
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [bio, setBio] = useState('')
  const [imageprofile, setImageProfile] = useState({})

  const [showEditImgProfile, setEditImgProfile] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [previewImage, setPreviewImage] = useState({})
  const [imgStyle, setImgStyle] = useState('w-[8vw] h-[8vw] rounded-full transform')

  React.useEffect(() => {
    if (imageError) {
      swal('Error', 'La imagen no puede pesar más de 5MB y los formatos permitidos son .jpg, .jpeg, .png', 'error')
      setImageError(false)
    }
  }, [imageError])

  const handleSubmit = async () => {
    const formData = new FormData()
    formData.append('image', imageprofile)

    try {
      console.log(formData)
      await makeRequest.put(`/user/update/profile-picture/${profileId}`, formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
      setValues(values)
    } catch (error) {
      console.log(error)
    }
  }

  const [values, setValues] = useState({
    name: '',
    username: '',
    bio: '',
    image: null
  })

  const handleImageThumbnail = (e) => {
    const file = e.target.files[0]
    console.log(file)

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
      setImageProfile(file)
    }
  }

  const handleForm = (event) => {
    event.preventDefault()
  }

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setValues({
      ...values,
      [name]: value
    })
  }

  const toggleShowImgProfile = () => {
    const newState = !showEditImgProfile
    setEditImgProfile(newState)
    if (newState) {
      setImgStyle('w-[8vw] h-[8vw] rounded-full transform opacity-50 ')
    } else {
      setImgStyle('w-[8vw] h-[8vw] rounded-full transform')
    }
  }
  console.log(userprofile)
  return (
    <form onSubmit={handleForm}>
      <div className='w-full h-full bg-white'>
        <div className='fixed ml-[35vw] h-[55vh] top-[5em] mx-auto rounded-lg bg-white border-primary border-4 w-[35vw]'>
          <div className='flex'>
            <label
              className='pl-4 h-[14vh] pt-4 mx-auto block relative' style={{ cursor: 'pointer' }} onMouseEnter={toggleShowImgProfile}
              onMouseLeave={toggleShowImgProfile}
            >
              {
                    showEditImgProfile && (
                      <i className='absolute text-2xl fa-regular fa-pen-to-square top-12 left-12 z-20' />
                    )
                  }

              {previewImage
                ? (
                  <img
                    className={imgStyle}
                    src={userprofile.thumbnail}
                    alt='user-thumbnail'
                  />

                  )
                : (
                  <img
                    className={imgStyle}
                    src={previewImage}
                    alt='user-thumbnail'
                  />
                  )}

              <h1 className='font-bold pt-1'>
                Cambiar imagen
              </h1>
              {
                    showEditImgProfile && (
                      <>
                        <input
                          className='hidden'
                          type='file'
                          name='image'
                          onChange={handleImageThumbnail}
                          accept='image/jpeg,image/png,image/jpg'
                        />
                      </>
                    )
                  }
            </label>
            <div className='h-full'>

              <div className='pr-4'>
                <h1 className='pt-4 pb-1 font-bold'>Nombre Completo</h1>
                <input
                  placeholder='Cambia tu nombre'
                  type='text'
                  name='name'
                  values={values.name}
                  onChange={handleInputChange}
                  className='w-[18vw] h-[5vh] rounded-xl border-2 border-[#E0E1DD] text-black resize-none'
                />
              </div>

              <div>
                <h1 className='pt-4 pb-1 font-bold'>Cambia tu Usuario</h1>
                <input
                  placeholder='Cambia tu nombre'
                  type='text'
                  name='username'
                  values={values.username}
                  onChange={handleInputChange}
                  className='w-[18vw] h-[5vh] rounded-xl border-2 border-[#E0E1DD] text-black resize-none'
                />
              </div>

              <div>
                <h1 className='pt-4 pb-1 font-bold'>Cambia tu biografia</h1>
                <input
                  placeholder='Cambia tu biografia'
                  type='text'
                  name='bio'
                  values={values.bio}
                  onChange={handleInputChange}
                  className='w-[18vw] h-[10vh] rounded-xl border-2 border-[#E0E1DD] text-black resize-none'
                />
              </div>

            </div>
          </div>
          <div className='flex justify-center pt-8 gap-4'>
            <button className='bg-neutral hover:bg-secondary text-white rounded-lg p-2 mx-1'>
              Cancelar
            </button>
            <button className='bg-neutral hover:bg-secondary text-white rounded-lg p-2 mx-1' type='submit' onClick={handleSubmit}>
              Confirmar
            </button>
          </div>

        </div>
      </div>
    </form>
  )
}

export default ProfileSettings
