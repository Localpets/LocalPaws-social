import axios from 'axios'

// Hacer una funcion reutilizable para hacer peticiones al servidor
export const makeRequest = axios.create({
  baseURL: 'http://localhost:8080/api/',
  withCredentials: true
})
