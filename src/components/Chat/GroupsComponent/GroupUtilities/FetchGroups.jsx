import { makeRequest } from '../../../../library/axios'

export async function fetchAllGroups (localuser, setLoadingGroups, setAllgroups) {
  try {
    const res = await makeRequest.get(`message/group/get-all/${localuser.user_id}`)
    setAllgroups(res.data.groups)
    setLoadingGroups(false)
  } catch (err) {
    console.error(err)
  }
}
