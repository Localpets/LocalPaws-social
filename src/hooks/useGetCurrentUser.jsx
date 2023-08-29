import { useEffect, useState } from 'react'

const useGetCurrentUser = () => {
  const [user, setUser] = useState || []

  useEffect(() => {
    if (localStorage.getItem('user')) {
      const user = JSON.parse(localStorage.getItem('user'))
      setUser(user)
    }
  }, [user, setUser])

  return { user }
}

export default useGetCurrentUser
