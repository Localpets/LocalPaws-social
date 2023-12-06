// src/components/adoption/AdoptionForm.js
import MapComponentAdoption from './MapComponentAdoption'
import PropTypes from 'prop-types'

const AdoptionForm = ({ setPreviewImage, formData, setFormData, setLocationCoords, schedule, setSchedule, setImageIfAdoption }) => {
  const handleFormDataChange = (e) => {
    // location_photos is an array of 3 images
    if (e.target.id === 'image1' || e.target.id === 'image2' || e.target.id === 'image3') {
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

  const handleScheduleChange = (day, value) => {
    setSchedule((prevSchedule) => ({
      ...prevSchedule,
      [day]: value
    }))
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
          <label htmlFor='category' className='text-gray-700 mb-2'>Horarios preferidos<span className='text-red-700'> *</span></label>
          <div className='flex flex-col gap-y-2 w-full items-start justify-center flex-wrap md:flex-row md:justify-normal md:gap-x-4'>
            {Object.keys(schedule).map((day) => (
              <div key={day} className='mb-4 flex flex-col gap-y-1'>
                <label htmlFor={day} className='text-gray-700 pr-4'>
                  {day}
                </label>
                <input
                  type='text'
                  id={day}
                  placeholder='Ejemplo: 09:00am - 11:00am / 1:00pm - 6:00pm'
                  value={schedule[day]}
                  pattern='^([0-1]?[0-9]|2[0-3]):[0-5][0-9](am|pm) - ([0-1]?[0-9]|2[0-3]):[0-5][0-9](am|pm)$'
                  onChange={(e) => handleScheduleChange(day, e.target.value)}
                  className='shadow-sm rounded-md p-2 border border-gray-300 focus:border-blue-500'
                />
              </div>
            ))}
          </div>
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
          <label htmlFor='map' className='text-gray-700 mb-2'>Ubicación en mapa<span className='text-red-700'>*</span></label>
          <MapComponentAdoption
            setLocationCoords={setLocationCoords}
          />
        </div>

        <div className='flex flex-col'>
          <label htmlFor='image1' className='text-gray-700 mb-2'>Imagen 1<span className='text-red-700'>*</span></label>
          <input
            type='file'
            id='image1'
            onChange={(e) => {
              handleFormDataChange(e)

              const file = e.target.files[0]
              const reader = new FileReader()
              reader.onloadend = () => {
                setPreviewImage(reader.result)
              }

              reader.readAsDataURL(file)

              setImageIfAdoption(file)
            }}
            required
            className='block w-full text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-md cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500'
          />
        </div>

        <div className='flex flex-col'>
          <label htmlFor='image2' className='text-gray-700 mb-2'>Imagen 2</label>
          <input
            type='file'
            id='image2'
            onChange={(e) => handleFormDataChange(e)}
            className='block w-full text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-md cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500'
          />
        </div>

        <div className='flex flex-col'>
          <label htmlFor='image3' className='text-gray-700 mb-2'>Imagen 3</label>
          <input
            type='file'
            id='image3'
            onChange={(e) => handleFormDataChange(e)}
            className='block w-full text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-md cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500'
          />
        </div>
      </div>

      <footer className='flex justify-end py-4'>
        <button
          type='submit' className='btn btn-primary w-40'
        >
          Enviar
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
  schedule: PropTypes.object.isRequired,
  setSchedule: PropTypes.func.isRequired,
  imageIfAdoption: PropTypes.string.isRequired,
  setImageIfAdoption: PropTypes.func.isRequired
}

export default AdoptionForm
