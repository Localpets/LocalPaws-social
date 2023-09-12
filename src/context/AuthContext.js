import { create } from 'zustand'

const useAuthStore = create((set) => ({
  loggedUser: null,
  auth: false,
  login: (loggedUser) => set({ loggedUser, auth: true }),
  logout: () => set({ loggedUser: null })
}))

export default useAuthStore
