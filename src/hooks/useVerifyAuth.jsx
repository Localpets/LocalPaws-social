import { useState, useEffect } from 'react'
import useAuthStore from '../context/AuthContext'

const useVerifyAuth = () => {
  const { auth } = useAuthStore.getState()

  const [isAuth, setIsAuth] = useState(auth)

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'))

    if (user) {
      useAuthStore.setState({ auth: true, user })
      setIsAuth(true)
    } else {
      useAuthStore.setState({ auth: false, user: null })
      setIsAuth(false)
    }
  }
  , [])

  return isAuth
}

export default useVerifyAuth
