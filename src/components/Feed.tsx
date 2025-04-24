import { prisma } from "@/prisma"
import Post from "./Post"
import { auth } from "@clerk/nextjs/server"
import InfiniteFeed from "./InfiniteFeed"

interface Props {
  userProfileId?: string
}

export default async function Feed({ userProfileId }: Props) {
  const { userId } = await auth() // Obtener el ID del usuario desde Clerk

  // Verificar si el ID del usuario existe
  if (!userId) return

  const whereCondition = userProfileId
    ? { // Mostrar los posts del usuario correspondiente
      parentPostId: null, // No obtener comentarios
      userId: userProfileId
    }
    : { // Mostrar los posts del usuario correspondiente y de los usuarios seguidos
      parentPostId: null, // No obtener comentarios
      userId: {
        in: [
          userId,
          ...(
            await prisma.follow.findMany({
              where: { followerId: userId },
              select: { followingId: true }, // Obtener los usuarios que sigue el usuario autenticado
            }) // Devuelve un array de objetos de usuarios seguidos. Ej.: [{followingId: 'user2'}, {followingId: 'user3'}]
          ).map((follow) => follow.followingId), // Devuelve un array de usuarios seguidos. Ej.: ['user2', 'user3']
        ],
      },
    }

  const postIncludeQuery = {
    user: { select: { displayName: true, username: true, img: true } },
    _count: { select: { likes: true, rePosts: true, comments: true } },
    likes: { where: { userId: userId, }, select: { id: true } },
    rePosts: { where: { userId: userId, }, select: { id: true } },
    saves: { where: { userId: userId, }, select: { id: true } },
  }

  const posts = await prisma.post.findMany({
    where: whereCondition,
    include: {
      rePost: {
        include: postIncludeQuery
      },
      ...postIncludeQuery
    },
    take: 3, // Obtener los primeros 3 elementos
    skip: 0, // Omitir 0 elementos
    orderBy: {
      createdAt: "desc"
    }
  })

  return (
    <div className="">
      {posts.map(post => (
        <div key={post.id}>
          <Post post={post} /> {/* Componente */}
        </div>
      ))}

      <InfiniteFeed userProfileId={userProfileId} /> {/* Componente */}
    </div>
  )
}