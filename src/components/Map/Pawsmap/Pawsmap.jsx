import { useEffect, useRef } from 'react'
import { GoogleMap, Marker, InfoWindow } from '@react-google-maps/api'
import { useStore } from '../../context/store.js'
import CustomMarker from '../../components/Markers/CustomMarker'
import Places from '../../db/places.json'
import markerIcon from '../../../../../../public/assets/markers/marcador.png'
import { AppleMapStyle } from '../../assets/MapsSyles/AppleMapStyle'
import MarkerIcon from '../../assets/Icons/marcador.png'
import './Pawsmap.css'

const Pawsmap = () => {
  // Referencia al mapa
  const mapRef = useRef()

  // Usando el contexto para obtener valores y funciones
  const {
    selectedMarkerId,
    setSelectedMarkerId,
    setSelectedMarkerData,
    selectedMarkerData,
    setSidebarOpen,
    showMarkers,
    clickedLocation,
    mapCenter,
    IconForEachType,
    setShowMarkers,
    setClickedLocation,
    infoWindowVisible,
    setInfoWindowVisible
  } = useStore()

  // Mostrar marcadores después de un retardo
  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowMarkers(true)
    }, 1000)

    return () => clearTimeout(timeout)
  }, [setShowMarkers])

  // Mostrar marcadores después de un retardo
  const lugares = Places.Lugares.map((lugar) => {
    return {
      id: lugar.Id,
      name: lugar.Name,
      address: lugar.Address,
      type: lugar.type,
      img: {
        url: lugar.Img
      },
      coordinates: {
        lat: Number(lugar.lat),
        lng: Number(lugar.lng)
      }
    }
  })

  return (
    <GoogleMap
      zoom={15}
      center={mapCenter}
      mapContainerClassName='mapita'
      options={{
        disableDefaultUI: true,
        zoomControl: true,
        streetView: true,
        streetViewControl: true,
        streetViewControlOptions: true,
        styles: AppleMapStyle,
        clickableIcons: false,
        minZoom: 15 - 2,
        maxZoom: 15 + 3
      }}
      onLoad={(map) => (mapRef.current = map)}
      // Controlador para hacer clic en el mapa
      onClick={(e) => {
        const latLng = e.latLng.toJSON()
        setClickedLocation(latLng)
        if (mapRef.current) {
          mapRef.current.panTo(latLng)
        }
      }}
    >

      {/* Marcador para la ubicación clicada */}
      {clickedLocation && (
        <Marker
          // Propiedades del marcador clicado
          position={clickedLocation}
          clickable={false}
          icon={{
            url: markerIcon,
            scaledSize: new window.google.maps.Size(60, 60),
            origin: new window.google.maps.Point(0, 0),
            anchor: new window.google.maps.Point(30, 45)
          }}
        />
      )}

      {/* Marcadores de lugares */}
      {showMarkers && (
        <section>
          {lugares.map((lugar) => {
            const iconoUrl =
              IconForEachType[lugar.type] || MarkerIcon

            return (
              <Marker
                // Propiedades del marcador de lugar
                key={lugar.id}
                position={lugar.coordinates}
                icon={{
                  url: iconoUrl,
                  scaledSize: new window.google.maps.Size(55, 55),
                  origin: new window.google.maps.Point(0, 0),
                  anchor: new window.google.maps.Point(30, 45)
                }}
                onClick={() => {
                  // Controlador para hacer clic en el marcador
                  if (selectedMarkerId === lugar.id && infoWindowVisible) {
                    setSelectedMarkerData(null)
                    setInfoWindowVisible(false)
                  } else {
                    setSelectedMarkerData(lugar)
                    setInfoWindowVisible(true)
                  }
                  setSelectedMarkerId(lugar.id)
                  setSidebarOpen(true)
                }}
                name={lugar.name}
              />
            )
          })}
        </section>
      )}

      {/* Ventana de información para el marcador seleccionado */}
      {selectedMarkerData && selectedMarkerData.coordinates && (
        <InfoWindow
          // Propiedades de la ventana de información
          key={selectedMarkerData.id}
          position={selectedMarkerData.coordinates}
          onCloseClick={() => {
            setSelectedMarkerData(null)
            setInfoWindowVisible(false)
          }}
          onPositionChanged={() => {
            if (selectedMarkerData.coordinates && mapRef.current) {
              mapRef.current.panTo(selectedMarkerData.coordinates)
            }
          }}
        >

          {/* Componente personalizado para la ventana de información */}
          <CustomMarker
            lugar={selectedMarkerData}
            setSelectedMarker={setSelectedMarkerData}
          />
        </InfoWindow>
      )}
    </GoogleMap>
  )
}

export default Pawsmap
