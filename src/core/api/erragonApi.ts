import axios from "axios"

export const erragonApi = () => {
  const urlApi = localStorage.getItem("api_url")
  if (!urlApi) throw new Error("API URL not set")

  return axios.create({
    baseURL: urlApi,
  })
}

//TODO INTERCEPTORS
