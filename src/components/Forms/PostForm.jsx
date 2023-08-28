import React from 'react'
import { Formik, Form, Field } from 'formik'
import axios from 'axios'

const PostForm = () => {
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
      const response = await axios.post('http://localhost:8080/api/post/create', formData, {
        headers: {
          'x-access-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzIsImlhdCI6MTY5MjQyNDcxMH0.Xqle7Q4O89ylqMMgFnO3xe9ZQkposPJVBBGvcZT3PZk'
        }
      })
      console.log(response.data)
    } catch (error) {
      console.error(error)
    }

    setSubmitting(false)
  }

  return (
    <div className='w-full p-10'>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, setFieldValue }) => (
          <Form>
            <Field
              type='text'
              name='text'
              placeholder='Texto'
            />
            <Field
              as='select'
              name='category'
            >
              <option value=''>Selecciona una categoría</option>
              <option value='post'>Post</option>
              <option value='event'>Event</option>
              <option value='job'>Job</option>
            </Field>
            <input
              type='file'
              name='image'
              onChange={(event) => {
                setFieldValue('image', event.currentTarget.files[0])
              }}
            />
            <button
              type='submit'
              disabled={isSubmitting}
            >
              Post
            </button>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default PostForm
