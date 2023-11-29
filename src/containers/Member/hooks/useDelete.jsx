import swal from 'sweetalert'

const useDelete = () => {
  const handleDelete = (id, onDelete) => {
    swal({
      title: '¿Estás seguro?',
      text: 'Una vez eliminado, no podrás recuperar esta publicación',
      icon: 'warning',
      buttons: true,
      dangerMode: true
    }).then((willDelete) => {
      if (willDelete) {
        // Si el usuario confirma la eliminación, llama al callback onDelete con el id
        onDelete(id)
        swal('¡Poof! Tu publicación ha sido eliminada correctamente.', {
          icon: 'success'
        })
      } else {
        swal('Tu publicación está segura.')
      }
    })
  }

  return {
    handleDelete
  }
}

export default useDelete
