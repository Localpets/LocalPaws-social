import PropTypes from 'prop-types'
import './styles.css'

// Componente para renderizar un marcador personalizado en el mapa
const CustomMarker = ({ lugar }) => (
  <>

    {/* Contenedor del marcador personalizado */}
    <div className='marker__container'>

      {/* Encabezado del marcador */}
      <header className='marker__header'>

        {/* Imagen del establecimiento */}
        {lugar.img.length !== 0
          ? (
            <img src={lugar.img[0].photo_url} alt='Imagen del establecimiento' />
            )
          : (
            <img src='https://quedex.com/gallery/EXHAUST/not_assigned.jpg' alt='Imagen del establecimiento' />
            )}

        {/* Nombre del establecimiento */}
        <h2>{lugar.name}</h2>
      </header>
    </div>
  </>
)

// Definición de tipos de propiedades requeridas para CustomMarker
CustomMarker.propTypes = {
  lugar: PropTypes.object.isRequired // El objeto "lugar" debe ser proporcionado
}

export default CustomMarker
