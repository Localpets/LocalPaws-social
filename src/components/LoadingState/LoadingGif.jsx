import { useState, useEffect } from 'react'
import RunningCat1 from '../../assets/Icons/LoadingIcons/RunningCat1.gif'
import RunningCat2 from '../../assets/Icons/LoadingIcons/RunningCat2.gif'
import RunningCat3 from '../../assets/Icons/LoadingIcons/RunningCat3.gif'
import './LoadingGif.css'

const LoadingGif = () => {
  const [image, setImage] = useState('')

  useEffect(() => {
    chooseRandomImage()
  }, [])

  const chooseRandomImage = () => {
    const images = [RunningCat1, RunningCat2, RunningCat3]
    const randomIndex = Math.floor(Math.random() * images.length)
    setImage(images[randomIndex])
  }

  return (
    <div className='relative'>
      {image && (
        <img
          className='w-10 animate-catMoveLeft'
          src={image}
          alt='Running Cat'
        />
      )}
    </div>
  )
}

export default LoadingGif
