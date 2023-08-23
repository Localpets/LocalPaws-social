import { useLoadScript } from '@react-google-maps/api'
import { useEffect } from 'react'
import Header from './Header/Header'
import Sidemenu from './Sidemenu/Sidemenu'
import Pawsmap from './Pawsmap/Pawsmap'
import './MapApp.css'

function MapApp () {
  // Cargar el script de Google Maps con la clave API
  const { isLoaded } = useLoadScript({ googleMapsApiKey: import.meta.env.VITE_API_URL })

  useEffect(() => {
    if (isLoaded) {
      document.body.classList.add('no-overflow') // Agregar la clase al body al renderizar
      window.scrollTo(0, 0) // Volver al principio del desplazamiento
    }

    return () => {
      document.body.classList.remove('no-overflow') // Remover la clase al desrenderizar
    }
  }, [isLoaded])

  // Mostrar mensaje de carga mientras se carga el mapa
  if (!isLoaded) {
    return (
      <div className='flex justify-center items-center pt-20 gap-4'>
        <h1>Cargando mapa</h1>
        <span className='loading loading-dots loading-lg' />
      </div>
    )
  }

  // Mostrar mensaje de carga mientras se carga el mapa
  return (
    <section>
      <Header />
      <Sidemenu />
      <Pawsmap />
    </section>

  )
}

export default MapApp
