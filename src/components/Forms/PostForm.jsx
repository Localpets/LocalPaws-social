import { useEffect, useState } from 'react'
import { Formik, Form, Field } from 'formik'
import { makeRequest } from '../../library/Axios'
import { useQuery } from '@tanstack/react-query'
import AdoptionForm from './AdoptionForm'
import swal from 'sweetalert'
import useAuthStore from '../../context/AuthContext'
import useFindUser from '../../hooks/useFindUser'
import PropTypes from 'prop-types'

const PostForm = ({ addPost, setPosts, posts }) => {
  const { loggedUser } = useAuthStore()
  const { user } = useFindUser(loggedUser)

  const [loadingIfSendingAdoptionForm, setLoadingIfSendingAdoptionForm] = useState(false)
  const [locationCoords, setLocationCoords] = useState(null)
  const [formDataToSent, setFormDataToSent] = useState({
    name: '',
    lat: locationCoords ? locationCoords.split(',')[0] : '48.8566',
    lng: locationCoords ? locationCoords.split(',')[1] : '2.3522',
    address: '',
    type: 'Adoption',
    user_created_id: 0, // Coloca el ID del usuario correctamente
    location_photos: ['', '', '', '', ''],
    phone_number: '',
    schedule: 'Disponible'
  })
  const [imageError, setImageError] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const [imageIfAdoption, setImageIfAdoption] = useState('')
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('')

  useEffect(() => {
    if (imageError) {
      swal('Error', 'La imagen no puede pesar más de 5MB y los formatos permitidos son .jpg, .jpeg, .png', 'error')
      setImageError(false)
    }

    // if the file is not an image, reset the value and show an error
    if (previewImage) {
      const file = previewImage
      // Example of file string data:text/plain;base64,ODBZUnhhNHVwQUJkSnVIbmtjeXpIdw...
      const fileType = file.substring(5, file.indexOf(';'))
      if (fileType !== 'image/jpeg' && fileType !== 'image/png' && fileType !== 'image/jpg') {
        swal('Error', 'La imagen no puede pesar más de 5MB y los formatos permitidos son .jpg, .jpeg, .png', 'error')
        setPreviewImage('')
      }
    }
  }, [imageError, previewImage])

  const handleUserTyping = (e) => {
    if (e.target.value.length > 50) {
      setIsTyping(true)
    } else {
      setIsTyping(false)
    }
  }

  const handleImageThumbnail = (e) => {
    const file = e.target.files[0]
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreviewImage(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const handleDeleteImage = () => {
    setPreviewImage('')
  }

  const setInitialPostValues = (values) => {
    setPreviewImage('')
    values.text = ''
    values.category = ''
    values.image = null
  }

  const initialValues = {
    text: '',
    category: '',
    image: null
  }

  const handleSubmit = async (values, { setSubmitting }, formDataIfAdoption = formDataToSent, locationIfAdoption = locationCoords) => {
    if (selectedCategory === 'Adopciones') {
      console.log('location', locationIfAdoption)

      if (!locationIfAdoption) {
        swal('Error', 'Debes seleccionar una ubicación', 'error')
        return
      }

      const formDataToSentToServ = new FormData()

      formDataToSentToServ.append('name', formDataIfAdoption.name)
      formDataToSentToServ.append('lat', locationIfAdoption.split(',')[0])
      formDataToSentToServ.append('lng', locationIfAdoption.split(',')[1])
      formDataToSentToServ.append('address', formDataIfAdoption.address)
      formDataToSentToServ.append('type', formDataIfAdoption.type)
      formDataToSentToServ.append('user_created_id', user.user_id)
      formDataIfAdoption.location_photos.map((photo, i) => {
        console.log('image received:', {
          photo,
          i
        })
        return formDataToSentToServ.append('image', photo, i)
      })
      formDataToSentToServ.append('phone_number', formDataIfAdoption.phone_number)
      formDataToSentToServ.append('schedule', formDataIfAdoption.schedule)

      try {
        const res = await makeRequest.post('location/create', formDataToSentToServ)
        console.log(res)

        const formDataToPost = new FormData()
        formDataToPost.append('text', values.text)
        formDataToPost.append('category', values.category)
        formDataToPost.append('image', imageIfAdoption)
        formDataToPost.append('post_user_id', user.user_id)

        if (posts && setPosts) {
          const response = await makeRequest.post('post/create', formDataToPost)
          const newPost = {
            ...response.data.post,
            likes: 0,
            comments: 0
          }
          setInitialPostValues(values)
          setPosts([newPost, ...posts])
        } else {
          const response = await makeRequest.post('post/create', formDataToPost)
          setInitialPostValues(values)
          addPost(response.data.post)
        }

        return
      } catch (error) {
        console.log(error)
      } finally {
        setSubmitting(false)
        setSelectedCategory('')
        setLoadingIfSendingAdoptionForm(false)
      }
    }

    const formData = new FormData()
    formData.append('text', values.text)
    formData.append('category', values.category)
    if (values.category === '') return
    formData.append('image', values.image)
    formData.append('post_user_id', user.user_id)

    try {
      if (posts && setPosts) {
        const response = await makeRequest.post('post/create', formData)
        const newPost = {
          ...response.data.post,
          likes: 0,
          comments: 0
        }
        setInitialPostValues(values)
        setPosts([newPost, ...posts])
      } else {
        const response = await makeRequest.post('post/create', formData)
        setInitialPostValues(values)
        addPost(response.data.post)
      }
    } catch (error) {
      setImageError(true)
      console.log(error)
    } finally {
      setSubmitting(false)
      setSelectedCategory('')
    }
  }

  const { isLoading, error } = useQuery({
    queryKey: ['posts', user],
    queryFn: async () => {
      return await makeRequest.get('/post/category/find/all').then((res) => {
        setCategories(res.data.categories)
        return res.data
      })
    }
  })

  if (isLoading) {
    return (
      <div className='mx-auto pt-20'>
        <span className='loading loading-ring loading-lg' />
      </div>
    )
  }

  if (!user) return null

  if (error) return 'An error has occurred: ' + error.message

  return (
    <div className='w-full py-8 px-2 lg:p-10 bg-white m-2 rounded-lg border-2 border-[#E0E1DD]'>
      <Formik
        initialValues={initialValues}
        validate={values => {
          // Validations
          const errors = {}

          if (!values.text) {
            errors.text = 'No puedes enviar un post vacío'
          } else if (values.text.length > 500) {
            errors.text = 'El texto no puede exceder los 500 caracteres'
          }

          if (!values.category) {
            errors.category = 'Debes seleccionar una categoría'
          }

          return errors
        }}
        onDelete={setInitialPostValues}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, setFieldValue, errors, touched, handleBlur, values }) => (
          <section className='flex justify-center items-center'>
            <img src={user?.thumbnail || 'https://i.imgur.com/HeIi0wU.png'} alt='user-thumbnail' className='lg:block hidden w-16 h-14 mt-0 rounded-full self-start' />
            <Form className='flex flex-col justify-center items-start w-full'>
              <div className='flex items-center justify-center gap-2 px-4 w-full'>
                <div className='w-full px-2 flex flex-col'>
                  <Field
                    as='textarea'
                    rows={isTyping ? 3 : 1}
                    type='text'
                    name='text'
                    placeholder='En qué estás pensando?'
                    onBlur={handleBlur}
                    value={values.text}
                    maxLength={500}
                    onChange={(e) => {
                      handleUserTyping(e)
                      setFieldValue('text', e.target.value)
                    }}
                    className='rounded-xl border-2 border-[#E0E1DD] text-black resize-none h-20 md:h-auto'
                  />
                  <h2 className='text-red-500 text-sm font-semibold'>{errors.text && touched.text && errors.text}</h2>
                </div>
                <button
                  type='submit'
                  disabled={isSubmitting}
                  className={
                    selectedCategory === 'Adopciones'
                      ? 'hidden'
                      : 'btn btn-secondary h-8 max-w-xs self-start hover:opacity-75'
                  }
                >
                  <i className='fa-solid fa-paper-plane text-white' />
                </button>
              </div>

              <div className='pt-6' />

              <div className={previewImage ? 'flex justify-center w-[90%] px-4 ml-2 mr-2 py-4' : 'hidden'}>
                <img
                  src={previewImage}
                  alt='preview'
                  className={previewImage ? 'w-80 max-h-72 rounded-lg border-2 border-[#E0E1DD] object-cover' : 'hidden'}
                />
                <button className={previewImage ? 'relative right-[10%] self-start mt-3' : 'hidden'} type='button' onClick={handleDeleteImage}>
                  <i className='fa-solid fa-trash text-primary text-lg' />
                </button>
              </div>

              <div className='flex justify-between items-center w-full px-4 lg:px-2 lg:mr-2'>
                <div className='w-24 h-9'>
                  <label
                    htmlFor='image' className={
                    selectedCategory === 'Adopciones'
                      ? 'hidden'
                      : 'badge hover:opacity-75 rounded-lg cursor-pointer flex gap-2 h-full mx-auto border-secondary bg-secondary text-white lg:ml-2'
                  }
                  >
                    <i className='fa-solid fa-image text-white' />
                    <h3 className='text-white'>Imagen</h3>
                  </label>
                  <input
                    type='file'
                    name='image'
                    id='image'
                    onChange={(event) => {
                      setFieldValue('image', event.currentTarget.files[0])
                    }}
                    accept='image/*'
                    placeholder='Selecciona una imagen'
                    className='hidden'
                    onChangeCapture={(e) => {
                      handleImageThumbnail(e)
                    }}
                  />
                </div>
                <div className='flex flex-col w-[70%] lg:w-[50%] min-h-10 max-h-20 px-2 gap-2'>
                  <Field
                    as='select'
                    name='category'
                    placeholder='Categoria...'
                    onBlur={handleBlur}
                    value={values.category}
                    className='rounded-lg border-2 border-[#E0E1DD] text-black'
                    onChange={(e) => {
                      setSelectedCategory(e.target.value)
                      setFieldValue('category', e.target.value)
                      console.log('selected category', e.target.value)
                    }}
                  >
                    {
                      categories
                        ? categories.map((category) => (
                          <option key={category.category_type_id} value={category.title}>{category.title}</option>
                        ))
                        : null
                    }
                  </Field>
                  <h2 className='text-red-500 text-sm font-semibold'>{errors.category && touched.category && errors.category}</h2>
                </div>
              </div>

              {
                selectedCategory === 'Adopciones'
                  ? <AdoptionForm setPreviewImage={setPreviewImage} formData={formDataToSent} setFormData={setFormDataToSent} setLocationCoords={setLocationCoords} imageIfAdoption={imageIfAdoption} setImageIfAdoption={setImageIfAdoption} loadingIfSendingADoptionForm={loadingIfSendingAdoptionForm} setLoadingIfSendingADoptionForm={setLoadingIfSendingAdoptionForm} />
                  : null
              }
            </Form>
          </section>
        )}
      </Formik>
    </div>
  )
}

PostForm.propTypes = {
  addPost: PropTypes.func,
  setPosts: PropTypes.func,
  posts: PropTypes.array
}

export default PostForm
