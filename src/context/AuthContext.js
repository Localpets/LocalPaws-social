import { create } from 'zustand'

const useAuthStore = create((set) => ({
  user: null,
  setUser: (user) => set((state) => ({ user })),
  logout: () => set((state) => ({ user: null }))
}))

export default useAuthStore
