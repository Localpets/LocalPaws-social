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




const Notificaciones = () => {
  const [notifys, setNotifys] = useState([])
    useEffect(() => {
      async function fetchNoti() {
        try {
          const response = await makeRequest.get('')
          setNotifys(response.data.data)
        } catch (error) {
          console.error('Error al obtener las notificaciones', error)
        }
      } 
      fetchNoti();
    }, []);

  return (
    <div className='flex text-black'>
      <LeftBar />
      <div className='w-full h-screen flex flex-col justify-start items-center pt-[2em] '>
      
      <div className='flex w-full pl-3 pb-4'>
        <h1 className='flex font-bold text-3xl text-left'>Notificaciones</h1>
      </div>
      
      {Notify.Notify2.map(Notify2 => {
        const IconForEachType = {
          Follow: followIcon,
          Like: likeIcon,
          Mention: mentionIcon
        };
        const iconoURL = IconForEachType[Notify2.type];
        return (
          
        <Link to='/' key={Notify2.id} className="flex w-full pl-3 h-20 pt-2 gap-4 hover:bg-[#E0E1DD] border-t items-center">
        <img src={iconoURL} className='items-center pl-2 w-10 h-8'/>
        <div>
        <img className='w-6 rounded-full'
            src={Notify2.ImageUser}></img>
        <p className="flex text-left w-full pt-2 text-black gap-1" ><span>{Notify2.usuario}</span>{Notify2.Comentario}</p>
        </div>
      </Link>
      )})}
      
      

      
    </div>
      <RightBar />
    </div>

    

      
  )
}

export default Notificaciones
