import { create } from 'zustand';
import veterinariaIcon from '/public/assets/markers/veterinaria.png'
import petshopIcon from '/public/assets/markers/petshop.png'
import refugioIcon from '/public/assets/markers/refugio.png'

export const useStore = create((set) => ({
  // Identificador del marcador seleccionado
  selectedMarkerId: null,
  
  // Datos del marcador seleccionado
  selectedMarkerData: null,
  
  // Estado para controlar si la barra lateral está abierta o cerrada
  isSidebarOpen: false,
  
  // Estado para controlar la visibilidad de los marcadores en el mapa
  showMarkers: false,
  
  // Objeto que almacena los datos del marcador seleccionado
  selectedMarker: null,
  
  // Estado para controlar la visibilidad de la ventana de información
  infoWindowVisible: false,
  
  // Ubicación en la que se hizo clic en el mapa
  clickedLocation: null,
  
  // Estado para controlar si se está cargando información
  isLoading: false,
  
  // Centro del mapa
  mapCenter: { lat: 7.894548407217585, lng: -72.50464859544364 },
  
  // Iconos correspondientes a cada tipo de marcador
  IconForEachType: {
    Veterinaria: veterinariaIcon,
    Petshop: petshopIcon,
    AnimalShelter: refugioIcon,
  },

  // Estado para controlar la visibilidad de los botones
  showOptions: false,

   // Estado para controlar la visibilidad del boton pawsplorer en moviles
  showPawsPlorer: true,
  
  // Función para establecer el estado de carga
  setIsLoading: (isLoading) => set({ isLoading }),
  
  // Función para establecer el identificador del marcador seleccionado
  setSelectedMarkerId: (marker) => set({ selectedMarkerId: marker }),
  
  // Función para establecer los datos del marcador seleccionado
  setSelectedMarkerData: (marker) => set({ selectedMarkerData: marker }),
  
  // Función para establecer si la barra lateral está abierta o cerrada
  setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
  
  // Función para establecer la visibilidad de los marcadores en el mapa
  setShowMarkers: (value) => set({ showMarkers: value }),
  
  // Función para establecer el marcador seleccionado
  setSelectedMarker: (marker) => set({ selectedMarker: marker }),
  
  // Función para establecer la visibilidad de la ventana de información
  setInfoWindowVisible: (value) => set({ infoWindowVisible: value }),
  
  // Función para establecer la ubicación en la que se hizo clic en el mapa
  setClickedLocation: (location) => set({ clickedLocation: location }),

  // Funcion para establecer la visibilidad del boton Pawsplorer en moviles
  toggleOptions: () => {
    set((state) => ({
      showOptions: !state.showOptions,
      showPawsPlorer: !state.showPawsPlorer,
    }));
  },
}));
