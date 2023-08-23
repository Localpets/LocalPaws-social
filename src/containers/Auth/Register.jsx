import { useState, useEffect } from 'react'
import { Formik, Field } from 'formik'
import { Link } from '@tanstack/router'
import toast, { Toaster } from 'react-hot-toast'
import axios from 'axios'
// images
import cover from './assets/pexels-sam-lion-6001183.jpg'
// import google from './assets/google.png'

const Register = () => {
  const [error, setError] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (success) {
      toast.success('Te haz registrado correctamente! Redirigiendo a la página de inicio de sesión...')
    }

    if (error) {
      if (error.response.status === 400) {
        toast.error('El correo que proporcionaste ya está en uso.')
      } else if (error.response.status === 405) {
        toast.error('El usuario ya existe.')
      } else if (error.response.status === 500) {
        toast.error('Ha ocurrido un error, intentalo más tarde.')
      }
    }
  }, [success, error])

  return (
    <section className='bg-white min-h-screen'>
      <Formik
        initialValues={{ first_name: '', last_name: '', username: '', email: '', password: '', marketing_accept: false, phone_number: '', gender: '', type: 'USER' }}
        validate={values => {
          // Validations
          const errors = {}

          // first and last name
          if (!values.first_name) {
            errors.first_name = 'Esto es un campo requerido'
          }

          if (!values.last_name) {
            errors.last_name = 'Esto es un campo requerido'
          }
          // username
          if (!values.username) {
            errors.username = 'Esto es un campo requerido'
          } else if (
            !/^[a-zA-Z0-9_]{0,15}$/i.test(values.username)
          ) {
            errors.username = 'El nombre de usuario no puede contener espacios, caracteres especiales y/o tener más de 15 caracteres.'
          }

          // phone number

          if (!values.phone_number) {
            errors.phone_number = 'Esto es un campo requerido'
          } else if (
            !/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/i.test(values.phone_number)
          ) {
            errors.phone_number = 'El número de teléfono debe tener 10 dígitos y/o ser un número válido.'
          }

          // email
          if (!values.email) {
            errors.email = 'Esto es un campo requerido'
          } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
          ) {
            errors.email = 'Esto no es un email válido'
          }

          // password
          if (!values.password) {
            errors.password = 'Esto es un campo requerido'
          } else if (
            !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,25}$/i.test(values.password)
          ) {
            errors.password = 'La contraseña debe llevar al menos 8 caracteres, una mayúscula, una minúscula, un número y un caracter especial'
          }

          return errors
        }}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            const res = await axios.post('http://localhost:8080/api/auth/register', values)

            if (res.status === 201) {
              setSuccess(true)
              setTimeout(() => {
                window.location.href = '/'
              }, 2000)
            }
          } catch (err) {
            setError(err)
          }

          setTimeout(() => {
            setSubmitting(false)
          }, 400)
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting
        }) => (
          <div className='lg:grid lg:min-h-[90vh] lg:grid-cols-12'>
            <aside
              className='hidden relative lg:block h-16 lg:order-last lg:col-span-5 lg:h-[100vh] xl:col-span-6'
            >
              <img
                alt='Pattern'
                src={cover}
                className='absolute inset-0 h-[100vh] w-full object-cover brightness-75'
              />
            </aside>

            <main
              className='flex items-center justify-center px-8 pt-8 pb-2 sm:px-12 lg:col-span-7 lg:px-16 lg:pt-10 ;lg:pb-2 xl:col-span-6'
            >
              <div className='max-w-xl lg:max-w-3xl'>
                <h1
                  className='mt-6 text-2xl font-bold text-gray-900 sm:text-2xl md:text-4xl'
                >
                  Bienvenido a PawsPlorer 🐾
                </h1>
                <form action='POST' onSubmit={handleSubmit} className='mt-8 grid grid-cols-6 gap-6'>
                  <div className='col-span-6 sm:col-span-3'>
                    <label
                      htmlFor='FirstName'
                      className='block text-sm font-medium text-gray-700'
                    >
                      Nombre
                    </label>

                    <input
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.first_name}
                      type='text'
                      id='FirstName'
                      name='first_name'
                      className='mt-1 focus:ring-blue-600 focus:border-blue-600 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                    />
                    <h2 className='text-red-500 text-sm font-semibold'>{errors.first_name && touched.first_name && errors.first_name}</h2>
                  </div>

                  <div className='col-span-6 sm:col-span-3'>
                    <label
                      htmlFor='LastName'
                      className='block text-sm font-medium text-gray-700'
                    >
                      Apellido
                    </label>

                    <input
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.last_name}
                      type='text'
                      id='LastName'
                      name='last_name'
                      className='mt-1 focus:ring-blue-600 focus:border-blue-600 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                    />
                    <h2 className='text-red-500 text-sm font-semibold'>{errors.last_name && touched.last_name && errors.last_name}</h2>
                  </div>

                  <div className='col-span-6 sm:col-span-3'>
                    <label
                      htmlFor='username'
                      className='block text-sm font-medium text-gray-700'
                    >
                      Usuario
                    </label>

                    <input
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.username}
                      type='text'
                      id='username'
                      name='username'
                      className='mt-1 focus:ring-blue-600 focus:border-blue-600 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                    />
                    <h2 className='text-red-500 text-sm font-semibold'>{errors.username && touched.username && errors.username}</h2>
                  </div>

                  <div className='col-span-6 sm:col-span-3'>
                    <label
                      htmlFor='phone_number'
                      className='block text-sm font-medium text-gray-700'
                    >
                      Teléfono
                    </label>

                    <input
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.phone_number}
                      type='text'
                      id='Phone'
                      name='phone_number'
                      className='mt-1 focus:ring-blue-600 focus:border-blue-600 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                    />
                    <h2 className='text-red-500 text-sm font-semibold'>{errors.phone_number && touched.phone_number && errors.phone_number}</h2>
                  </div>

                  <div className='col-span-6 sm:col-span-6'>
                    <label
                      htmlFor='gender'
                      className='block text-sm font-medium text-gray-700'
                    >
                      Género
                    </label>

                    <select
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.gender}
                      id='Gender'
                      name='gender'
                      className='mt-1 focus:ring-blue-600 focus:border-blue-600 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                    >
                      <option value='null'>
                        Selecciona una opción
                      </option>
                      <option value='Masculino'>
                        Masculino
                      </option>
                      <option value='Femenino'>
                        Femenino
                      </option>
                      <option value='No binario'>
                        No binario
                      </option>
                      <option value='Otro'>
                        Otro
                      </option>
                    </select>
                    <h2 className='text-red-500 text-sm font-semibold'>{errors.gender && touched.gender && errors.gender}</h2>
                  </div>

                  <div className='col-span-6'>
                    <label htmlFor='Email' className='block text-sm font-medium text-gray-700'>
                      Email
                    </label>

                    <input
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.email}
                      type='email'
                      id='Email'
                      name='email'
                      className='mt-1 focus:ring-blue-600 focus:border-blue-600 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                    />
                    <h2 className='text-red-500 text-sm font-semibold'>{errors.email && touched.email && errors.email}</h2>
                  </div>

                  <div className='col-span-6'>
                    <label
                      htmlFor='Password'
                      className='block text-sm font-medium text-gray-700'
                    >
                      Contraseña
                    </label>

                    <input
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.password}
                      type='password'
                      id='Password'
                      name='password'
                      className='mt-1 focus:ring-blue-600 focus:border-blue-600 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                    />
                    <h2 className='text-red-500 text-sm font-semibold'>{errors.password && touched.password && errors.password}</h2>
                  </div>

                  <div className='col-span-6 justify-start'>
                    <label htmlFor='MarketingAccept' className='flex gap-4'>
                      <Field
                        type='checkbox'
                        id='MarketingAccept'
                        name='marketing_accept'
                        className='h-5 w-5 rounded-md border-gray-200 bg-white shadow-sm'
                      />
                      <span className='text-sm text-gray-700'>
                        Quiero recibir mails acerca de eventos, cambios a la app y actualizaciones en el futuro.
                      </span>
                    </label>
                  </div>

                  <div className='col-span-6'>
                    <p className='text-sm text-gray-500'>
                      Creando la cuenta aceptas nuestros,
                      <a href='#' className='ml-2 mr-2 text-gray-700 underline'>
                        términos y condiciones
                      </a>
                      y
                      <a href='#' className='ml-2 text-gray-700 underline'>política de privacidad</a>.
                    </p>
                  </div>

                  <div className='col-span-8 justify-center sm:flex sm:items-center sm:gap-4'>
                    <button
                      className='inline-block shrink-0 rounded-md border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500' disabled={isSubmitting} type='submit'
                    >
                      Crear cuenta
                    </button>

                    <p className='mt-4 text-sm text-gray-500 sm:mt-0'>
                      Ya tienes una?
                      <Link to='/' className='ml-2 text-gray-700 underline'>Inicia sesión</Link>.
                    </p>
                  </div>
                </form>
              </div>
            </main>
          </div>
        )}
      </Formik>
      <Toaster />
    </section>
  )
}

export default Register
