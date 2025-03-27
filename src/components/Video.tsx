"use client"
import { IKVideo } from "imagekitio-next"

interface VideoProps {
  path: string
  className?: string
}

const urlEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT

// Se aumentó el tamaño de subida para los videos en next.config.ts
export default function Video({ path, className }: VideoProps) {
  return (
    <IKVideo
      urlEndpoint={urlEndpoint}
      className={className}
      path={path}
      transformation={[
        { width: "1920", height: "1080", quality: 90 },
        { raw: "l-text,i-PaoloFlores,fs-100,co-white,l-end" }, // Agregar una capa de texto. https://imagekit.io/docs/integration/nextjs#adding-overlays
      ]}
      controls
    />
  )
}