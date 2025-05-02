import { RolResponse } from "@/hooks/use-roles"
import { erragonApi } from "../erragonApi"

export const getRolesApi = async ():Promise<RolResponse[] | null> => {
  try {
    const { data } = await erragonApi().get<RolResponse[]>("/roles")

    if(!data) return null

    return data
  } catch (error) {
    throw new Error(`${error}`)
  }
}
