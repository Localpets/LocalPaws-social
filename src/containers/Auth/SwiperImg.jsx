import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { Navigation, Pagination } from 'swiper/modules'
import PropTypes from 'prop-types'

const SwiperImg = ({
  uploadimages,
  uploadimagesPreview,
  setUploadimages,
  setUploadimagesPreview
}) => {
  const initialSlots = 3

  const handleImageChange = (e, index) => {
    const file = e.target.files[0]

    if (file) {
      if (file.size > 5000000 || !['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
        console.log('El archivo es muy grande')
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        const updatedUploadimages = [...uploadimages]
        const updatedUploadimagesPreview = [...uploadimagesPreview]

        updatedUploadimages[index] = file
        updatedUploadimagesPreview[index] = reader.result

        setUploadimages(updatedUploadimages)
        setUploadimagesPreview(updatedUploadimagesPreview)
      }

      reader.readAsDataURL(file)
    }
  }

  const deleteImage = (index) => {
    const updatedUploadimages = [...uploadimages]
    const updatedUploadimagesPreview = [...uploadimagesPreview]

    updatedUploadimages[index] = null
    updatedUploadimagesPreview[index] = null

    setUploadimages(updatedUploadimages)
    setUploadimagesPreview(updatedUploadimagesPreview)
  }

  const addImageSpace = () => {
    if (uploadimages.length < 5) {
      setUploadimages([...uploadimages, null])
      setUploadimagesPreview([...uploadimagesPreview, null])
    }
  }

  const deleteImageSpace = () => {
    if (uploadimages.length > 3) {
      const updatedUploadimages = [...uploadimages]
      const updatedUploadimagesPreview = [...uploadimagesPreview]

      updatedUploadimages.pop()
      updatedUploadimagesPreview.pop()

      setUploadimages(updatedUploadimages)
      setUploadimagesPreview(updatedUploadimagesPreview)
    }
  }

  while (uploadimages.length < initialSlots) {
    uploadimages.push(null)
  }

  return (
    <>
      <Swiper
        navigation
        pagination={{
          type: 'navigation'
        }}
        modules={[Navigation, Pagination]}
        className='mySwiper w-[20em]'
      >
        {uploadimages.map((image, index) => (
          <SwiperSlide key={index} className='flex justify-center'>
            {image
              ? (
                <div className='relative'>
                  <img
                    src={uploadimagesPreview[index] ? uploadimagesPreview[index] : 'https://chc.cl/wp-content/uploads/2017/11/RM6060K22.jpg'}
                    className='rounded-box ImgFrame rounded-lg'
                    alt={`Imagen ${index + 1}`}
                  />
                  <button onClick={() => deleteImage(index)} className='absolute top-[35%] left-[43%] text-[2rem] cursor-pointer'>
                    <i className='fa fa-trash' aria-hidden='true' />
                  </button>
                </div>
                )
              : (
                <div className='rounded-box ImgFrame rounded-lg'>
                  <label htmlFor={`imageInput-${index}`} className='cursor-pointer'>
                    <i className='fa fa-picture-o absolute top-[40%] left-[45%] text-[2rem]' aria-hidden='true' />
                  </label>
                  <input
                    type='file'
                    id={`imageInput-${index}`}
                    accept='image/jpeg, image/png, image/jpg'
                    onChange={(e) => handleImageChange(e, index)}
                    className='hidden'
                  />
                </div>
                )}
          </SwiperSlide>
        ))}
      </Swiper>
      <div className='flex gap-6 justify-center items-center'>
        {uploadimages.length - 1 && (
          <button onClick={addImageSpace} className='cursor-pointer'>
            <i className='fa fa-plus-circle' aria-hidden='true' />
          </button>
        )}

        {uploadimages.length - 1 && (
          <button onClick={deleteImageSpace} className='cursor-pointer'>
            <i className='fa fa-minus-circle' aria-hidden='true' />
          </button>
        )}
      </div>

    </>
  )
}

SwiperImg.propTypes = {
  uploadimages: PropTypes.array.isRequired,
  uploadimagesPreview: PropTypes.array.isRequired,
  setUploadimages: PropTypes.func.isRequired,
  setUploadimagesPreview: PropTypes.func.isRequired
}

export default SwiperImg
