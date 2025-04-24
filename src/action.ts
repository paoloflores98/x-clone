"use server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "./prisma"
import { z } from "zod"
import { revalidatePath } from "next/cache"
import { UploadResponse } from "imagekit/dist/libs/interfaces"
import { imagekit } from "./utils"

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

/* Seguir a un usuario */
export const followUser = async (targetUserId: string) => {
  const { userId } = await auth()

  if (!userId) return

  // Seguir del usuario
  const existingFollow = await prisma.follow.findFirst({
    where: {
      followerId: userId,
      followingId: targetUserId,
    },
  })

  // Verificar si existe el seguir en el usuario
  if (existingFollow) {
    await prisma.follow.delete({
      where: { id: existingFollow.id }
    })
  } else {
    await prisma.follow.create({
      data: { followerId: userId, followingId: targetUserId }
    })
  }
}

/* Agregar un comentario al post */
export const addComment = async (prevState: { success: boolean; error: boolean }, formData: FormData) => { // prevState: Estado anterior de la acción, y es opcional si no se necesita gestionar el flujo previo
  const { userId } = await auth()

  // Verificar si el usuario está autenticado
  if (!userId) return { success: false, error: true }

  // Obtener los datos del formulario mediante el atributo name
  const postId = formData.get("postId")
  const username = formData.get("username")
  const desc = formData.get("desc")

  const CommentSchema = z.object({
    parentPostId: z.number(),
    desc: z.string().max(140),
  })

  const validatedFields = CommentSchema.safeParse({
    parentPostId: Number(postId),
    desc,
  })

  // Verificar si el esquema falló
  if (!validatedFields.success) return { success: false, error: true }
  
  try {
    await prisma.post.create({
      data: {
        ...validatedFields.data,
        userId,
      },
    })
    revalidatePath(`/${username}/status/${postId}`) // Revalidar el path

    return { success: true, error: false }
  } catch (err) {
    console.log("Error", err)

    return { success: false, error: true }
  }
}

/* Agregar un post desde el home */
export const addPost = async (prevState: { success: boolean; error: boolean }, formData: FormData) => { // prevState: Estado anterior de la acción, y es opcional si no se necesita gestionar el flujo previo
  const { userId } = await auth()

  // Verificar si el usuario está autenticado
  if (!userId) return { success: false, error: true }

  // Obtener los datos del formulario mediante el atributo name
  const desc = formData.get("desc")
  const file = formData.get("file") as File
  const isSensitive = formData.get("isSensitive") as string
  const imgType = formData.get("imgType")

  const uploadFile = async (file: File): Promise<UploadResponse> => {
    const bytes = await file.arrayBuffer() // Convertir el archivo a binario de manera asíncrona
    const buffer = Buffer.from(bytes) // Convertir el binario a un Buffer (Formato que espera ImageKit)
    const transformation = `w-600,${imgType === "square"
      ? "ar-1-1"
      : imgType === "wide"
        ? "ar-16-9"
        : ""
    }`

    return new Promise((resolve, reject) => {
      imagekit.upload(
        {
          file: buffer, // Pasar el buffer del archivo
          fileName: file.name, // Usar el nombre original del archivo
          folder: "/posts", // Especificar la carpeta en ImageKit
          ...(file.type.includes("image") && { // Aplicar la transformación si el archivo es una imagen
            transformation: {
              pre: transformation, // Previsualización del archivo
            },
          }),
        },
        function (error, result) {
          if (error) reject(error)
          else resolve(result as UploadResponse)
        }
      )
    })
  }

  const PostSchema = z.object({
    desc: z.string().max(140),
    isSensitive: z.boolean().optional(),
  })

  const validatedFields = PostSchema.safeParse({
    desc,
    isSensitive: JSON.parse(isSensitive),
  })

  // Verificar si el esquema falló
  if (!validatedFields.success) return { success: false, error: true }

  let img = ""
  let imgHeight = 0
  let video = ""

  // Verificar si el archivo tiene tamaño
  if (file.size) {
    const result: UploadResponse = await uploadFile(file)

    if (result.fileType === "image") {
      img = result.filePath
      imgHeight = result.height
    } else {
      video = result.filePath
    }
  }

  try {
    await prisma.post.create({
      data: {
        ...validatedFields.data,
        userId,
        img,
        imgHeight,
        video,
      },
    })

    revalidatePath(`/`) // Revalidar el path

    return { success: true, error: false }
  } catch (err) {
    console.log("Error", err)

    return { success: false, error: true }
  }
}