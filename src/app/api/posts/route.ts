import { prisma } from "@/prisma"
import { auth } from "@clerk/nextjs/server"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl // Acceder a los parámetros URL
  const userProfileId = searchParams.get("user") // Obtener el parámetro "user"
  const page = searchParams.get("cursor") // Obtener el parámetro "cursor"
  const LIMIT = 3

  const { userId } = await auth() // Obtener el ID del usuario desde Clerk

  // Verificar si el ID del usuario existe
  if (!userId) return

  const whereCondition = userProfileId !== "undefined"
    ? { // Mostrar los posts del usuario correspondiente
      parentPostId: null, // No obtener comentarios
      userId: userProfileId as string
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

  const posts = await prisma.post.findMany({
    where: whereCondition,
    take: LIMIT,
    skip: (Number(page) - 1) * LIMIT
  })

  // Contar los posts
  const totalPosts = await prisma.post.count({
    where: whereCondition
  })

  // Verificar si se cuenta con más posts o no
  const hasMore = Number(page) * LIMIT < totalPosts

  return NextResponse.json({ posts, hasMore })
}