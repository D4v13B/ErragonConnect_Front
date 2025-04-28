import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

import { Switch } from "@/components/ui/switch"
import { Bot } from "lucide-react"
import usePrompt from "@/hooks/use-prompt"

export default function ConfigPage() {
  // const [aiPrompt, setAiPrompt] = useState("");
  const { prompt, setPrompt, savePrompt } = usePrompt()
  const [autoRespond, setAutoRespond] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  const handleSave = async () => {
    setIsSaving(true)

    // Simulate API call
    const res = await savePrompt()

    if (res?.msg) {
      setIsSaving(false)
      toast({
        title: "Configuracion guardada",
        description: "Los ajusted de tu agente han sido guardados.",
      })

      return
    }

    toast({
      title: "No se ha logrado enviar el prompt",
      description: `${res?.err}`,
      variant: "destructive",
    })
    setIsSaving(false)
  }

  return (
    <div className=" w-full py-10">
      <div className="mb-10 flex items-center">
        <div className="rounded-full bg-primary/10 p-3 mr-4">
          <Bot className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">AI Configuration</h1>
          <p className="text-muted-foreground">Configura tu asistente de IA</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configuración del agente</CardTitle>
          <CardDescription>
            Configura como va a responder a tus clientes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-respond">
                Respuesta automática a mensajes
              </Label>
              <Switch
                id="auto-respond"
                checked={autoRespond}
                onCheckedChange={setAutoRespond}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Cuando activas esto, la IA responderá automáticamente.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="prompt">AI Prompt</Label>
            <Textarea
              id="prompt"
              placeholder="Introducir instrucciones de como responderá tu agente..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[200px]"
            />
            <p className="text-sm text-muted-foreground">
              Este prompt, instruye a la IA de como responderá. Se específico
              acerca del tono, conocimiento y demás
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          {/* <Button variant="outline">Reset</Button> */}
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
