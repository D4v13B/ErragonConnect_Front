import { ShieldX, ArrowLeft, Home } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

const Page403 = () => {

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4 dark">
      <Card className="max-w-md w-full border border-red-800/20 bg-black/60 shadow-lg backdrop-blur-sm">
        <CardHeader className="space-y-1 flex items-center justify-center pb-2">
          <div className="h-20 w-20 rounded-full bg-red-950/50 flex items-center justify-center">
            <ShieldX className="h-10 w-10 text-red-500" />
          </div>
        </CardHeader>

        <CardContent className="space-y-6 pt-4 text-center">
          <div>
            <h1 className="text-3xl font-bold text-red-500 mb-1">
              Empresa no encontrada
            </h1>
            <p className="text-xl font-semibold text-muted-foreground mb-6">
              Error 404
            </p>
          </div>

          <Alert
            variant="destructive"
            className="bg-red-950/30 border-red-800/30 text-red-300"
          >
            <AlertTitle className="mb-2">
              No puedes acceder
            </AlertTitle>
            <AlertDescription className="text-sm text-muted-foreground">
              No hay una empresa al cual dirigirse
            </AlertDescription>
          </Alert>

          <div className="space-y-3">

            <div className="flex flex-col sm:flex-row gap-2 justify-center pt-2">
              <Button
                variant="outline"
                className="flex items-center gap-2 border-red-800/20 hover:bg-red-950/30 hover:text-red-400"
                onClick={() => window.history.back()}
              >
                <ArrowLeft className="h-4 w-4" />
                Volver atrás
              </Button>

              <Button
                variant="default"
                className="flex items-center gap-2 bg-red-900 hover:bg-red-800 text-white"
                onClick={() => (window.location.href = "/")}
              >
                <Home className="h-4 w-4" />
                Ir al inicio
              </Button>
            </div>
          </div>
        </CardContent>

        {/* <CardFooter className="flex justify-center pt-2 pb-4">
          <p className="text-xs text-muted-foreground">
            Si necesitas ayuda adicional, contacta a{" "}
            <a
              href="mailto:soporte@tuempresa.com"
              className="text-red-400 hover:text-red-300 underline"
            >
              soporte@tuempresa.com
            </a>
          </p>
        </CardFooter> */}
      </Card>
    </div>
  )
}

export default Page403
