import { useLoadScript } from '@react-google-maps/api'
import Header from './Header/Header'
import Sidemenu from './Sidemenu/Sidemenu'
import Pawsmap from './Pawsmap/Pawsmap'
import './MapApp.css'

function MapApp () {
  // Cargar el script de Google Maps con la clave API
  const { isLoaded } = useLoadScript({ googleMapsApiKey: import.meta.env.VITE_API_URL })

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
    <section className='localpaws__map-container'>
      <Header />
      <Sidemenu />
      <Pawsmap />
    </section>

  )
}

export default MapApp
