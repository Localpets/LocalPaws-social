import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import swal from 'sweetalert'
import propTypes from 'prop-types'

const Dropzone = ({ setImage }) => {
  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0]
    // handle image and pass it to the parent component to load it in the preview
    if (file.size > 5242880) {
      swal('Error', 'La imagen no puede pesar más de 5MB', 'error')
    } else if (file.type !== 'image/jpeg' && file.type !== 'image/png' && file.type !== 'image/jpg') {
      swal('Error', 'Los formatos permitidos son .jpg, .jpeg, .png', 'error')
    } else {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImage(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }, [setImage])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  return (
    <div
      {...getRootProps()}
      className={`dropzone ${isDragActive ? 'drag-active' : ''}`}
    >
      <input {...getInputProps()} />
      {isDragActive
        ? (
          <div
            className='flex flex-col items-center justify-center border mt-2 p-4 h-60'
          >
            Suelta la imagen aquí
          </div>
          )
        : (
          <>
            <div
              className='flex flex-col items-center justify-center border mt-2 p-4 h-60 cursor-pointer'
            >
              {/* Image icon */}
              <svg
                className='w-12 h-12 text-zinc-500'
                fill='none'
                height='24'
                stroke='currentColor'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                viewBox='0 0 24 24'
                width='24'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path d='M12 5v14M5 12h14' />
              </svg>
              {/* Text */}
              <p className='text-zinc-500'>Arrastra y suelta la imagen de reemplazo aquí</p>
            </div>
          </>
          )}
    </div>
  )
}

Dropzone.propTypes = {
  setImage: propTypes.func.isRequired
}

export default Dropzone
