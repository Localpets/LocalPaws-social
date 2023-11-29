// EditPostModal.js
import { useEffect, useState } from 'react'
import { makeRequest } from '../../library/Axios'
import useEdit from './hooks/useEdit'
import propTypes from 'prop-types'

const EditPostModal = ({ id, onClose, posts, setPosts }) => {
  const { editingValue, startEditing, handleSave } = useEdit()
  const [categories, setCategories] = useState([])
  const [category, setCategory] = useState(null)
  const [text, setText] = useState(null)

  // Initialize the editing value when the modal opens
  useEffect(() => {
    const findPost = async () => {
      const { data } = await makeRequest(`post/find/id/${id}`)
      console.log(data)
      startEditing(data.post)
    }

    const findCategories = async () => {
      await makeRequest.get('/post/category/find/all').then((res) => {
        setCategories(res.data.categories)
      })
    }
    findCategories()
    findPost()
  }, [id])

  if (!editingValue) {
    return (
      <div className='fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex'>
        <div className='relative p-8 bg-white w-full max-w-md m-auto flex-col flex rounded shadow-lg'>
          <div className='relative flex justify-between items-center'>
            <h2 className='text-2xl font-bold'>Editar publicación</h2>
            <button
              className='text-2xl font-bold'
            >
              &times;
            </button>
          </div>
          {/* Posts text */}
          <div className='mt-4'>
            <h2 className='text-xl font-semibold py-2'>Texto</h2>
            <textarea
              className='w-full border border-gray-300 rounded p-2'
              disabled
            />
          </div>
          {/* Posts categories */}
          <div className='mt-4'>
            <h2 className='text-xl font-semibold py-2'>Categoría</h2>
            <select
              className='w-full border border-gray-300 rounded p-2'
              disabled
            >
              <option value=''>Select a category</option>
            </select>
          </div>
          {/* Posts image */}
          <div className='mt-4'>
            <h2 className='text-xl font-semibold py-2'>Imagen</h2>
            <input
              className='w-full border border-gray-300 rounded p-2'
              disabled
            />
          </div>
          {/* Buttons */}
          <div className='mt-4 flex justify-end'>
            <button
              className='mr-2 px-4 py-2 text-white bg-red-500 hover:bg-red-600 rounded'
            >
              Cancelar
            </button>
            <button
              className='px-4 py-2 text-white bg-green-500 hover:bg-green-600 rounded'
            >
              Guardar cambios
            </button>
          </div>
        </div>
      </div>
    )
  } else {
    return (
      <div className='fixed inset-0 overflow-auto bg-black bg-opacity-50 flex z-[99999]'>
        <div className='relative p-8 bg-white w-full max-w-md m-auto flex-col flex rounded shadow-lg'>
          <div className='relative flex justify-between items-center'>
            <h2 className='text-2xl font-bold'>Editar publicación</h2>
            <button
              className='text-2xl font-bold'
              onClick={onClose}
            >
              &times;
            </button>
          </div>
          {/* Posts text */}
          <div className='mt-4'>
            <h2 className='text-xl font-semibold py-2'>Texto</h2>
            <textarea
              className='w-full border border-gray-300 rounded p-2'
              onChange={(e) => setText(e.target.value)}
              defaultValue={editingValue.text || ''}
              value={text || editingValue.text || ''}
            />
          </div>
          {/* Posts categories */}
          <div className='mt-4'>
            <h2 className='text-xl font-semibold py-2'>Categoría</h2>
            <select
              className='w-full border border-gray-300 rounded p-2'
              onChange={(e) => setCategory(e.target.value)}
            >
              <option>{editingValue.category || 'Select a category'}</option>
              {
                    categories
                      ? categories.map((category) => (
                        <option key={category.category_type_id} value={category.title}>{category.title}</option>
                      ))
                      : null
                }
            </select>
          </div>
          {/* Buttons */}
          <div className='mt-4 flex justify-end'>
            <button
              className='mr-2 px-4 py-2 text-white bg-red-500 hover:bg-red-600 rounded'
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              className='px-4 py-2 text-white bg-green-500 hover:bg-green-600 rounded'
              onClick={() => {
                handleSave(text, category, null, editingValue, posts, setPosts)
                onClose()
              }}
            >
              Guardar cambios
            </button>
          </div>
        </div>
      </div>
    )
  }
}

EditPostModal.propTypes = {
  id: propTypes.number,
  onClose: propTypes.func,
  posts: propTypes.array,
  setPosts: propTypes.func
}

export default EditPostModal
