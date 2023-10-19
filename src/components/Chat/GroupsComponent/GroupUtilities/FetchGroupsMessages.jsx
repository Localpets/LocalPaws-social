import { makeRequest } from '../../../../library/axios'

export async function fetchAllGroupsMessages (GroupId, setGroupMessages) {
  try {
    const response = await makeRequest.get(`message/group/get-messages/${GroupId}`)
    setGroupMessages(response.data.messages)
  } catch (err) {
    console.error(err)
  }
}
