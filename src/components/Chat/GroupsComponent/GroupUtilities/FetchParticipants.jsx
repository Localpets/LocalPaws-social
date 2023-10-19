import { makeRequest } from '../../../../library/axios'

export async function fetchParticipants (GroupId, setGroupParticipants) {
  try {
    const resGroup = await makeRequest.get(`message/group/get-participants/${GroupId}`)
    const groupParticipants = resGroup.data.participants

    const resUsers = await makeRequest.get('user/find/all')
    const allUsers = resUsers.data.users

    const groupParticipantInfo = []

    for (let i = 0; i < groupParticipants.length; i++) {
      const userId = parseInt(groupParticipants[i].userId) // Convertir a un número si es una cadena
      console.log('userId', userId)

      const user = allUsers.find((user) => user.user_id === userId)
      console.log('user', user)

      if (user) {
        user.rol = groupParticipants[i].rol // Establecer directamente el valor de 'rol' en el objeto de usuario
        groupParticipantInfo.push(user)
      }
    }

    console.log('groupParticipantInfo', groupParticipantInfo)

    setGroupParticipants(groupParticipantInfo)
    console.log(groupParticipantInfo)
  } catch (error) {
    console.error(error)
  }
}
