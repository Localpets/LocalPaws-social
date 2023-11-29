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
import swal from 'sweetalert'
import data from '../../../public/MOCK_DATA.json'
import PostsTableSkeleton from './PostsTableSkeleton'
import CommentsRegistryComponent from './CommentsRegistryComponent'

const CommentsTable = () => {
  const { user } = useFindUser()

  const [currentUser, setCurrentUser] = useState(null)
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(false)
  const [showCommentsModal, setShowCommentsModal] = useState(false)
  const [selectedComments, setSelectedComments] = useState([])

  useEffect(() => {
    setLoading(true)

    const getPosts = async () => {
      try {
        const { data } = await makeRequest(`comment/find/all/${user.user_id}`)
        setComments(data.comments)
        setLoading(false)

        console.log('data', data)
      } catch (error) {
        console.log(error)
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

  const columns = [
    {
      accessorKey: 'post_id',
      header: 'Post de los comentarios',
      isPlaceholder: false
    },
    {
      accessorKey: 'quantity',
      header: 'Cantidad de comentarios',
      isPlaceholder: false
    },
    {
      accessorKey: 'comments',
      header: 'Acciones',
      isPlaceholder: false
    }
  ]

  const openCommentsModal = (selectedComments) => {
    setSelectedComments(selectedComments)
    setShowCommentsModal(true)
  }

  const table = useReactTable({
    columns,
    data: comments || data,
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
        <table className='table w-full bg-slate-50 p-8 rounded-sm'>
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
                          cell.column.columnDef.accessorKey === 'post_id'
                            ? (
                              <Link
                                className='btn btn-primary btn-sm'
                                to={`/post/${cell.getValue()}`}
                              >
                                Ver post (#{cell.getValue()})
                              </Link>
                              )
                            : cell.column.columnDef.accessorKey === 'comments'
                              ? (
                                <button
                                  className='btn btn-primary btn-sm'
                                  onClick={() => openCommentsModal(row.original.comments)}
                                >
                                  Ver registro de comentarios
                                </button>
                                )
                              : cell.column.columnDef.accessorKey === 'quantity'
                                ? (
                                  <p className='text-primary hover:text-primary-dark'>
                                    {cell.getValue()}
                                  </p>
                                  )
                                : flexRender(cell.value, cell.getContext())
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
            <p>1-{comments && comments.length < 10 ? comments.length : 10} de {comments && comments.length} comments.</p>
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
        {showCommentsModal && (
          <CommentsRegistryComponent comments={selectedComments} onClose={() => setShowCommentsModal(false)} />
        )}
      </div>
    )
  }
}

CommentsTable.propTypes = {}

export default CommentsTable
