export interface AuthResponse {
  id: number
  nombre: string
  email: string
  rolId: number
  rol: string
  token: string
}

export interface GenericResponse {
  msg?: string
  error?: string
  response?: {
    data?: {
      error?: {
        errors?: MyError[]
      }
    }
  }
}

interface MyError {
  type: string
  msg: string
  path: string
  location: string
}
