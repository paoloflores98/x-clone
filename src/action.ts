"use server"

import { auth } from "@clerk/nextjs/server"
import { prisma } from "./prisma"

/* Repostear un post */
export const rePost = async (postId: number) => {
  const { userId } = await auth()

  if (!userId) return

  // Repost del usuario en el post
  const existingRePost = await prisma.post.findFirst({
    where: {
      userId: userId,
      rePostId: postId,
    },
  })

  // Verificar si existe el repost en el post
  if (existingRePost) {
    await prisma.post.delete({
      where: { id: existingRePost.id },
    })
  } else {
    await prisma.post.create({
      data: { userId, rePostId: postId },
    })
  }
}

/* Dar me gusta un post */
export const likePost = async (postId: number) => {
  const { userId } = await auth()
  
  if (!userId) return
  
  // Like del usuario en el post
  const existingLike = await prisma.like.findFirst({
    where: {
      userId: userId,
      postId: postId,
    },
  })
  
  // Verificar si existe el like en el post
  if (existingLike) {
    await prisma.like.delete({
      where: { id: existingLike.id }
    })
  } else {
    await prisma.like.create({
      data: { userId, postId }
    })
  }
}

/* Guardar un post */
export const savePost = async (postId: number) => {
  const { userId } = await auth()
  
  if (!userId) return

  // Guardado del usuario en el post
  const existingSavedPost = await prisma.savedPosts.findFirst({
    where: {
      userId: userId,
      postId: postId,
    },
  })

  // Verificar si existe el guardado en el post
  if (existingSavedPost) {
    await prisma.savedPosts.delete({
      where: { id: existingSavedPost.id },
    })
  } else {
    await prisma.savedPosts.create({
      data: { userId, postId },
    })
  }
}