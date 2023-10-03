export function handleShowMenu (conversationId, setMenuOpenMap, chatDisabled, setChatDisabled) {
  if (chatDisabled) {
    setChatDisabled(false)
  } else {
    setChatDisabled(true)
  }
  setMenuOpenMap((prevMap) => ({
    ...prevMap,
    [conversationId]: !prevMap[conversationId]
  }))
}
