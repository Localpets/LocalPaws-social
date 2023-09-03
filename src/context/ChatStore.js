import { create } from 'zustand'

const useChatStore = create((set) => ({

  // Estado para manejar los datos de la conversación y los mensajes
  allchats: [],

  // Estado para almacenar los datos del usuario logueado
  localuser: [],

  // Estado para controlar los usuarios de la api
  users: [],

  // Estado para controlar el formulario de envio de mensajes
  message: '',

  // Estado para controlar el mensaje expandido por su id
  expandedMessageId: null,

  // Estado para controlar la visibilidad del menú de los mensajes
  openMenuId: null,

  // Estado para controlar la visibilidad del menú de las reacciones
  openReactMenu: null,

  // Estado para controlar la visibilidad de las conversaciones
  loadingchats: false,

  // Estado para almacenar el texto de la busqueda
  searchText: '',

  // Estado para almacenar el id del mensaje a editar
  editingMessageId: null,

  // Estado para almacenar el valor del nuevo mensaje
  editInputValue: '',

  // Estado para almacenar la instancia del socket
  socket: null,

  // Mobil
  messges: [],

  // Función para establecer los chats
  setAllchats: (chats) => set({ allchats: chats }),

  // Función para establecer el usuario local
  setLocaluser: (user) => set({ localuser: user }),

  // Función para establecer la lista de usuarios
  setUsers: (userList) => set({ users: userList }),

  // Función para establecer el mensaje
  setMessage: (text) => set({ message: text }),

  // Función para establecer el mensaje expandido por su id
  setExpandedMessageId: (messageId) => set({ expandedMessageId: messageId }),

  // Función para establecer la visibilidad del menú de los mensajes
  setOpenMenuId: (menuId) => set({ openMenuId: menuId }),

  // Función para establecer la visibilidad del menú de las reacciones
  setOpenReactMenu: (menuId) => set({ openReactMenu: menuId }),

  // Función para establecer la carga de conversaciones
  setLoadingchats: (isLoading) => set({ loadingchats: isLoading }),

  // Función para establecer el texto de búsqueda
  setSearchText: (text) => set({ searchText: text }),

  // Función para establecer el mensaje a editar por su id
  setEditingMessageId: (messageId) => set({ editingMessageId: messageId }),

  // Función para establecer el valor del mensaje editado
  setEditInputValue: (value) => set({ editInputValue: value }),

  // Función para establecer la instancia del socket
  setSocket: (newSocket) => set({ socket: newSocket }),

  // Función para agregar un mensaje al estado
  addMessage: (message) => set((state) => ({ messges: [...state.messges, message] })),

  // Estado y función para controlar el estilo de los contactos laterales
  sideContactsStyle: 'absolute translate-x-[-100%]',
  toggleSideContactsStyle: () => set((state) => (
    { sideContactsStyle: state.sideContactsStyle === 'absolute translate-x-[-100%]' ? 'absolute translate-x-0' : 'absolute translate-x-[-100%]' }
  )),

  // Estado y función para controlar el estilo del menú hamburguesa
  hamburguerStyle: false,
  toggleHamburguerStyle: () => set((state) => ({ hamburguerStyle: !state.hamburguerStyle }))
}))

export default useChatStore
