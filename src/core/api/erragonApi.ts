import axios from "axios"

export const erragonApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL
})

//TODO INTERCEPTORS