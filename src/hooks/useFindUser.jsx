import React from 'react'
import { makeRequest } from '../library/axios'
import useAuthStore from '../context/AuthContext'

export default function useFindUser (userId) {
  const { login } = useAuthStore()

  const [user, setUser] = React.useState(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState(null)

  React.useEffect(() => {
    if (userId) {
      makeRequest.get(`/user/find/id/${userId}`)
        .then((res) => {
          setUser(res.data.user)
          setLoading(false)
        })
        .catch((err) => {
          setError(err)
          setLoading(false)
        })
    } else if (!userId) {
      const res = JSON.parse(localStorage.getItem('user'))
      const id = res?.userId
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
    }
  }, [userId, login])

  return {
    user,
    loading,
    error
  }
}
