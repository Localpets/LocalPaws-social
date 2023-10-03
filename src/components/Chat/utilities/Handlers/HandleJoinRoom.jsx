export function handleJoinRoom (otherUserId, localuser, currentchat, socket) {
  // Concatenar los IDs de los usuarios para obtener el nuevo nombre de la sala
  const newRoomName = `${Math.min(localuser.user_id, otherUserId)}-${Math.max(localuser.user_id, otherUserId)}`

  // Obtener el nombre de la sala actual del usuario
  const currentRoomName = getCurrentRoomName()

  // Si el usuario está actualmente en una sala y la sala actual es diferente de la nueva sala,
  // entonces saca al usuario de la sala anterior y únete a la nueva sala
  if (currentRoomName && currentRoomName !== newRoomName) {
    // Salir de la sala anterior
    socket.emit('leaveRoom', currentRoomName)
    console.log(`Usuario ${localuser.user_id} salió de la sala: ${currentRoomName}`)

    // Unirse a la nueva sala
    socket.emit('joinRoom', newRoomName)
    console.log(`Usuario ${localuser.user_id} se unió a la sala: ${newRoomName}`)
  } else if (!currentRoomName) {
    // Si el usuario no está en ninguna sala actualmente, únete directamente a la nueva sala
    socket.emit('joinRoom', newRoomName)
    console.log(`Usuario ${localuser.user_id} se unió a la sala: ${newRoomName}`)
  }
  // Función para obtener la sala actual del usuario
  function getCurrentRoomName () {
    // Verifica si currentchat y currentchat.conversation están definidos antes de acceder a 'length'
    if (currentchat && currentchat.conversation) {
      return currentchat.conversation.length > 0 ? currentchat.conversation[0].room : null
    }
    return null // O devuelve null si no está definido
  }
}
