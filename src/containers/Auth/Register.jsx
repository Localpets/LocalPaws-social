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
        toast.error('El correo ya está en uso.')
      }
    }
  })

  return (
    <section className='bg-white h-screen overflow-hidden'>
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
            errors.last_name = 'Esto es un campo requerido'
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
            await axios.post('http://localhost:8080/api/auth/register', values)
            setSuccess(true)

            setTimeout(() => {
              window.location.href = '/login'
            }, 2000)
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
              className='relative block h-16 lg:order-last lg:col-span-5 lg:h-[100vh] xl:col-span-6'
            >
              <img
                alt='Pattern'
                src={cover}
                className='absolute inset-0 h-[100vh] w-full object-cover brightness-75'
              />
            </aside>

            <main
              className='flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-10 xl:col-span-6'
            >
              <div className='max-w-xl lg:max-w-3xl'>
                <a className='block text-blue-600' href='/'>
                  <span className='sr-only'>Inicio</span>
                  <svg
                    className='h-8 sm:h-10'
                    viewBox='0 0 28 24'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M0.41 10.3847C1.14777 7.4194 2.85643 4.7861 5.2639 2.90424C7.6714 1.02234 10.6393 0 13.695 0C16.7507 0 19.7186 1.02234 22.1261 2.90424C24.5336 4.7861 26.2422 7.4194 26.98 10.3847H25.78C23.7557 10.3549 21.7729 10.9599 20.11 12.1147C20.014 12.1842 19.9138 12.2477 19.81 12.3047H19.67C19.5662 12.2477 19.466 12.1842 19.37 12.1147C17.6924 10.9866 15.7166 10.3841 13.695 10.3841C11.6734 10.3841 9.6976 10.9866 8.02 12.1147C7.924 12.1842 7.8238 12.2477 7.72 12.3047H7.58C7.4762 12.2477 7.376 12.1842 7.28 12.1147C5.6171 10.9599 3.6343 10.3549 1.61 10.3847H0.41ZM23.62 16.6547C24.236 16.175 24.9995 15.924 25.78 15.9447H27.39V12.7347H25.78C24.4052 12.7181 23.0619 13.146 21.95 13.9547C21.3243 14.416 20.5674 14.6649 19.79 14.6649C19.0126 14.6649 18.2557 14.416 17.63 13.9547C16.4899 13.1611 15.1341 12.7356 13.745 12.7356C12.3559 12.7356 11.0001 13.1611 9.86 13.9547C9.2343 14.416 8.4774 14.6649 7.7 14.6649C6.9226 14.6649 6.1657 14.416 5.54 13.9547C4.4144 13.1356 3.0518 12.7072 1.66 12.7347H0V15.9447H1.61C2.39051 15.924 3.154 16.175 3.77 16.6547C4.908 17.4489 6.2623 17.8747 7.65 17.8747C9.0377 17.8747 10.392 17.4489 11.53 16.6547C12.1468 16.1765 12.9097 15.9257 13.69 15.9447C14.4708 15.9223 15.2348 16.1735 15.85 16.6547C16.9901 17.4484 18.3459 17.8738 19.735 17.8738C21.1241 17.8738 22.4799 17.4484 23.62 16.6547ZM23.62 22.3947C24.236 21.915 24.9995 21.664 25.78 21.6847H27.39V18.4747H25.78C24.4052 18.4581 23.0619 18.886 21.95 19.6947C21.3243 20.156 20.5674 20.4049 19.79 20.4049C19.0126 20.4049 18.2557 20.156 17.63 19.6947C16.4899 18.9011 15.1341 18.4757 13.745 18.4757C12.3559 18.4757 11.0001 18.9011 9.86 19.6947C9.2343 20.156 8.4774 20.4049 7.7 20.4049C6.9226 20.4049 6.1657 20.156 5.54 19.6947C4.4144 18.8757 3.0518 18.4472 1.66 18.4747H0V21.6847H1.61C2.39051 21.664 3.154 21.915 3.77 22.3947C4.908 23.1889 6.2623 23.6147 7.65 23.6147C9.0377 23.6147 10.392 23.1889 11.53 22.3947C12.1468 21.9165 12.9097 21.6657 13.69 21.6847C14.4708 21.6623 15.2348 21.9135 15.85 22.3947C16.9901 23.1884 18.3459 23.6138 19.735 23.6138C21.1241 23.6138 22.4799 23.1884 23.62 22.3947Z'
                      fill='currentColor'
                    />
                  </svg>
                </a>

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
                      htmlFor='FirstName'
                      className='block text-sm font-medium text-gray-700'
                    >
                      Usuario
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
                      <Link to='/login' className='ml-2 text-gray-700 underline'>Inicia sesión</Link>.
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
