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
import dayjs from 'dayjs'
import swal from 'sweetalert'
import data from '../../../public/MOCK_DATA.json'
import PostsTableSkeleton from './PostsTableSkeleton'
// import propTypes from 'prop-types'

const LikesTable = () => {
  const { user } = useFindUser()

  const placeHolderThumbnail = 'https://media.istockphoto.com/id/1324356458/vector/picture-icon-photo-frame-symbol-landscape-sign-photograph-gallery-logo-web-interface-and.jpg?s=612x612&w=0&k=20&c=ZmXO4mSgNDPzDRX-F8OKCfmMqqHpqMV6jiNi00Ye7rE='

  const [currentUser, setCurrentUser] = useState(null)
  const [likes, setLikes] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)

    const getPosts = async () => {
      try {
        const { data } = await makeRequest(`like/posts/user/${user.user_id}`)
        setLikes(data.likes)
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
      accessorKey: 'like_id',
      header: 'ID',
      isPlaceholder: false
    },
    {
      accessorKey: 'post_id',
      header: 'Post del like',
      isPlaceholder: false
    },
    {
      accessorKey: 'user.username',
      header: 'Nombre de usuario',
      isPlaceholder: false
    },
    {
      accessorKey: 'user.email',
      header: 'Correo',
      isPlaceholder: false
    },
    {
      accessorKey: 'like_type',
      header: 'Tipo de like',
      isPlaceholder: false
    },
    {
      accessorKey: 'like_created_at',
      header: 'Fecha de creación',
      isPlaceholder: false
    },
    {
      accessorKey: 'user.user_id',
      header: 'Acciones',
      isPlaceholder: false
    }
  ]

  const table = useReactTable({
    columns,
    data: likes || data,
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
                              <div className='flex items-center gap-2'>
                                <Link to={`/post/${cell.getValue()}`} className='btn btn-primary btn-sm'>Ver post</Link>
                              </div>
                              )
                            : cell.column.columnDef.accessorKey === 'like_created_at'
                              ? flexRender(dayjs(cell.getValue()).format('DD/MM/YYYY'), cell.getContext())
                              : cell.column.columnDef.accessorKey === 'user.thumbnail'
                                ? flexRender(<img src={cell.getValue() === 'no image' ? placeHolderThumbnail : cell.getValue()} alt='thumbnail' className='w-16 h-16' />, cell.getContext())
                                : cell.column.columnDef.accessorKey === 'user.user_id'
                                  ? (
                                    <div className='flex items-center gap-2'>
                                      <Link to={`/perfil/${cell.getValue()}`} className='btn btn-primary btn-sm'>Ver perfil</Link>
                                    </div>
                                    )
                                  : cell.column.columnDef.accessorKey === 'like_type'
                                    ? flexRender(
                                      cell.getValue() === 'LIKE' || cell.getValue() === 'Like'
                                        ? 'Me gusta'
                                        : cell.getValue() === 'Triste' || cell.getValue() === 'TRISTE'
                                          ? 'Me entristece'
                                          : cell.getValue() === 'Enojado' || cell.getValue() === 'ENOJADO'
                                            ? 'Me enoja'
                                            : cell.getValue() === 'Haha' || cell.getValue() === 'SMILE'
                                              ? 'Me divierte'
                                              : cell.getValue() === 'Asombrado'
                                                ? 'Me asombra'
                                                : cell.getValue() === 'Me gusta'
                                      , cell.getContext()
                                    )
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
            <p>1-{likes && likes.length < 10 ? likes.length : 10} de {likes && likes.length} likes.</p>
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
      </div>
    )
  }
}

LikesTable.propTypes = {}

export default LikesTable
