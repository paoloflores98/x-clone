"use client"
import { useState } from "react"
import Image from "./Image"
import NextImage from "next/image"
import { shareAction } from "@/actions"
import { ImageEditor } from "./ImageEditor"

export default function Share() {
  const [media, setMedia] = useState<File | null>(null) // Retorna un archivo o null
  const [isEditorOpen, setIsEditorOpen] = useState(false) // Editor de la imagen previa
  const [settings, setSettings] = useState<{ // Retorna un objeto con las propiedades type y sensitive
    type: "original" | "wide" | "square"
    sensitive: boolean
  }>({
    type: "original",
    sensitive: false,
  })

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => { // Inferencia de VS Code
    if (e.target.files && e.target.files[0]) { // Verificar si existe la propiedad files y que exista al menos un archivo en el array
      setMedia(e.target.files[0])
    }
  }

  const previewURL = media ? URL.createObjectURL(media) : null

  return (
    <form
      className="p-4 flex gap-4"
      action={(formData) => shareAction(formData, settings)}
    >
      {/* Avatar */}
      <div className="relative w-10 h-10 rounded-full overflow-hidden">
        <Image path="general/avatar.png" alt="" w={100} h={100} tr={true} />
      </div>

      {/* Otros */}
      <div className="flex-1 flex flex-col gap-4">
        <input
          type="text"
          name="desc"
          className="bg-transparent outline-none placeholder:text-textGray text-xl"
          placeholder="¡¿Qué está pasando?!"
        />

        {/* Imagen previa */}
        {media?.type.includes("image") && previewURL && ( // Verificar si el archivo es una imagen
          <div className="relative rounded-xl overflow-hidden">
            <NextImage
              className={`w-full ${
                settings.type === "original"
                  ? "h-full object-contain"
                  : settings.type === "square"
                  ? "aspect-square object-cover"
                  : "aspect-video object-cover"
              }`}
              src={previewURL}
              alt=""
              width={600}
              height={600}
            />
            <div
              className="absolute top-2 left-2 bg-black bg-opacity-50 text-white py-1 px-4 rounded-full font-bold text-sm cursor-pointer"
              onClick={() => setIsEditorOpen(true)}
            >Editar</div>
            <div
              className="absolute top-2 right-2 bg-black bg-opacity-50 text-white h-8 w-8 flex items-center justify-center rounded-full cursor-pointer font-bold text-sm"
              onClick={() => setMedia(null)}
            >X</div>
          </div>
        )}

        {/* Video previo */}
        {media?.type.includes("video") && previewURL && ( // Verificar si el archivo es un video
          <div className="relative">
            <video src={previewURL} controls />
            <div
              className="absolute top-2 right-2 bg-black bg-opacity-50 text-white h-8 w-8 flex items-center justify-center rounded-full cursor-pointer font-bold text-sm"
              onClick={() => setMedia(null)}
            >X</div>
          </div>
        )}

        {isEditorOpen && previewURL && (
          <ImageEditor // Componente
            onClose={() => setIsEditorOpen(false)}
            previewURL={previewURL}
            settings={settings}
            setSettings={setSettings}
          />
        )}

        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex gap-4 flex-wrap">
            <input
              type="file"
              className="hidden"
              name="file"
              id="file"
              onChange={handleMediaChange}
              accept="image/*,video/*" // Permitir imágenes y videos
            />
            <label htmlFor="file">
              <Image className="cursor-pointer" path="icons/image.svg" alt="" w={20} h={20} /> {/* Componente */}
            </label>
            <Image className="cursor-pointer" path="icons/gif.svg" alt="" w={20} h={20} /> {/* Componente */}
            <Image className="cursor-pointer" path="icons/poll.svg" alt="" w={20} h={20} /> {/* Componente */}
            <Image className="cursor-pointer" path="icons/emoji.svg" alt="" w={20} h={20} /> {/* Componente */}
            <Image className="cursor-pointer" path="icons/schedule.svg" alt="" w={20} h={20} /> {/* Componente */}
            <Image className="cursor-pointer" path="icons/location.svg" alt="" w={20} h={20} /> {/* Componente */}
          </div>
          <button className="bg-white text-black font-bold rounded-full py-2 px-4 cursor-pointer">Post</button>
        </div>
      </div>
    </form>
  )
}