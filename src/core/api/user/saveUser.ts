import { User } from "@/context/auth-context"
import { erragonApi } from "../erragonApi"

export const saveUser = async (payload: User): Promise<User> => {
  const { email, password, rolId, usuario, nombre } = payload

  console.log(payload);
  

  const { data } = await erragonApi().post<User>("/usuario", {
    email,
    password,
    rolId,
    usuario,
    nombre,
    verificado: true,
  })

  return data
}
