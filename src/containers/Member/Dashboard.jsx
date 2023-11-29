// Desc: Dashboard for member
// import React from 'react'
import { Link } from '@tanstack/router'
import PostsTable from './PostsTable'
import LikesTable from './LikesTable'
import { useState } from 'react'
import CommentsTable from './CommentsTable'
import useFindUser from '../../hooks/useFindUser'

const Dashboard = () => {
  const { user } = useFindUser()
  const [likes, setLikes] = useState(0)
  const [comments, setComments] = useState(0)
  const [view, setView] = useState('posts' || 'likes' || 'comments')
  const [showForm, setShowForm] = useState(false)
  const [navBarStyles, setNavBarStyles] = useState(true)

  if (user && user.type !== 'MEMBER') return (<div>Acceso denegado</div>)

  return (
    <div className='flex flex-col min-h-screen w-full'>
      <header className='flex items-center justify-between h-16 px-6 bg-primary fixed z-[9999] w-full'>
        <Link className='flex items-center gap-2 font-semibold text-white' to='/home'>
          <svg
            className=' h-6 w-6'
            fill='none'
            height='24'
            stroke='currentColor'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            viewBox='0 0 24 24'
            width='24'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path d='M12 10V2' />
            <path d='m4.93 10.93 1.41 1.41' />
            <path d='M2 18h2' />
            <path d='M20 18h2' />
            <path d='m19.07 10.93-1.41 1.41' />
            <path d='M22 22H2' />
            <path d='m16 6-4 4-4-4' />
            <path d='M16 18a4 4 0 0 0-8 0' />
          </svg>
          <span>Pawsplorer</span>
        </Link>
        <div className='flex gap-x-2'>
          <div className='dropdown dropdown-bottom dropdown-end bg-primary'>
            <label tabIndex={0} className='m-1 btn bg-primary hover:bg-slate-600 border-none text-white'>
              <div className='avatar'>
                <div className='rounded-full w-10 h-10 m-1'>
                  <img
                    alt='Avatar'
                    src={user?.thumbnail || 'https://i.imgur.com/HeIi0wU.png'}
                    style={{
                      aspectRatio: '1/1',
                      objectFit: 'cover'
                    }}
                  />
                </div>
              </div>
            </label>
            <ul tabIndex={0} className='p-2 shadow menu dropdown-content z-[1] bg-white rounded-box w-52'>
              <li>
                <Link to={user ? `/profile/${user.user_id}` : '#'}>Mi perfil</Link>
              </li>
              <li>
                <Link to='/logout'>Cerrar sesión</Link>
              </li>
            </ul>
          </div>
          {/* Menu button with translation for navbar in 320px to 1023px */}
          <button
            className='block lg:hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary focus:ring-white'
            onClick={() => {
              // If false then is desktop view and we need to hide the navbar
              // If true then is mobile view and we need to show the navbar
              setNavBarStyles(!navBarStyles)
            }}
          >
            <svg
              className='h-6 w-6 text-white'
              fill='none'
              height='24'
              stroke='currentColor'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              viewBox='0 0 24 24'
              width='24'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path d='M4 6h16M4 12h16M4 18h16' />
            </svg>
          </button>
        </div>
      </header>
      <div className='flex min-h-screen rounded-md pt-16 w-full h-full'>
        <nav className={
          navBarStyles
            ? 'bg-primary text-white h-screen w-56 fixed z-[9999] flex flex-col gap-4 p-6 transition-all duration-500 ease-in-out'
            : 'bg-primary h-screen w-56 fixed z-[9999] flex-col gap-4 p-6 transition-all duration-500 ease-in-out -translate-x-full'
        }
        >
          <h2 className='text-xl font-semibold'>Administrador</h2>
          <button
            className={
              view === 'posts'
                ? 'flex items-center gap-2 rounded-lg px-2 py-1 text-zinc-50 bg-slate-600 dark:bg-slate-700 dark:text-zinc-50'
                : 'flex items-center gap-2 rounded-lg px-2 py-1 text-zinc-500 transition-all hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50'
            }
            onClick={() => setView('posts')}
          >
            <svg
              className=' h-4 w-4'
              fill='none'
              height='24'
              stroke='currentColor'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              viewBox='0 0 24 24'
              width='24'
              xmlns='http://www.w3.org/2000/svg'
            >
              <rect height='4' rx='1' ry='1' width='8' x='8' y='2' />
              <path d='M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2' />
            </svg>
            Posts
          </button>
          <button
            className={
              view === 'likes'
                ? 'flex items-center gap-2 rounded-lg px-2 py-1 text-zinc-50 bg-slate-600 dark:bg-slate-700 dark:text-zinc-50'
                : 'flex items-center gap-2 rounded-lg px-2 py-1 text-zinc-500 transition-all hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50'
            }
            onClick={() => setView('likes')}
          >
            <svg
              className=' h-4 w-4'
              fill='none'
              height='24'
              stroke='currentColor'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              viewBox='0 0 24 24'
              width='24'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path d='M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z' />
            </svg>
            Likes
          </button>
          <button
            className={
              view === 'comments'
                ? 'flex items-center gap-2 rounded-lg px-2 py-1 text-zinc-50 bg-slate-600 dark:bg-slate-700 dark:text-zinc-50'
                : 'flex items-center gap-2 rounded-lg px-2 py-1 text-zinc-500 transition-all hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50'
            }
            onClick={() => setView('comments')}
          >
            <svg
              className=' h-4 w-4'
              fill='none'
              height='24'
              stroke='currentColor'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              viewBox='0 0 24 24'
              width='24'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path d='m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z' />
            </svg>
            Comentarios
          </button>
        </nav>
        <main className={
          navBarStyles
            ? 'flex flex-col w-full h-full p-6 transition-all duration-500 ease-in-out pl-64 overflow-y-auto'
            : 'flex flex-col w-full h-full p-6 transition-all duration-500 ease-in-out'
        }
        >
          <div className='grid justify-center md:grid-cols-2 gap-y-4 md:gap-y-0 md:gap-x-4 grid-cols-1 grid-rows-2 md:grid-rows-1 content-center'>
            {/* 3 Cards here for likes comments and shares */}
            <div className={
              navBarStyles
                ? 'card shadow-xl h-[225px] w-[225px] md:w-[225px] lg:w-[300px] xl:[400px] mx-auto bg-slate-100 py-10 px-4 flex flex-col items-center justify-center'
                : 'card shadow-xl h-[225px] min-w-[225px] md:w-[250px] lg:w-[300px] xl:[400px] mx-auto bg-slate-100 py-10 px-4 flex flex-col items-center justify-center'
            }
            >
              <h2 className='text-center font-bold text-2xl'>Likes</h2>
              <p className='text-4xl font-semibold text-center'>{likes}</p>
            </div>

            <div className={
              navBarStyles
                ? 'card shadow-xl h-[225px] w-[225px] md:w-[225px] lg:w-[300px] xl:[400px] mx-auto bg-slate-100 py-10 px-4 flex flex-col items-center justify-center'
                : 'card shadow-xl h-[225px] min-w-[225px] md:w-[250px] lg:w-[300px] xl:[400px] mx-auto bg-slate-100 py-10 px-4 flex flex-col items-center justify-center'
            }
            >
              <h2 className='text-center font-bold text-2xl'>Comentarios</h2>
              <p className='text-4xl font-semibold text-center'>{comments}</p>
            </div>
          </div>
          <div className='items-center w-full mt-10 flex flex-col flex-wrap justify-between'>
            <div className='flex justify-between w-full gap-x-4'>
              <h2 className='text-xl font-semibold'>
                {
                  view === 'posts'
                    ? 'Administrando Publicaciones'
                    : view === 'likes'
                      ? 'Administrando Likes'
                      : view === 'comments'
                        ? 'Administrando Comentarios'
                        : 'Administrando Publicaciones'
                }
              </h2>
              <button
                className={
                  view === 'posts'
                    ? 'btn btn-primary'
                    : view === 'likes'
                      ? 'btn btn-secondary hidden'
                      : view === 'comments'
                        ? 'btn btn-tertiary hidden'
                        : 'btn btn-primary'
                }
                onClick={() => setShowForm(!showForm)}
              >
                {
                  showForm ? 'Cancelar' : 'Crear Publicación'
                }
              </button>
            </div>
            {
              view === 'posts'
                ? <PostsTable setLikes={setLikes} setComments={setComments} likes={likes} comments={comments} showForm={showForm} />
                : view === 'likes'
                  ? <LikesTable />
                  : view === 'comments'
                    ? <CommentsTable />
                    : <PostsTable setLikes={setLikes} setComments={setComments} likes={likes} comments={comments} />
            }
          </div>
        </main>
      </div>
    </div>
  )
}

export default Dashboard
