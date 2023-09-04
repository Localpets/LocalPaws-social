const useValidateUserLogged = (user) => {
  if (!user || user === undefined || user === null) {
    window.alert('No se ha iniciado sesión. Redireccionando...')
    window.location.href = '/'
  }
}
export default useValidateUserLogged
