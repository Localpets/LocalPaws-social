import { makeRequest } from '../../../../../library/Axios'

export async function handleCreateGroups (Groupname, selectedImage, selectedContacts, setSelectedContacts, setSelectedImage, setGroupName, setCreateGroups, localuser, socket) {
  // Crear un objeto FormData para enviar el mensaje y la imagen
  console.log(selectedContacts)
  const formData = new FormData()
  formData.append('name', Groupname)

  // Agregar la imagen si está presente
  if (selectedImage) {
    formData.append('image', selectedImage)
  }

  try {
    const res = await makeRequest.post('message/group/create', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    setCreateGroups()

    if (res.status === 200) {
      await makeRequest.post('message/group/add-participant', {
        groupId: res.data.group.id,
        userId: localuser.user_id,
        rol: 'admin'
      })
      for (let index = 0; index < selectedContacts.length; index++) {
        const element = selectedContacts[index]
        console.log('elemet', element)
        await makeRequest.post('message/group/add-participant', {
          groupId: res.data.group.id,
          userId: element,
          rol: 'member'
        })
      }
      const emptySet = new Set()
      socket.emit('updateGroups', localuser.user_id)
      setSelectedContacts(emptySet)
      setGroupName('')
      setSelectedImage(null)
    }
  } catch (err) {
    console.error(err)
  }
}
