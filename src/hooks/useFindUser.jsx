import { useEffect, useState } from 'react'
import { makeRequest } from '../library/axios'
import useAuthStore from '../context/AuthContext'
import jwtDecode from 'jwt-decode'

const secretKey = 'localpaws_api_key'

export default function useFindUser () {
  const { login } = useAuthStore()

  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const getCookie = () => {
      try {
        const formLS = JSON.parse(localStorage.getItem('user'))
        if (formLS) {
          const decoded = jwtDecode(formLS.userId, secretKey)
          const userId = decoded.id
          return userId
        }
      } catch (error) {
        console.error('Error al verificar el JWT:', error)
      }
      return null // Return null when no ID is found in localStorage
    }

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
      setUser(1)
      setError('No hay un usuario logueado')
    }
  }, [login])

  return {
    user,
    loading,
    error
  }
}
