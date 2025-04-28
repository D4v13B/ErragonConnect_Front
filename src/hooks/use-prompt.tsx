import { getPrompt } from "@/core/api/prompt/getPrompt"
import { useEffect, useState } from "react"
import { savePromptAction } from "@/core/api/prompt/savePrompt"

const usePrompt = () => {
  const [prompt, setPrompt] = useState<string | undefined>(undefined)

  const savePrompt = async () => {
    try {
      if (!prompt) return

      const res = await savePromptAction(prompt)

      return res
    } catch (err) {
      throw new Error(`${err}`)
      return undefined
    }
  }

  useEffect(() => {
    const getPromptData = async () => {
      try {
        const prompt = await getPrompt()

        setPrompt(prompt?.prompt)
      } catch (error) {
        console.error(error)
      }
    }
    getPromptData()
  }, [])

  return {
    prompt,
    setPrompt,
    savePrompt,
  }
}
export default usePrompt

// toast({
//   title: "Se ha actualizado el prompt",
//   description: `${res?.msg}`
// })

// toast({
//   title: "Error al actualizar el prompt",
//   description: `${err}`,
//   variant: "destructive",
// })
