import React from 'react'
import { makeRequest } from '../library/axios'
import useAuthStore from '../context/AuthContext'
// import Cookies from 'js-cookie'
import jwtDecode from 'jwt-decode'

// Constantes de entorno
// TODO: Cambiar por variables de entorno
// const jwtCookie = Cookies.get('access_token') // Reemplaza 'nombre_de_tu_cookie' con el nombre real de tu cookie
const secretKey = 'localpaws_api_key'

export default function useFindUser (userId) {
  const { login } = useAuthStore()

  const [user, setUser] = React.useState(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState(null)

  React.useEffect(() => {
    const getCookie = () => {
      try {
        const formLS = JSON.parse(window.localStorage.getItem('user'))
        // console.log(formLS, 'formLS')
        const decoded = jwtDecode(formLS.userId, secretKey)

        // El JWT es válido y se ha descifrado correctamente
        // Puedes acceder al ID de usuario desde el objeto decodificado
        const userId = decoded.id
        // console.log(userId, 'userId')
        // Realiza cualquier acción que necesites con el ID de usuario (por ejemplo, mostrar contenido autenticado)
        return userId
      } catch (error) {
        // El JWT no es válido o ha expirado
        console.error('Error al verificar el JWT:', error)
        // Puedes redirigir al usuario a la página de inicio de sesión o mostrar un mensaje de error
      }
    }

    getCookie()

    const id = getCookie()

    if (id) {
      login(id, true)

      async function getUser () {
        await makeRequest.get(`/user/find/id/${id}`)
          .then(res => {
            setUser(res.data.user)
            setLoading(false)
          })
          .catch(err => {
            setError(err)
            setLoading(false)
          })
      }

      getUser()
    } else {
      setLoading(false)
      window.location.href = '/'
    }
  }, [userId, login])

  return {
    user,
    loading,
    error
  }
}
