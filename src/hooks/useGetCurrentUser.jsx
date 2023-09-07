import { useState } from 'react'
import { makeRequest } from '../library/axios'

const useGetCurrentUser = async (id) => {
  const [user, setUser] = useState || []

  const { data } = await makeRequest.get(`/user/find/id/${id}`)

  setUser(data.user)

  return user
}

export default useGetCurrentUser
