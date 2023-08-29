import { create } from 'zustand'

const useChatStore = create((set) => ({
  messges: [],
  addMessage: (message) => set((state) => ({ messges: [...state.messges, message] })),
  sideContactsStyle: 'absolute translate-x-[-100%]',
  toggleSideContactsStyle: () => set((state) => (
    { sideContactsStyle: state.sideContactsStyle === 'absolute translate-x-[-100%]' ? 'absolute translate-x-0' : 'absolute translate-x-[-100%]' }
  )),
  hamburguerStyle: false,
  toggleHamburguerStyle: () => set((state) => ({ hamburguerStyle: !state.hamburguerStyle }))
}))

export default useChatStore
