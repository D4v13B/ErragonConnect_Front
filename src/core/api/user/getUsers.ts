import { User } from "@/context/auth-context"
import { erragonApi } from "../erragonApi"

/**
 * Llama a nuestra api para buscar los usuarios
 * @returns {User[]}
 */
export const getUsers = async (): Promise<User[]> => {
  try {
        
    const { data } = await erragonApi().get<User[]>("/usuario")

    return data
  } catch (error) {
    throw new Error(`${error}`)
  }
}
