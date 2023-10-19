import { makeRequest } from '../../../library/Axios'

export async function getContacts (setContacts, setLoadingcontacts, localuser) {
  if (localuser) {
    try {
      const response = await makeRequest.get(`/follow/find/followed/${localuser.user_id}`)
      if (response.status === 200) {
        const contactsData = response.data.follows
        setContacts(contactsData)
        setLoadingcontacts(false)
      } else {
        console.log('no hay contactos')
      }
    } catch (error) {
      console.log('El error es: ', error)
    }
  }
}

getContacts()
