import { erragonApi } from "../erragonApi"
import { genericResponse } from "../types"

export const savePromptAction = async(prompt: string) => {
  try {
      const {data} = await erragonApi().post<genericResponse>("/prompt", {
        prompt
      })

      if(!data) return null

      return data
  } catch (error) {
    console.error(error)
    return null
  }
}