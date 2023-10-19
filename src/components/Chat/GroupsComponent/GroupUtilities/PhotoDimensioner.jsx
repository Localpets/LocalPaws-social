export async function resizeImage (imageFile) {
  try {
    // Crear un objeto URL para la imagen
    const imageURL = URL.createObjectURL(imageFile)

    // Crear una imagen para cargar la imagen original
    const img = new Image()
    img.src = imageURL

    // Esperar a que la imagen se cargue
    await new Promise((resolve) => (img.onload = resolve))

    // Obtener el ancho y alto de la imagen original
    const originalWidth = img.width
    const originalHeight = img.height

    // Definir el ancho deseado (máximo 800 píxeles)
    const width = originalWidth > 800 ? 800 : originalWidth

    // Calcular el alto manteniendo la relación de aspecto
    const height = originalHeight > 600 ? 600 : originalHeight

    // Crear un lienzo para redimensionar la imagen
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')

    // Llenar el fondo del lienzo con blanco
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, width, height)

    // Redimensionar la imagen al lienzo
    ctx.drawImage(img, 0, 0, width, height)

    // Convertir el lienzo a un Blob
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob)
      }, 'image/jpeg', 0.9) // Cambia 'image/jpeg' y 0.9 según el formato y la calidad que desees
    })
  } catch (error) {
    console.error('Error al redimensionar la imagen:', error)
    return null
  }
}
