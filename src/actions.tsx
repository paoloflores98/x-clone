"use server"
import { imagekit } from "./utils"

interface SettingsProps {
  type: "original" | "wide" | "square"
  sensitive: boolean 
}

export const shareAction = async (formData: FormData, settings: SettingsProps) => {
  const file = formData.get("file") as File
  // const desc = formData.get("desc") as string

  const bytes = await file.arrayBuffer() // Convertir el archivo a binario de manera asíncrona
  const buffer = Buffer.from(bytes) // Convertir el binario a un Buffer (Formato que espera ImageKit)
  const transformation = `w-600, ${
    settings.type === "square"
      ? "ar-1-1"
      : settings.type === "wide"
      ? "ar-16-9"
      : ""
  }`

  imagekit.upload(
    {
      file: buffer, // Pasar el buffer del archivo
      fileName: file.name, // Usar el nombre original del archivo
      folder: "/posts", // Especificar la carpeta en ImageKit
      ...(file.type.includes("image") && { // Aplicar la transformación si el archivo es una imágen
        transformation: {
          pre: transformation, // Previsualización del archivo
        },
      }),
      customMetadata: { // Metadato personalizado desde ImageKit
        sensitive: settings.sensitive
      }
    },
    function (error, result) {
      if (error) console.log('Error:', error)
      else console.log('Resultado:', result)
    }
  )
}