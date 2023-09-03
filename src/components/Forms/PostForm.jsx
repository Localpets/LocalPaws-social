import React from 'react'
import { Formik, Form, Field } from 'formik'
import { makeRequest } from '../../library/axios'

const PostForm = () => {
  const [user, setUser] = React.useState({})
  const [isTyping, setIsTyping] = React.useState(false)
  const [previewImage, setPreviewImage] = React.useState('')

  React.useEffect(() => {
    if (!localStorage.getItem('user')) {
      window.alert('No se ha iniciado sesión. Redireccionando...')
      window.location.href = '/'
    } else {
      const user = JSON.parse(localStorage.getItem('user'))
      setUser(user)
    }
  }, [])

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

  const handleSubmit = async (values, { setSubmitting }) => {
    const formData = new FormData()
    const user = JSON.parse(localStorage.getItem('user'))
    const id = user.userId
    formData.append('text', values.text)
    formData.append('category', values.category)
    formData.append('image', values.image)
    formData.append('post_user_id', id)

    try {
      const response = await makeRequest.post('post/create', formData)
      setInitialPostValues(values)
      console.log(response.data)
      if (response.data.status === 'success') {
        window.location.reload()
      }
    } catch (error) {
      console.error(error)
    }

    setSubmitting(false)
  }

  return (
    <div className='w-full p-10 bg-white m-2 rounded-lg border-2 border-[#E0E1DD]'>
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
            <img src={user.profilePicture} alt='user-thumbnail' className='w-16 h-14 mt-0 rounded-full self-start' />
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
                    className='rounded-xl border-2 border-[#E0E1DD] text-black resize-none'
                  />
                  <h2 className='text-red-500 text-sm font-semibold'>{errors.text && touched.text && errors.text}</h2>
                </div>
                <button
                  type='submit'
                  disabled={isSubmitting}
                  className='btn btn-primary h-8 max-w-xs self-start'
                >
                  <i className='fa-solid fa-paper-plane' />
                </button>
              </div>

              <div className={previewImage ? 'flex justify-center w-[90%] px-4 ml-2 mr-2 py-4' : 'hidden'}>
                <img
                  src={previewImage}
                  alt='preview'
                  className={previewImage ? 'w-80 max-h-72 rounded-lg border-2 border-[#E0E1DD] object-cover' : 'hidden'}
                />
                <button className={previewImage ? 'relative right-[10%] self-start mt-3' : 'hidden'} type='button' onClick={handleDeleteImage}>
                  <i className='fa-solid fa-trash text-purple-600 text-lg' />
                </button>
              </div>

              <div className='divider my-0 py-2 ml-4 mr-4' />

              <div className='flex justify-between items-center w-full px-2 mr-2'>
                <div className='w-24 h-9'>
                  <label htmlFor='image' className='badge rounded-lg cursor-pointer flex gap-2 h-full mx-auto bg-primary text-white border-primary ml-2'>
                    <i className='fa-solid fa-image' />
                    <h3>Imagen</h3>
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
                <div className='flex flex-col w-[50%] h-10 px-2 gap-2'>
                  <Field
                    as='select'
                    name='category'
                    onBlur={handleBlur}
                    value={values.category}
                    className='rounded-lg border-2 border-[#E0E1DD] text-black'
                  >
                    <option value='' className='text-ellipsis'>Categoría</option>
                    <option value='post'>Post</option>
                    <option value='event'>Event</option>
                    <option value='job'>Job</option>
                  </Field>
                  <h2 className='text-red-500 text-sm font-semibold'>{errors.category && touched.category && errors.category}</h2>
                </div>
              </div>
            </Form>
          </section>
        )}
      </Formik>
    </div>
  )
}

export default PostForm
