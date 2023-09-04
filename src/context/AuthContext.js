import { create } from 'zustand'

const useAuthStore = create((set) => ({
  // Estado de usuario en la app
  user: null,

  // Funciones para actualizar el estado
  setUser: (user) => set((state) => ({ user })),

  // Funcion para cerrar sesion
  logout: () => set((state) => ({ user: null }))
}))

export default useAuthStore
