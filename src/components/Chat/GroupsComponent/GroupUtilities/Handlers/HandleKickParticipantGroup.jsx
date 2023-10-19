import { makeRequest } from '../../../../../library/axios'

export async function handleKickParticipantGroup (GroupID, participantId, socket, localuser) {
  try {
    console.log(GroupID, participantId)
    await makeRequest.delete(`message/group/kick-participant/${GroupID}/${participantId}`)

    socket.emit('updateMembers', localuser.user_id)
  } catch (error) {
    console.log(error)
  }
}
