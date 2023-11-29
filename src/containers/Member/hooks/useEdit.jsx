// useEdit.js
import { useState } from 'react'
import { makeRequest } from '../../../library/Axios'

const useEdit = () => {
  const [editingValue, setEditingValue] = useState(false)

  const startEditing = (initialValue) => {
    setEditingValue(initialValue)
  }

  const handleChange = (newValue) => {
    setEditingValue(newValue)
  }

  const handleSave = async (text, category, image, editingValue, posts, setPosts) => {
    // Create formData
    if (text === null && category === null && image === null) return
    // Logic for saving the edited value
    console.log(`Data being sent to the server: ${text}, ${category}, ${editingValue}`)

    if (image === null) {
      const { data } = await makeRequest.put(`post/update/${editingValue.post_id}/${editingValue.post_user_id}`, {
        text,
        category
      })
      console.log(data)
      const newPosts = posts.map((post) => {
        if (post.post_id === editingValue.post_id) {
          return {
            ...post,
            text,
            category
          }
        }
        return post
      })
      setPosts(newPosts)
    }

    if (category === null && image && text) {
      const formData = new FormData()
      formData.append('text', text)
      formData.append('image', image)
      const { data } = await makeRequest.put(`post/update/${editingValue.post_id}/${editingValue.post_user_id}`, formData)
      console.log(data)
      const newPosts = posts.map((post) => {
        if (post.post_id === editingValue.post_id) {
          return {
            ...post,
            text,
            image
          }
        }
        return post
      })
      setPosts(newPosts)
    }

    if (category && image === null && text) {
      const { data } = await makeRequest.put(`post/update/${editingValue.post_id}/${editingValue.post_user_id}`, {
        text,
        category
      })
      console.log(data) // This is the response from the server
      const newPosts = posts.map((post) => {
        if (post.post_id === editingValue.post_id) {
          return {
            ...post,
            text,
            category
          }
        }
        return post
      })
      setPosts(newPosts)
    }

    if (category && image && text) {
      const formData = new FormData()
      formData.append('text', text)
      formData.append('category', category)
      formData.append('image', image)
      const { data } = await makeRequest.put(`post/update/${editingValue.post_id}/${editingValue.post_user_id}`, formData)
      console.log(data)
      const newPosts = posts.map((post) => {
        if (post.post_id === editingValue.post_id) {
          return {
            ...post,
            text,
            category,
            image
          }
        }
        return post
      })
      setPosts(newPosts)
    }

    setEditingValue(false)
  }

  return {
    editingValue,
    startEditing,
    handleChange,
    handleSave
  }
}

export default useEdit
