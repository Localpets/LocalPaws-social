/* eslint-disable multiline-ternary */
/* eslint-disable react/jsx-props-no-multi-spaces */
import { useEffect } from 'react'
import {
  BsTelephoneFill,
  BsFillClockFill,
  BsFillBuildingFill,
  BsFillCaretRightFill,
  BsFillCaretLeftFill
} from 'react-icons/bs'

import { useStore } from '../context/store'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import './styles.css'
import '../Pawsmap/Pawsmap.css'

const Sidemenu = () => {
  // Usar el contexto para obtener valores y funciones
  const {
    selectedMarkerData,
    isSidebarOpen,
    setSidebarOpen,
    isLoading,
    setIsLoading
  } = useStore()

  // Controlar la carga del contenido cuando hay datos de marcador seleccionados
  useEffect(() => {
    if (selectedMarkerData) {
      setIsLoading(true)
      const loadingTimer = setTimeout(() => {
        setIsLoading(false)
      }, 1000)
      return () => clearTimeout(loadingTimer)
    }
  }, [selectedMarkerData, setIsLoading])

  return (
    <>

      {/* Checkbox para abrir/cerrar el menú lateral */}
      <input
        type='checkbox'
        id='SiderbarBTN'
        checked={isSidebarOpen}
        onChange={() => setSidebarOpen(!isSidebarOpen)}
      />

      {/* Contenedor principal del menú lateral */}
      <div className='container-menu absolute z-10 top-[10%] flex'>
        <div className='cont-menu md:w-[20.3em] text-center md:h-screen md:min-h-screen text-neutral'>
          <nav className='nav-sidebar'>

            {/* Contenido a mostrar */}
            <section>
              {selectedMarkerData ? (
              // Si hay datos de marcador seleccionados
                <div className='flex flex-col gap-6 justify-center items-center p-4 md:pt-10'>
                  {isLoading ? (
                  // Mostrar "Cargando..." mientras se obtienen los datos
                    <div className='flex justify-center items-center pt-20 gap-4'>
                      <p>Cargando...</p>
                      <span className='loading loading-spinner loading-lg' />
                    </div>
                  ) : (
                  // Mostrar contenido de marcador seleccionado
                    <>

                      {/* Mostrar tipo y calificación del marcador */}
                      <div className='flex items-center gap-2 justify-center w-full md:hidden'>

                        {/* Icono de tipo de establecimiento */}
                        <BsFillBuildingFill />

                        {/* Mostrar el tipo del marcador */}
                        <h3>{selectedMarkerData.type}</h3>

                        {/* Mostrar estrellas de calificación */}
                        <div className='rating rating-sm'>
                          <input type='radio' name='rating-6' className='mask mask-star-2 bg-orange-400' />
                          <input type='radio' name='rating-6' className='mask mask-star-2 bg-orange-400' />
                          <input type='radio' name='rating-6' className='mask mask-star-2 bg-orange-400' />
                          <input type='radio' name='rating-6' className='mask mask-star-2 bg-orange-400' />
                          <input type='radio' name='rating-6' className='mask mask-star-2 bg-orange-400' />
                        </div>
                      </div>

                      {/* Mostrar estrellas de calificación */}
                      <Swiper

                        // Configuración del carrusel
                        pagination={{
                          type: 'navigation'
                        }}
                        navigation
                        modules={[Pagination, Navigation]}
                        className='mySwiper w-[20em]'
                      >

                        {/* Slides del carrusel (No hay error, son necesarias ambas clases) */}
                        <SwiperSlide><img src={selectedMarkerData.img.url} className='rounded-box ImgFrame rounded-lg' alt='Imagen del establecimiento' /></SwiperSlide>
                        <SwiperSlide><img src={selectedMarkerData.img.url} className='rounded-box ImgFrame rounded-lg' alt='Imagen del establecimiento' /></SwiperSlide>
                        <SwiperSlide><img src={selectedMarkerData.img.url} className='rounded-box ImgFrame rounded-lg' alt='Imagen del establecimiento' /></SwiperSlide>
                        <SwiperSlide><img src={selectedMarkerData.img.url} className='rounded-box ImgFrame rounded-lg' alt='Imagen del establecimiento' /></SwiperSlide>
                        <SwiperSlide><img src={selectedMarkerData.img.url} className='rounded-box ImgFrame rounded-lg' alt='Imagen del establecimiento' /></SwiperSlide>
                        <SwiperSlide><img src={selectedMarkerData.img.url} className='rounded-box ImgFrame rounded-lg' alt='Imagen del establecimiento' /></SwiperSlide>
                        <SwiperSlide><img src={selectedMarkerData.img.url} className='rounded-box ImgFrame rounded-lg' alt='Imagen del establecimiento' /></SwiperSlide>
                        <SwiperSlide><img src={selectedMarkerData.img.url} className='rounded-box ImgFrame rounded-lg' alt='Imagen del establecimiento' /></SwiperSlide>
                        <SwiperSlide><img src={selectedMarkerData.img.url} className='rounded-box ImgFrame rounded-lg' alt='Imagen del establecimiento' /></SwiperSlide>
                      </Swiper>

                      {/* Mostrar nombre del establecimiento */}
                      <h2 className='text-xl font-bold'>{selectedMarkerData.name}</h2>

                      {/* Detalles del establecimiento */}
                      <div className='flex flex-col gap-3 items-center justify-center w-[75%] pt-2'>

                        {/* Número de teléfono */}
                        <div className='flex items-center gap-2 justify-start w-full'>
                          <BsTelephoneFill />
                          <h2>320 3705387</h2>
                        </div>

                        {/* Horario de apertura */}
                        <div className='flex items-center gap-2 justify-start w-full'>
                          <BsFillClockFill />
                          <h2>5:00–10:00 16:00–21:00</h2>
                        </div>

                        {/* Horario de apertura */}
                        <div className='hidden md:flex items-center gap-2 justify-start w-full'>
                          <BsFillBuildingFill />
                          <h3>{selectedMarkerData.type}</h3>

                          {/* Mostrar estrellas de calificación */}
                          <div className='rating rating-sm'>
                            <input type='radio' name='rating-6' className='mask mask-star-2 bg-orange-400' />
                            <input type='radio' name='rating-6' className='mask mask-star-2 bg-orange-400' />
                            <input type='radio' name='rating-6' className='mask mask-star-2 bg-orange-400' />
                            <input type='radio' name='rating-6' className='mask mask-star-2 bg-orange-400' />
                            <input type='radio' name='rating-6' className='mask mask-star-2 bg-orange-400' />
                          </div>
                        </div>

                        {/* Mostrar estrellas de calificación */}
                        <div className='flex flex-col w-[225px] h-30 justify-center items-center gap-2 border-2 border-gray-600 rounded-lg p-4 mb-4'>
                          <h2 className='font-bold'>Dirección</h2>
                          <p className='max-w-fit'>{selectedMarkerData.address}</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (

              // Si no hay datos de marcador seleccionados
                <div className='IfMarkerNull flex justify-center items-center pt-20'>
                  <BsFillCaretLeftFill />
                  <p>Seleccione un marcador</p>
                  <BsFillCaretRightFill />
                </div>
              )}
            </section>
          </nav>
        </div>
      </div>
    </>
  )
}

export default Sidemenu
