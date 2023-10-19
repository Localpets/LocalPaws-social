import { useState } from 'react'
import { Map, Draggable } from 'pigeon-maps'
import propTypes from 'prop-types'
import { Toaster, toast } from 'react-hot-toast'

export function MapComponent ({ setBussinesCoords }) {
  const [showMap, setShowMap] = useState(false)
  const [anchor, setAnchor] = useState([7.894548407217585, -72.50464859544364])

  const handleShowMap = () => {
    window.scrollTo(0, 0)
    setShowMap(!showMap)
  }

  const handleDragEnd = (event) => {
    setAnchor(event)
    setBussinesCoords(`${event[0]},${event[1]}`)
  }

  return (
    <section className='z-50'>
      <div className='pt-4 flex flex-col lg:flex-row items-center'>
        <label htmlFor='showMap' className='cursor-pointer'>Ubicar tu local</label>
        <button type='button' name='showMap' id='showMap' onClick={handleShowMap} className='pl-2'>
          <i className='fa-solid fa-map' />
        </button>
      </div>
      {
        showMap
          ? (
            <div className='absolute flex flex-col items-center justify-center md:flex-row rounded-lg top-5 md:top-40 left-0 lg:left-5 w-full lg:w-[50%] h-auto z-50 bg-red px-2 py-10 lg:p-10 bg-gray-100 border'>
              <div className='p-4 flex flex-col gap-2 md:w-[35%]'>
                <h2 className='font-bold text-2xl text-center pb-2'>Instrucciones</h2>
                <h3 className='text-xl text-left'>1. Arrastra el perrito hacia donde esta situado tu local.</h3>
                <h3 className='text-xl text-left'>2. Una vez termines presiona el botón de confirmar.</h3>
                <button
                  type='button'
                  className='btn mt-6 hidden md:block'
                  onClick={
                  () => {
                    toast.success('Ubicación guardada')
                    handleShowMap()
                  }
                }
                >
                  Confirmar ubicación
                </button>
              </div>
              <Map height={300} width={500} defaultCenter={[7.894548407217585, -72.50464859544364]} defaultZoom={18}>
                <Draggable offset={[60, 87]} anchor={anchor} onDragEnd={handleDragEnd}>
                  <img src='https://cdn-icons-png.flaticon.com/256/7603/7603367.png' width={50} height={50} alt='Pigeon!' />
                </Draggable>
              </Map>
              <button
                type='button'
                className='btn mt-6 md:hidden'
                onClick={
                  () => {
                    toast.success('Ubicación guardada')
                    handleShowMap()
                  }
                }
              >
                Confirmar ubicación
              </button>
            </div>
            )
          : null
      }
      <Toaster />
    </section>

  )
}

MapComponent.propTypes = {
  setBussinesCoords: propTypes.func
}

export default MapComponent
