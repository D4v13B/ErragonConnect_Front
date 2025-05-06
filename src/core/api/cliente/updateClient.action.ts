import { UserChat } from "@/context/chat-context"
import { erragonApi } from "../erragonApi"

export const updateClient = async (cliente: Partial<UserChat>) => {
  try {
    const { data } = await erragonApi().put("/cliente", cliente)

    return data
  } catch (error) {
    console.error(`${error}`)
  }
}
