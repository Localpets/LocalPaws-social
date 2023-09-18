import { BsFillBellFill, BsFillSuitHeartFill } from 'react-icons/bs'
import { VscMention } from 'react-icons/vsc'
import LeftBar from '../Feed/LeftBar'
import RightBar from '../Feed/RightBar'
import Notify from './Noticaciones.json'
import { Link } from '@tanstack/router'
import likeIcon from '../../assets/Noticon/likeIcon.png'
import followIcon from '../../assets/Noticon/followIcon.png'
import mentionIcon from '../../assets/Noticon/mentionIcon.png'
import { useEffect } from 'react'
import { makeRequest } from '../../library/axios'
import { useState } from 'react'
import Header from '../Header/Header'
import { useQuery } from '@tanstack/react-query'



const Notificaciones = () => {
  const [notification, setNotification] = useState([])

  const Types = {
    "Like": likeIcon,
    "Follow": followIcon,
    "Mention": mentionIcon
  }

  const selectIcon = (type) => {
    if (type === "Like"){
      return Types.Like
    }
    else if (type === "Follow"){
      return Types.Follow
    }
    else if (type === "Mention"){
      return Types.Mention
    }
  }
  const { isLoading, error, data } = useQuery({
    queryKey: ['notification'],
    queryFn: async () => {
      const user = JSON.parse(localStorage.getItem('user'))
      const id = user.userId
      return await makeRequest.get(`/notification/find/id/receiver/${id}`).then((res) => {
        setNotification(res.data.notifications)
        console.log(res.data.notifications)
        
        return res.data
      })
    }
  })

  if (isLoading) {
    return (
      <div className='mx-auto pt-20'>
        <span className='loading loading-ring loading-lg' />
      </div>
    )
  }
  if (error) return 'An error has occurred: ' + error.message

  return (
    <div className='text-black w-full mx-auto min-h-screen'>
      <Header />
      <section className='flex pt-16'>
        <div className='w-full pl-[25%] pr-[25%] min-h-screen flex flex-col rounded-lg justify-start gap-4 items-center px-10'>
          <LeftBar className='' />
          <div className='w-full min-h-auto max-h-screen p-[2em] flex flex-col px-8 border-[#E0E1DD] bg-white rounded-lg mt-8 justify-start items-center pt-[2em] '>

            <div className='flex w-full pl-3 pb-4 '>
              <h1 className='flex font-bold text-3xl text-left'>Notificaciones</h1>
            </div>
              {notification.length > 0
              ? notification.map((notification) => {
                const icon = selectIcon(notification.type)
              return(
                <Link to='/' key={notification.id} className="flex w-full pl-3 h-20 pt-2 gap-4  rounded-lg  hover:bg-[#E0E1DD] border-t items-center">
                  <img src={icon} className='items-center pl-2 w-10 h-8' />
                  <div>
                    <img className='w-8 h-8 rounded-full'
                      src={notification.user.thumbnail}></img>
                    <p className="flex text-left w-full pt-2 text-black gap-1" ><span className='font-bold'>{notification.user.username}</span>{notification.text}</p>
                  </div>
                </Link>)
              })
            :'Cargando'}
          </div>
          <RightBar />
        </div>
      </section>
    </div>



  )
}

export default Notificaciones
