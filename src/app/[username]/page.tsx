import Feed from "@/components/Feed"
import Image from "@/components/Image"
import Link from "next/link"

export default function UserPage() {
  return (
    <div className="">
      {/* Título del perfil */}
      <div className="flex items-center gap-8 sticky top-0 backdrop-blur-md p-4 z-10 bg-[#00000084]">
        <Link href="/">
          <Image // Componente
            path="icons/back.svg"
            alt="back"
            w={24}
            h={24}
          />
        </Link>
        <h1 className="font-bold text-lg">Post</h1>
      </div>

      {/* Infor */}
      <div className="">
        {/* Portada y contenedor de avatares */}
        <div className="relative w-full">
          {/* Portada */}
          <div className="w-full aspect-[3/1] relative">
            <Image path="general/cover.jpg" alt="" w={600} h={200} tr={true} /> {/* Componente */}
          </div>

          {/* Avatar */}
          <div className="w-1/5 aspect-square rounded-full overflow-hidden border-4 border-black bg-gray-300 absolute left-4 -translate-y-1/2">
            <Image path="general/avatar.png" alt="" w={100} h={100} tr={true} /> {/* Componente */}
          </div>

          {/* Enlaces */}
          <div className="flex w-full items-center justify-end gap-2 p-2">
            <div className="w-9 h-9 flex items-center justify-center rounded-full border-[1px] border-gray-500 cursor-pointer">
              <Image path="icons/more.svg" alt="" w={20} h={20} /> {/* Componente */}
            </div>
            <div className="w-9 h-9 flex items-center justify-center rounded-full border-[1px] border-gray-500 cursor-pointer">
              <Image path="icons/explore.svg" alt="" w={20} h={20} /> {/* Componente */}
            </div>
            <div className="w-9 h-9 flex items-center justify-center rounded-full border-[1px] border-gray-500 cursor-pointer">
              <Image path="icons/message.svg" alt="" w={20} h={20} /> {/* Componente */}
            </div>
            <button className="py-2 px-4 bg-white text-black font-bold rounded-full">Seguir</button>
          </div>

          {/* Detalles del usuario */}
          <div className="p-4 flex flex-col gap-2">
            {/* Nombre de usuario y Handle */}
            <div className="">
              <h1 className="text-2xl font-bold">Lama Dev</h1>
              <span className="text-textGray text-sm">@lamaWebDev</span>
            </div>
            <p>Lama Dev Youtube Channel</p>
            {/* Puesto, Lugar y Fecha */}
            <div className="flex gap-4 text-textGray text-[15px]">
              <div className="flex items-center gap-2">
                <Image // Componente
                  path="icons/userLocation.svg"
                  alt="location"
                  w={20}
                  h={20}
                />
                <span>USA</span>
              </div>
              <div className="flex items-center gap-2">
                <Image // Componente
                  path="icons/date.svg"
                  alt="date"
                  w={20}
                  h={20}
                />
                <span>Joined May 2021</span>
              </div>
            </div>
            {/* Seguidores y Seguidos */}
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <span className="font-bold">100</span>
                <span className="text-textGray text-[15px]">Followers</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold">100</span>
                <span className="text-textGray text-[15px]">Followings</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feed */}
      <Feed /> {/* Componente */}
    </div>
  )
}