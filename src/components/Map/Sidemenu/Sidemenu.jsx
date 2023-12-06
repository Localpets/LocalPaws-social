/* eslint-disable multiline-ternary */
/* eslint-disable react/jsx-props-no-multi-spaces */
import { useEffect, useState } from 'react'
import {
  BsTelephoneFill,
  BsFillClockFill,
  BsFillBuildingFill,
  BsFillCaretRightFill,
  BsFillCaretLeftFill
} from 'react-icons/bs'
import { swal } from 'sweetalert'

import { Rating } from '@mui/material'

import { useStore } from '../context/store'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import { makeRequest } from '../../../library/Axios'
import useFindUser from '../../../hooks/useFindUser'
import useAuthStore from '../../../context/AuthContext'
import LoadingGif from '../../LoadingState/LoadingGif'
import './styles.css'
import '../Pawsmap/Pawsmap.css'

const Sidemenu = () => {
  // Usar el contexto para obtener valores y funciones
  const {
    selectedMarkerData,
    isSidebarOpen,
    setSidebarOpen,
    isLoading,
    setIsLoading,
    fetchLocationsData
  } = useStore()

  const [localuser, setLocaluser] = useState([])
  const [score, setScore] = useState([])
  const [value, setValue] = useState(0)
  const [hasReview, setHasReview] = useState([])
  const [editing, setEditing] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(false)
  const [editedData, setEditedData] = useState({
    name: '',
    phone_number: '',
    locationPhotos: [],
    schedule: '',
    address: ''
  })
  const [imageError, setImageError] = useState(false)
  const [phoneNumberError, setPhoneNumberError] = useState(false)
  const [selectedphotos, setSelectedphotos] = useState([])
  const [newPhotosPreview, setNewPhotosPreview] = useState([])

  const { loggedUser } = useAuthStore()
  const { user } = useFindUser(loggedUser)

  useEffect(() => {
    if (user) {
      setLocaluser(user)
    }
  }, [user])

  // Controlar la carga del contenido cuando hay datos de marcador seleccionados
  useEffect(() => {
    if (selectedMarkerData) {
      setIsLoading(true)
      fetchReview(selectedMarkerData.id)
      const loadingTimer = setTimeout(() => {
        setIsLoading(false)
      }, 1000)

      return () => clearTimeout(loadingTimer)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMarkerData, setIsLoading])

  useEffect(() => {
    if (imageError) {
      swal('Error', 'La imagen no puede pesar más de 5MB y los formatos permitidos son .jpg, .jpeg, .png', 'error')
      setImageError(false)
    }
  }, [imageError])

  const fetchReview = async (id) => {
    try {
      const response = await makeRequest.get(`location/review/find/${id}`)

      let userScore = 0

      response.data.reviews.forEach((review) => {
        if (review.review_user_id === localuser.user_id) {
          userScore = review.score
          setHasReview([true, review.review_id])
        }
      })

      setValue(userScore)

      if (response.data.reviews.length === 0) {
        console.log('No hay reviews disponibles.')
        setScore(0)
        setHasReview([false, 0])
        return
      }

      const promedio =
        response.data.reviews.reduce((suma, review) => suma + review.score, 0) /
        response.data.reviews.length

      setScore(Math.round((promedio + Number.EPSILON) * 100) / 100)
    } catch (error) {
      console.error('Error al obtener las reviews:', error)
    }
  }

  const updateScore = async (id, score) => {
    try {
      await makeRequest.put(`location/review/update/${id}`, {
        score
      })
    } catch (error) {
      console.error('Error al actualizar la review:', error)
    }
  }

  const createReview = async (locationId, userId, score) => {
    try {
      await makeRequest.post('location/review/create', {
        userId,
        score,
        locationId
      })
    } catch (error) {
      console.error('Error al crear la review:', error)
    }
  }

  const handleSeleccion = (e) => {
    const valorSeleccionado = e.target.value
    if (hasReview[0] === true) {
      updateScore(hasReview[1], valorSeleccionado)
    } else {
      createReview(selectedMarkerData.id, localuser.user_id, valorSeleccionado)
      console.log(selectedMarkerData.id)
    }
    setValue(valorSeleccionado)
  }

  const handleInputChange = (e, field) => {
    setEditedData((prevData) => ({
      ...prevData,
      [field]: e.target.value
    }))
  }

  const handlePhotoChange = (e, index, id) => {
    const file = e.target.files[0]

    if (file) {
      if (file.size > 5000000 || !['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
        setImageError(true)
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        // Actualiza el estado newPhotosPreview con la nueva imagen
        setNewPhotosPreview((prevPhotos) => {
          const updatedPhotos = [...prevPhotos]
          updatedPhotos[index] = reader.result
          return updatedPhotos
        })
      }
      reader.readAsDataURL(file)

      // Actualiza el estado selectedphotos con la nueva foto
      setSelectedphotos((prevPhotos) => {
        const updatedPhotos = [...prevPhotos]
        updatedPhotos[index] = { file, id }
        return updatedPhotos
      })
    }
  }

  const handleDeleteImage = (e, index) => {
    // Guardar temporalmente la foto que se va a eliminar
    const deletedPhoto = selectedMarkerData.img[index].photo_url

    if (selectedphotos.length === 0) {
      console.log('nada que borra')
    } else {
      // Eliminar la foto de la lista de fotos actuales
      setNewPhotosPreview((prevPhotos) => {
        const updatedPhotos = [...prevPhotos]
        updatedPhotos[index] = deletedPhoto
        return updatedPhotos
      })

      setSelectedphotos((prevPhotos) => {
        const updatedPhotos = [...prevPhotos]
        updatedPhotos[index] = { file: deletedPhoto, id: selectedphotos[index].id }
        return updatedPhotos
      })

      // Puedes mostrar un mensaje de confirmación, usar una alerta, etc.
      console.log(`Foto eliminada: ${deletedPhoto}`)
    }
  }

  const handleSendEditData = async () => {
    try {
      // Validar el número de teléfono
      if (editedData.phone_number.length !== 10) {
        setPhoneNumberError(true)
        return
      }

      // Establecer el estado de carga en true
      setIsLoadingData(true)

      // Restablecer el estado de error
      setPhoneNumberError(false)

      // Crear un objeto FormData
      const formData = new FormData()

      // Agregar datos al FormData
      formData.append('name', editedData.name !== '' ? editedData.name : selectedMarkerData.name)
      formData.append('address', editedData.address !== '' ? editedData.address : selectedMarkerData.address)
      formData.append('phone_number', editedData.phone_number !== '' ? editedData.phone_number : selectedMarkerData.phone_number)
      formData.append('schedule', editedData.schedule !== '' ? editedData.schedule : selectedMarkerData.schedule)

      // Agregar cada foto al FormData
      selectedphotos.map((photo) => formData.append('image', photo.file, photo.id))

      const response = await makeRequest.put(`location/update/${selectedMarkerData.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      console.log(formData.get('name'))
      console.log(formData.get('address'))
      console.log(formData.get('phone_number'))
      console.log(formData.get('schedule'))
      console.log(formData.get('image'))

      // Procesar la respuesta
      const newMarkerdata = response.data.location

      selectedMarkerData.name = newMarkerdata.name
      selectedMarkerData.address = newMarkerdata.address
      selectedMarkerData.phone_number = newMarkerdata.phone_number
      selectedMarkerData.schedule = newMarkerdata.schedule

      fetchLocationsData()

      // Reiniciar estados
      setEditing(false)
      setNewPhotosPreview([])
      setIsLoadingData(false)
    } catch (error) {
      console.error('Error al enviar los datos editados:', error)
      setIsLoadingData(false)
    }
  }

  const handleEditMode = () => {
    setEditing(!editing)
    if (editing) {
      handleCancelEdit()
    }
  }

  const handleCancelEdit = () => {
    setNewPhotosPreview(selectedMarkerData.img.map(photo => photo.photo_url))
    setSelectedphotos(selectedMarkerData.img.map(photo => photo.photo_url))
  }

  const SwiperImg = () => {
    return (
      <Swiper
        pagination={{
          type: 'navigation'
        }}
        navigation
        modules={[Pagination, Navigation]}
        className='mySwiper w-[20em]'
      >
        {selectedMarkerData.img.length !== 0 ? (
          selectedMarkerData.img.map((photo, index) => (
            <SwiperSlide key={index}>
              <div className='relative'>
                {editing && (
                  <>
                    {/* Cuadrado blanco transparente */}
                    <div className='absolute top-0 left-20 w-40 h-full bg-white opacity-50 rounded-lg' />

                    {/* Icono de lápiz con input */}
                    <label htmlFor={`fileInput-${index}`} className='absolute top-2 left-24 cursor-pointer'>
                      <i className='fa fa-pencil text-neutral text-lg' />
                    </label>
                    <div className='absolute top-10 left-24 cursor-pointer'>
                      <i
                        className='fa fa-trash text-neutral text-lg'
                        onClick={(e) => handleDeleteImage(e, index)}
                      />
                    </div>

                    <input
                      id={`fileInput-${index}`}
                      type='file'
                      className='hidden'
                      onChange={(e) => handlePhotoChange(e, index, photo.location_photo_id)}
                    />
                  </>
                )}
                <img src={newPhotosPreview.length > index ? newPhotosPreview[index] : photo.photo_url} className='rounded-box ImgFrame rounded-lg' alt='No se asignó una imagen' />
              </div>
            </SwiperSlide>
          ))
        ) : (
          <SwiperSlide>
            <div className='relative'>
              {editing && (
                <>
                  {/* Cuadrado blanco transparente */}
                  {/* Cuadrado blanco transparente */}
                  <div className='absolute top-0 left-20 w-40 h-full bg-white opacity-50 rounded-lg' />

                  {/* Icono de lápiz con input */}
                  <label htmlFor={`fileInput-${0}`} className='absolute top-2 left-24 cursor-pointer'>
                    <i className='fa fa-pencil text-neutral text-lg' />
                  </label>
                  <input
                    id='fileInput'
                    type='file'
                    className='hidden'
                    onChange={(e) => handlePhotoChange(e, 0)} // Define la función handlePhotoChange para manejar el cambio de la foto
                  />
                </>
              )}
              <img
                src='https://th.bing.com/th/id/R.804a91a7e6f6b953e7c288d092005e98?rik=QBiG3g39WKAGTA&pid=ImgRaw&r=0'
                className='rounded-box ImgFrame rounded-lg'
                alt='No se asignó una imagen'
              />
            </div>
          </SwiperSlide>
        )}
      </Swiper>
    )
  }

  return (
    <>

      {/* Checkbox para abrir/cerrar el menú lateral */}
      <input
        type='checkbox'
        id='SiderbarBTN'
        checked={isSidebarOpen}
        onChange={() => setSidebarOpen(!isSidebarOpen)}
      />

      {/* Contenedor principal del menú lateral */}
      <div className='container-menu absolute z-10 flex'>
        <div className='cont-menu md:w-[22em] text-center md:h-screen md:max-h-[90vh] text-neutral overflow-y-auto'>
          <nav className='nav-sidebar'>
            <div className={isLoadingData ? 'absolute bg-[#ffffff48] w-full h-screen z-20' : 'hidden'}>
              <div className='absolute top-1/2 left-1/2'>
                <LoadingGif />
              </div>
              <p className='pt-72'>Enviando datos...</p>
            </div>

            {/* Contenido a mostrar */}
            <section>
              {selectedMarkerData ? (
              // Si hay datos de marcador seleccionados
                <div className='flex flex-col gap-6 justify-center items-center p-4 md:pt-10'>
                  {isLoading ? (
                  // Mostrar "Cargando..." mientras se obtienen los datos
                    <div className='flex justify-center items-center pt-20 gap-4'>
                      <p>Cargando...</p>
                      <span className='loading loading-spinner loading-lg' />
                    </div>
                  ) : (
                  // Mostrar contenido de marcador seleccionado
                    <>
                      {/* Mostrar tipo y calificación del marcador */}
                      <div className='flex items-center gap-2 justify-center w-full md:hidden'>

                        {/* Icono de tipo de establecimiento */}
                        <BsFillBuildingFill />

                        {/* Mostrar el tipo del marcador */}
                        <h3>{selectedMarkerData.type}</h3>

                        {/* Mostrar estrellas de calificación */}
                        {score}
                        <i type='radio' name='rating-1' className='mask mask-star-2 bg-orange-400' />

                      </div>

                      {/* Mostrar imagenes del establecimiento */}
                      {SwiperImg()}

                      {/* Mostrar nombre del establecimiento */}
                      {editing ? (
                        <input
                          className='text-xl font-bold bg-transparent rounded-lg focus:border-secondary focus:outline-none'
                          placeholder={selectedMarkerData.name}
                          value={editedData.name}
                          disabled={isLoadingData}
                          onChange={(e) => handleInputChange(e, 'name')}
                        />
                      ) : (
                        <h2 className='text-xl font-bold'>{selectedMarkerData.name}</h2>
                      )}

                      {/* Detalles del establecimiento */}
                      <div className='flex flex-col gap-3 items-center justify-center w-[75%] pt-2'>

                        {/* Número de teléfono */}
                        {editing ? (
                          <div>
                            <div className='flex items-center gap-2'>
                              <BsTelephoneFill />
                              <input
                                className='font-bold bg-transparent rounded-lg focus:border-secondary focus:outline-none'
                                placeholder={selectedMarkerData.phone_number}
                                value={editedData.phone_number}
                                disabled={isLoadingData}
                                onChange={(e) => handleInputChange(e, 'phone_number')}
                              />
                            </div>
                            {phoneNumberError && (
                              <div className='text-red-500 mt-2'>El número de teléfono debe tener exactamente 10 dígitos.</div>
                            )}
                          </div>

                        ) : (
                          <div className='flex items-center gap-2 justify-start w-full'>
                            <BsTelephoneFill />
                            <h2>{selectedMarkerData.phone_number}</h2>
                          </div>
                        )}

                        {/* Horario de apertura */}
                        {editing ? (
                          <div className='flex items-center gap-2'>
                            <BsFillClockFill />
                            <input
                              className='font-bold bg-transparent rounded-lg focus:border-secondary focus:outline-none'
                              placeholder={selectedMarkerData.schedule}
                              value={editedData.schedule}
                              disabled={isLoadingData}
                              onChange={(e) => handleInputChange(e, 'schedule')}
                            />
                          </div>

                        ) : (
                          <div className='flex items-center gap-2 justify-start w-full'>
                            <BsFillClockFill />
                            <h2>{selectedMarkerData.schedule}</h2>
                          </div>
                        )}

                        {/* Horario de apertura */}
                        <div className='hidden md:flex items-center gap-2 justify-start w-full'>
                          <BsFillBuildingFill />
                          <h3>{selectedMarkerData.type} -</h3>

                          {/* Mostrar estrellas de calificación */}
                          {score}
                          <i type='radio' name='rating-1' className='mask mask-star-2 bg-orange-400' />

                        </div>
                        <div className='max-w-md mx-auto mt-4'>
                          <p className='text-lg mb-2'>Envía tu review</p>
                          <Rating
                            name='half-rating'
                            defaultValue={0}
                            precision={0.5}
                            value={parseFloat(value)}
                            onChange={handleSeleccion}
                          />
                        </div>

                        {/* Mostrar estrellas de calificación */}
                        {editing ? (
                          <div className='flex flex-col w-[225px] h-30 justify-center items-center gap-2 border-2 border-gray-600 rounded-lg p-4 mb-4'>
                            <h2 className='font-bold'>Dirección</h2>
                            <input
                              className='font-bold bg-transparent px-2 rounded-lg focus:border-secondary focus:outline-none'
                              placeholder={selectedMarkerData.address}
                              value={editedData.address}
                              disabled={isLoadingData}
                              onChange={(e) => handleInputChange(e, 'address')}
                            />
                          </div>

                        ) : (
                          <div className='flex flex-col w-[225px] h-30 justify-center items-center gap-2 border-2 border-gray-600 rounded-lg p-4 mb-4'>
                            <h2 className='font-bold'>Dirección</h2>
                            <p className='max-w-fit'>{selectedMarkerData.address}</p>
                          </div>
                        )}
                        {selectedMarkerData.owner === localuser.user_id ? (
                          <div className='flex gap-2 '>
                            <div className='w-[225px] justify-center items-center gap-2 border-2 border-gray-600 rounded-lg'>
                              <button
                                className='flex items-center gap-6 justify-start w-full p-2 rounded-lg hover:bg-gray-300'
                                onClick={handleEditMode}
                              >
                                <i className='fa fa-pencil' aria-hidden='true' />
                                {editing ? (
                                  <p className='max-w-fit'>Dejar de editar</p>
                                ) : (
                                  <p className='max-w-fit'>Editar publicacion</p>
                                )}

                              </button>
                            </div>
                            {editing ? (
                              <button
                                className='border-2 border-gray-600 rounded-lg p-2 hover:bg-gray-300'
                                onClick={handleSendEditData}
                              >
                                Guardar
                              </button>
                            ) : null}
                          </div>
                        ) : null}

                      </div>
                    </>
                  )}
                </div>
              ) : (

              // Si no hay datos de marcador seleccionados
                <div className='IfMarkerNull flex justify-center items-center pt-20'>
                  <BsFillCaretLeftFill />
                  <p>Seleccione un marcador</p>
                  <BsFillCaretRightFill />
                </div>
              )}
            </section>
          </nav>
        </div>
      </div>
    </>
  )
}

export default Sidemenu
