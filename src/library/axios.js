import axios from 'axios'

// Hacer una funcion reutilizable para hacer peticiones al servidor
export const makeRequest = axios.create({
  baseURL: 'http://localhost:7000/api',
  withCredentials: true,
  headers: {
    'x-access-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzIsImlhdCI6MTY5MjQyNDcxMH0.Xqle7Q4O89ylqMMgFnO3xe9ZQkposPJVBBGvcZT3PZk'
  }
})
