import { makeRequest } from '../../../library/axios'

export async function FetchReplies (messageId) {
  try {
    const response = await makeRequest.get(`message/get-responses/${messageId}`)
    const replies = response.data.responses
    return replies
  } catch (error) {
    console.log('error:', error)
  }
}
