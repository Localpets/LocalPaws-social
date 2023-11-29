import { useState, useEffect } from 'react'
import { Link } from '@tanstack/router'
import { makeRequest } from '../../library/Axios'
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel
} from '@tanstack/react-table'
import useFindUser from '../../hooks/useFindUser'
import useDelete from './hooks/useDelete'
import dayjs from 'dayjs'
import swal from 'sweetalert'
import data from '../../../public/MOCK_DATA.json'
import PostsTableSkeleton from './PostsTableSkeleton'
import EditPostModal from './EditComponent'
import propTypes from 'prop-types'
import PostForm from '../../components/Forms/PostForm'

const PostsTable = ({ setLikes, setComments, likes, comments, showForm }) => {
  const { user } = useFindUser()
  const { handleDelete } = useDelete()

  const placeHolderThumbnail = 'https://media.istockphoto.com/id/1324356458/vector/picture-icon-photo-frame-symbol-landscape-sign-photograph-gallery-logo-web-interface-and.jpg?s=612x612&w=0&k=20&c=ZmXO4mSgNDPzDRX-F8OKCfmMqqHpqMV6jiNi00Ye7rE='

  // State for managing the edit modal
  const [editModalPost, setEditModalPost] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)

    const getPosts = async () => {
      try {
        let newLikes = 0
        let newComments = 0
        // ac

        const { data } = await makeRequest('/post/find/all')
        // filter posts
        const filteredPosts = data.posts.filter(post => post.post_user_id === user.user_id)

        // Now for each post find its likes and comments and agregate them into a object in a new array of objects

        const postsWithLikesAndComments = await Promise.all(filteredPosts.map(async (post) => {
          const likesRes = await makeRequest(`/like/post/${post.post_id}`)
          const commentsRes = await makeRequest(`/comment/find/post/${post.post_id}`)

          // add likes and comments to newLikes and newComments
          newLikes += likesRes.data.likes.length
          newComments += commentsRes.data.comments.length
          // set values to state variables
          setLikes(newLikes)
          setComments(newComments)

          return {
            ...post,
            likes: likesRes.data.likes.length,
            comments: commentsRes.data.comments.length
          }
        })
        )

        console.log('postsWithLikesAndComments', postsWithLikesAndComments)
        // Add those values to the state
        setComments(newComments)
        setLikes(newLikes)
        setPosts(postsWithLikesAndComments)
      } catch (error) {
        console.log('error', error)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      console.log('user', user)
      setCurrentUser(user)
      getPosts()
    }
  }
  , [user])

  const onDelete = async (id) => {
    try {
      if (user) {
        await makeRequest.delete(`post/delete/${id}/${user.user_id}`)
        const newPosts = posts.filter(post => post.post_id !== id)
        // remove likes and comments from the count of that post in the state
        const likesRes = await makeRequest(`/like/post/${id}`)
        const commentsRes = await makeRequest(`/comment/find/post/${id}`)
        console.log('likesRes', likesRes)
        console.log('commentsRes', commentsRes)
        // validate if the likes and comments are greater than 0 or not null
        if (likesRes.data.likes && likesRes.data.likes.length > 0 && likesRes.data.likes !== null) {
          setLikes(likes - likesRes.data.likes.length)
        }
        if (commentsRes.data.comments && commentsRes.data.comments.length > 0 && commentsRes.data.comments !== null) {
          setComments(comments - commentsRes.data.comments.length)
        }
        // set the new posts
        setPosts(newPosts)
      }
    } catch (error) {
      console.log('error', error)
    }
  }

  const openEditModal = (id) => {
    setEditModalPost(id)
    setShowEditModal(true)
  }

  const closeEditModal = () => {
    setEditModalPost(null)
    setShowEditModal(false)
  }

  const columns = [
    {
      // Auto increment column
      header: 'Miniatura',
      accessorKey: 'image',
      footer: 'Miniatura'
    },
    {
      header: 'Texto',
      accessorKey: 'text',
      footer: 'Texto'
    },
    {
      header: 'Fecha de publicación',
      accessorKey: 'createdAt',
      footer: 'Fecha de publicación'
    },
    {
      header: 'Categoria',
      accessorKey: 'category',
      footer: 'Categoria'
    },
    {
      header: 'Likes',
      accessorKey: 'likes',
      footer: 'Likes'
    },
    {
      header: 'Comentarios',
      accessorKey: 'comments',
      footer: 'Comentarios'
    },
    {
      header: 'Acciones',
      accessorKey: 'post_id',
      footer: 'Acciones'
    }
  ]

  const table = useReactTable({
    columns,
    data: posts || data,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  })

  if (!currentUser) return null
  if (currentUser && currentUser.type !== 'MEMBER') {
    swal('Error', 'You are not a member', 'error').then(() => {
      window.location.href = '/'
    })
  }

  if (loading) {
    return <PostsTableSkeleton />
  } else {
    return (
      <div className='overflow-x-auto w-full py-4 rounded-sm '>
        {/* Show form post creation if button pressed */}
        {showForm && <PostForm setPosts={setPosts} posts={posts} />}

        <table className='table table-auto w-full bg-slate-50 p-8 rounded-sm '>
          {/* head */}
          <thead>
            {
              table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {
                    headerGroup.headers.map(header => (
                      <th key={header.id}>
                        {
                          header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())
                        }
                      </th>
                    ))
                  }
                </tr>
              ))
            }
          </thead>
          <tbody>
            {/* body */}
            {
              table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {
                    // If it the cell is the text column, render the text but show only 20 characters
                    row.getVisibleCells().map((cell) => (
                      <td key={cell.id}>
                        {
                          cell.column.columnDef.accessorKey === 'text' && cell.getValue().length > 20
                            ? flexRender(cell.getValue().slice(0, 20) + '...', cell.getContext())
                            : cell.column.columnDef.accessorKey === 'post_id'
                              ? (
                                <div className='flex items-center gap-2'>
                                  <button className='btn btn-primary btn-sm' onClick={() => openEditModal(cell.getValue())}>Editar</button>
                                  <button className='btn btn-primary btn-sm' onClick={() => handleDelete(cell.getValue(), onDelete)}>Borrar</button>
                                  <Link to={`/post/${cell.getValue()}`} className='btn btn-primary btn-sm'>Ver</Link>
                                </div>
                                )
                              : cell.column.columnDef.accessorKey === 'createdAt'
                                ? flexRender(dayjs(cell.getValue()).format('DD/MM/YYYY'), cell.getContext())
                                : cell.column.columnDef.accessorKey === 'image'
                                  ? flexRender(<img src={cell.getValue() === 'no image' ? placeHolderThumbnail : cell.getValue()} alt='thumbnail' className='w-16 h-16' />, cell.getContext())
                                  : flexRender(cell.column.columnDef.cell, cell.getContext())
                        }
                      </td>
                    ))
                  }
                </tr>
              ))
            }
          </tbody>
          {/* foot */}
          <tfoot>
            {
              table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {
                    headerGroup.headers.map(header => (
                      <th key={header.id}>
                        {
                          header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())
                        }
                      </th>
                    ))
                  }
                </tr>
              ))
            }
          </tfoot>
        </table>

        {/* pagination */}
        <div className='flex justify-between items-center w-full mt-4'>
          <div className='flex items-center gap-2'>
            <p>1-{posts && posts.length < 10 ? posts.length : 10} de {posts && posts.length} posts.</p>
            <button
              className='btn btn-primary btn-sm'
              onClick={() => table.setPageIndex(0)}
            >
              Primera
            </button>
            <button
              className='btn btn-primary btn-sm'
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Anterior
            </button>
            <button
              className='btn btn-primary btn-sm'
              onClick={() => {
                if (table.getCanNextPage()) table.nextPage()
              }}
              disabled={!table.getCanNextPage()}
            >
              Siguiente
            </button>
            <button
              className='btn btn-primary btn-sm'
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            >
              Última
            </button>
          </div>
        </div>
        {/* End of pagination */}

        {/* Render EditPostModal if showEditModal is true */}
        {showEditModal && (
          <EditPostModal
            id={editModalPost}
            onClose={closeEditModal}
            posts={posts}
            setPosts={setPosts}
          />
        )}
      </div>
    )
  }
}

PostsTable.propTypes = {
  setLikes: propTypes.func,
  setComments: propTypes.func,
  likes: propTypes.number,
  comments: propTypes.number,
  showForm: propTypes.bool
}

export default PostsTable
