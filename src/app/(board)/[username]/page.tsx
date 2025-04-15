import Feed from "@/components/Feed"
import FollowButton from "@/components/FollowButton"
import Image from "@/components/Image"
import { prisma } from "@/prisma"
import { auth, User } from "@clerk/nextjs/server"
import Link from "next/link"
import { notFound } from "next/navigation"

interface Props {
  params: Promise<{
    username: string
  }>
}

export default async function UserPage({ params }: Props) {
  const { username } = await params
  const { userId } = await auth() // Obtener el ID del usuario desde Clerk
  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      _count: { select: { followers: true, followings: true } },
      followings: userId ? { where: { followerId: userId } } : undefined
    }
  })

  console.log("ID", userId)
  // Verificar si el usuario no existe. Ej.: http://localhost:3000/martin
  if (!user) return notFound()

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
        <h1 className="font-bold text-lg">{user.displayName}</h1>
      </div>

      {/* Infor */}
      <div className="">
        {/* Portada y contenedor de avatares */}
        <div className="relative w-full">
          {/* Portada */}
          <div className="w-full aspect-[3/1] relative">
            <Image path={user.cover || "general/noCover.png"} alt="" w={600} h={200} tr={true} /> {/* Componente */}
          </div>

          {/* Avatar */}
          <div className="w-1/5 aspect-square rounded-full overflow-hidden border-4 border-black bg-gray-300 absolute left-4 -translate-y-1/2">
            <Image path={user.img || "general/noAvatar.png"} alt="" w={100} h={100} tr={true} /> {/* Componente */}
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
            
            {userId && 
              <FollowButton // Componente
                userId={user.id}
                isFollowed={!!user.followings.length}
              /> 
            }
          </div>

          {/* Detalles del usuario */}
          <div className="p-4 flex flex-col gap-2">
            {/* Nombre de usuario y Handle */}
            <div className="">
              <h1 className="text-2xl font-bold">{user.displayName}</h1>
              <span className="text-textGray text-sm">@{user.username}</span>
            </div>
            {user.bio && <p>{user.bio} Channel</p>}
            {/* Puesto, Lugar y Fecha */}
            <div className="flex gap-4 text-textGray text-[15px]">
              {user.location && (
                <div className="flex items-center gap-2">
                  <Image // Componente
                    path="icons/userLocation.svg"
                    alt="location"
                    w={20}
                    h={20}
                  />
                  <span>{user.location}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Image // Componente
                  path="icons/date.svg"
                  alt="date"
                  w={20}
                  h={20}
                />
                <span>Se unió en {new Date(user.createdAt.toString()).toLocaleDateString(
                  "es-ES", {
                    month: "long", year: "numeric"
                    }
                  )}</span>
              </div>
            </div>
            {/* Seguidores y Seguidos */}
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <span className="font-bold">{user._count.followers}</span>
                <span className="text-textGray text-[15px]">Seguidores</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold">{user._count.followings}</span>
                <span className="text-textGray text-[15px]">Siguiendo</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feed */}
      <Feed userProfileId={user.id} /> {/* Componente */}
    </div>
  )
}