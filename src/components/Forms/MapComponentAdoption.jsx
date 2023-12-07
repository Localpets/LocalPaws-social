import { useState } from 'react'
import { Map, Draggable } from 'pigeon-maps'
import propTypes from 'prop-types'
import { Toaster, toast } from 'react-hot-toast'

export function MapComponent ({ setLocationCoords }) {
  const [showMap, setShowMap] = useState(false)
  const [anchor, setAnchor] = useState([7.894548407217585, -72.50464859544364])

  const handleShowMap = () => {
    setShowMap(!showMap)
  }

  const handleDragEnd = (event) => {
    setAnchor(event)
    setLocationCoords(`${event[0]},${event[1]}`)
    console.log(event)
  }

  return (
    <section>
      <div className='pt-1 gap-2 flex flex-col lg:flex-row items-center'>
        <button type='button' name='showMap' id='showMap' onClick={handleShowMap} className='pl-2 btn btn-ghost'>
          <label htmlFor='showMap' className='cursor-pointer'>Localización de tu mascota</label>
          <i className='fa-solid fa-map' />
        </button>
      </div>
      {
        showMap
          ? (
            <div className='flex flex-col items-center justify-center rounded-lg w-full h-auto bg-red px-2 py-10 lg:p-10 bg-gray-100 border'>
              <div className='p-4 flex flex-col gap-2'>
                <h2 className='font-bold text-2xl text-center pb-2'>Instrucciones</h2>
                <h3 className='text-xl text-left'>1. Arrastra el perrito hacia donde esta situada la mascota.</h3>
                <h3 className='text-xl text-left'>2. Una vez termines presiona el botón de confirmar.</h3>
              </div>
              <Map height={300} width={500} defaultCenter={[7.894548407217585, -72.50464859544364]} defaultZoom={18}>
                <Draggable offset={[60, 87]} anchor={anchor} onDragEnd={handleDragEnd}>
                  <img src='https://cdn-icons-png.flaticon.com/256/7603/7603367.png' width={50} height={50} alt='Pigeon!' />
                </Draggable>
              </Map>
              <button
                type='button'
                className='btn mt-6'
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
  setLocationCoords: propTypes.func
}

export default MapComponent
