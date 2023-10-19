import { makeRequest } from '../../../../../library/axios'

export async function handleAddParticipant (selectedContacts, setSelectedContacts, setAddUser, GroupId, socket, localuser) {
  try {
    console.log('selected', selectedContacts)
    const contactsArray = [...selectedContacts] // Convertir el Set en un array

    for (let index = 0; index < contactsArray.length; index++) {
      const element = contactsArray[index]
      await makeRequest.post('message/group/add-participant', {
        groupId: GroupId,
        userId: element,
        rol: 'member'
      })
    }

    socket.emit('updateMembers', localuser.user_id)
    const emptySet = new Set()
    setSelectedContacts(emptySet)
    setAddUser(false)
  } catch (error) {
    console.log(error)
  }
}
