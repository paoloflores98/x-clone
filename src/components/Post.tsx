import { imagekit } from "@/utils"
import Image from "./Image"
import PostInfo from "./PostInfo"
import PostInteractions from "./PostInteractions"
import Video from "./Video"

interface FileDetailsResponse {
  width: number
  height: number
  filePath: string
  url: string
  fileType: string
  customMetadata?: { sensitive: boolean }
}

export default async function Post() {
  // Obtener los medios del post
  const getFileDetails = async (fileId: string): Promise<FileDetailsResponse> => { // Retorna una promesa con la estructura FileDetailsResponse
    return new Promise((resolve, reject) => {
      imagekit.getFileDetails(fileId, function (error, result) {
        if (error) reject(error)
        else resolve(result as FileDetailsResponse)
      })
    })
  }

  const fileDetails = await getFileDetails("67e4dc7e432c47641653772a")
  console.log('Detalles del archivo:', fileDetails)

  return (
    <div className="p-4 border-y-[1px] border-borderGray">
      {/* Post type */}
      <div className="flex items-center gap-2 text-sm text-textGray mb-2 from-bold">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
        >
          <path
            fill="#71767b"
            d="M4.75 3.79l4.603 4.3-1.706 1.82L6 8.38v7.37c0 .97.784 1.75 1.75 1.75H13V20H7.75c-2.347 0-4.25-1.9-4.25-4.25V8.38L1.853 9.91.147 8.09l4.603-4.3zm11.5 2.71H11V4h5.25c2.347 0 4.25 1.9 4.25 4.25v7.37l1.647-1.53 1.706 1.82-4.603 4.3-4.603-4.3 1.706-1.82L18 15.62V8.25c0-.97-.784-1.75-1.75-1.75z"
          />
        </svg>
        <span>Lama Dev reenvió</span>
      </div>

      {/* Contenido del post */}
      <div className={`flex gap-4`}>
        {/* Avatar */}
        <div className="relative w-10 h-10 rounded-full overflow-hidden">
          <Image path="general/avatar.png" alt="" w={100} h={100} tr={true} />
        </div>

        {/* Contenido */}
        <div className="flex-1 flex flex-col gap-2">
          {/* Top */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-md font-bold">Paolo Flores</h1>
              <span className="text-textGray">@paoloflores98</span>
              <span className="text-textGray">Hace 1 día</span>
            </div>

            <PostInfo /> {/* Componente */}
          </div>

          {/* Texto y multimedia */}
          <p className="">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut corporis porro, beatae, rem dolores commodi esse, modi inventore omnis quasi eligendi maxime quibusdam. Officia explicabo ex cumque ullam, quaerat id.
          </p>

          {/* Después de obtener los medios del post */}
          {fileDetails && fileDetails.fileType === "image"
            ? (
              <Image // Componente
                className={fileDetails.customMetadata?.sensitive ? "blur-lg" : ""}
                path={fileDetails.filePath}
                alt=""
                w={fileDetails.width}
                h={fileDetails.height}
              />
            ) 
            : (
              <Video // Componente
                className={fileDetails.customMetadata?.sensitive ? "blur-lg" : ""}
                path={fileDetails.filePath}
              />
            )
          }

          <PostInteractions /> {/* Componente */}
        </div>
      </div>
    </div>
  )
}