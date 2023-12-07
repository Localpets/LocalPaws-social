import { useState } from 'react'
import MapComponentAdoption from './MapComponentAdoption'
import PropTypes from 'prop-types'

const AdoptionForm = ({ setPreviewImage, formData, setFormData, setLocationCoords, setImageIfAdoption, loadingIfSendingAdoptionForm, setIsLoadingIfSendingAdoptionForm }) => {
  const [previewImages, setPreviewImages] = useState({})

  const handleFormDataChange = (e) => {
    // location_photos is an array of 3 images
    if (e.target.id === 'image1' || e.target.id === 'image2' || e.target.id === 'image3' || e.target.id === 'image4' || e.target.id === 'image5') {
      const imageIndex = e.target.id.substring(5)
      const newLocationPhotos = [...formData.location_photos]
      newLocationPhotos[imageIndex - 1] = e.target.files[0]
      setFormData({
        ...formData,
        location_photos: newLocationPhotos
      })
      console.log(formData)
    } else {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value
      })
      console.log(formData)
    }
  }

  return (
    <section className='rounded-md p-8 bg-white mx-auto w-full'>
      <header className='py-2'>
        <h2 className='text-xl font-bold text-gray-900'>
          Formulario de Adopción
        </h2>
        <p className='text-gray-500'>Por favor, complete el siguiente formulario para hacer un aviso de adopción.</p>
      </header>

      <div className='grid grid-cols-1 gap-4'>
        <div className='flex flex-col'>
          <label htmlFor='name' className='text-gray-700 mb-2'>Descripción de la mascota<span className='text-red-700'>*</span> </label>
          <input
            type='text'
            onChange={(e) => handleFormDataChange(e)}
            id='name'
            placeholder='Ingrese la descripción de la mascota'
            required
            className='shadow-sm rounded-md p-2 border border-gray-300 focus:border-blue-500'
          />
        </div>

        <div className='flex flex-col'>
          <label htmlFor='phone_number' className='text-gray-700 mb-2'>Número de Contacto<span className='text-red-700'>*</span></label>
          <input
            type='text'
            onChange={(e) => handleFormDataChange(e)}
            required
            id='phone_number'
            pattern='^3[0-9]{9}$'
            placeholder='Ingrese su número de teléfono' className='shadow-sm rounded-md p-2 border border-gray-300 focus:border-blue-500'
          />
        </div>

        <div className='flex flex-col'>
          <label htmlFor='address' className='text-gray-700 mb-2'>Dirección<span className='text-red-700'>*</span></label>
          <input
            type='text'
            onChange={(e) => handleFormDataChange(e)}
            required
            id='address'
            placeholder='Ingrese la dirección dónde se encuentra la mascota' className='shadow-sm rounded-md p-2 border border-gray-300 focus:border-blue-500'
          />
        </div>

        <div className='flex flex-col'>
          <label htmlFor='map' className='text-gray-700'>Ubicación en mapa<span className='text-red-700'>*</span></label>
          <MapComponentAdoption
            setLocationCoords={setLocationCoords}
          />
        </div>

        <div className='flex flex-col md:flex-row gap-x-2 gap-y-2 flex-wrap'>
          <div className='flex flex-col items-center'>
            <label htmlFor='image1' className='text-gray-700 mb-2 badge cursor-pointer rounded-sm p-4'>Imagen 1<span className='text-red-700'>*</span></label>
            <input
              type='file'
              id='image1'
              onChange={(e) => {
                // File in the form data
                handleFormDataChange(e)
                const file = e.target.files[0]
                const reader = new FileReader()
                reader.onloadend = () => {
                  // Set preview image for the post
                  setPreviewImage(reader.result)
                }
                reader.readAsDataURL(file)
                // Set preview image for the post in the form to serv
                setImageIfAdoption(file)
                // Set preview image for the adoption form
                setPreviewImages([URL.createObjectURL(file)])
              }}
              required
              className='w-full text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-md cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500 hidden'
            />
            <img
              src={
              previewImages[0] || 'https://cp.cuyahogacounty.us/Images/Placeholder-Image-Square.png'
              }
              className='w-40 h-40 object-cover'
              alt='preview-1'
            />
          </div>

          <div className={
            previewImages[0] ? 'flex flex-col items-center' : 'hidden'
          }
          >
            <label htmlFor='image2' className='text-gray-700 mb-2 badge cursor-pointer rounded-sm p-4'>Imagen 2<span className='text-red-700'>*</span></label>
            <input
              type='file'
              id='image2'
              onChange={(e) => {
                handleFormDataChange(e)
                setPreviewImages([...previewImages, URL.createObjectURL(e.target.files[0])])
              }}
              className='w-full text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-md cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500 hidden'
            />
            <img
              src={
                previewImages[1] || 'https://cp.cuyahogacounty.us/Images/Placeholder-Image-Square.png'
              }
              className='w-40 h-40 object-cover'
              alt='preview-2'
            />
          </div>

          <div className={
            previewImages[1] ? 'flex flex-col items-center' : 'hidden'
          }
          >
            <label htmlFor='image3' className='text-gray-700 mb-2 badge cursor-pointer rounded-sm p-4'>Imagen 3<span className='text-red-700'>*</span></label>
            <input
              type='file'
              id='image3'
              onChange={(e) => {
                handleFormDataChange(e)
                setPreviewImages([...previewImages, URL.createObjectURL(e.target.files[0])])
              }}
              className='w-full text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-md cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500 hidden'
            />
            <img
              src={
                previewImages[2] || 'https://cp.cuyahogacounty.us/Images/Placeholder-Image-Square.png'
              }
              className='w-40 h-40 object-cover'
              alt='preview-3'
            />
          </div>

          <div className={
            previewImages[2] ? 'flex flex-col items-center' : 'hidden'
          }
          >
            <label htmlFor='image4' className='text-gray-700 mb-2 badge cursor-pointer rounded-sm p-4'>Imagen 4<span className='text-red-700'>*</span></label>
            <input
              type='file'
              id='image4'
              onChange={(e) => {
                handleFormDataChange(e)
                if (previewImages.length < 4) {
                  setPreviewImages([...previewImages, URL.createObjectURL(e.target.files[0])])
                }
              }}
              className='w-full text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-md cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500 hidden'
            />
            <img
              src={
                previewImages[3] || 'https://cp.cuyahogacounty.us/Images/Placeholder-Image-Square.png'
              }
              className='w-40 h-40 object-cover'
              alt='preview-4'
            />
          </div>

          <div className={
            previewImages[3] ? 'flex flex-col items-center' : 'hidden'
          }
          >
            <label htmlFor='image5' className='text-gray-700 mb-2 badge cursor-pointer rounded-sm p-4'>Imagen 5<span className='text-red-700'>*</span></label>
            <input
              type='file'
              id='image5'
              onChange={(e) => {
                handleFormDataChange(e)
                if (previewImages.length < 5) {
                  setPreviewImages([...previewImages, URL.createObjectURL(e.target.files[0])])
                }
              }}
              className='w-full text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-md cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500 hidden'
            />
            <img
              src={
                previewImages[4] || 'https://cp.cuyahogacounty.us/Images/Placeholder-Image-Square.png'
              }
              className='w-40 h-40 object-cover'
              alt='preview-5'
            />
          </div>
        </div>
      </div>

      <footer className='flex justify-end py-4'>
        <button
          type='submit' className='btn btn-primary w-40'
          onClick={() => {
            setIsLoadingIfSendingAdoptionForm(true)
          }}
          disabled={loadingIfSendingAdoptionForm}
        >
          {
            loadingIfSendingAdoptionForm
              ? (
                <div className='flex justify-center items-center'>
                  <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white' />
                </div>
                )
              : 'Enviar'
          }
        </button>
      </footer>
    </section>

  )
}

AdoptionForm.propTypes = {
  setPreviewImage: PropTypes.func.isRequired,
  setSelectedCategory: PropTypes.func.isRequired,
  setFormData: PropTypes.func.isRequired,
  setLocationCoords: PropTypes.func.isRequired,
  formData: PropTypes.object.isRequired,
  loadingIfSendingAdoptionForm: PropTypes.bool.isRequired,
  setIsLoadingIfSendingAdoptionForm: PropTypes.func.isRequired,
  imageIfAdoption: PropTypes.string.isRequired,
  setImageIfAdoption: PropTypes.func.isRequired
}

export default AdoptionForm
