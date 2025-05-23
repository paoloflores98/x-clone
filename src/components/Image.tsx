"use client"
import { IKImage } from "imagekitio-next"

interface ImageType {
  className?: string
  path?: string
  src?: string
  w?: number
  h?: number
  alt: string
  tr?: boolean // Transformation. Propio de ImageKit
}

const urlEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT

if (!urlEndpoint) {
  throw new Error('Error: Por favor, añada urlEndpoint a .env o .env.local')
}

const Image = ({ className, path, src, w, h, alt, tr }: ImageType) => {
  return (
    <IKImage
      urlEndpoint={urlEndpoint}
      className={className}
      path={path}
      src={src}
      {...(tr // Verificar si la transfomación es true o false
        ? { transformation: [{ width: `${w}`, height: `${h}` }] }
        : { width: w, height: h })}
      lqip={{ active: true, quality: 20 }}
      alt={alt}
    />
  )
}

export default Image