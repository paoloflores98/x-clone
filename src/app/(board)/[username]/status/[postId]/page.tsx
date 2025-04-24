import Comments from "@/components/Comments"
import Image from "@/components/Image"
import Post from "@/components/Post"
import { prisma } from "@/prisma"
import { auth } from "@clerk/nextjs/server"
import Link from "next/link"
import { notFound } from "next/navigation"

interface Props {
  params: Promise<{
    username: string
    postId: string
  }>
}

export default async function StatusPage({ params }: Props) {
  const { userId } = await auth() // Obtener el ID del usuario desde Clerk
  const { postId } = await params

  if (!userId) return

  const post = await prisma.post.findFirst({
    where: {
      id: Number(postId)
    },
    include: {
      user: { select: { displayName: true, username: true, img: true } },
      _count: { select: { likes: true, rePosts: true, comments: true } },
      likes: { where: { userId: userId, }, select: { id: true } },
      rePosts: { where: { userId: userId, }, select: { id: true } },
      saves: { where: { userId: userId, }, select: { id: true } },
      comments: {
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { displayName: true, username: true, img: true } },
          _count: { select: { likes: true, rePosts: true, comments: true } },
          likes: { where: { userId: userId, }, select: { id: true } },
          rePosts: { where: { userId: userId, }, select: { id: true } },
          saves: { where: { userId: userId, }, select: { id: true } },
        }
      }
    },
  })

  if (!post) return notFound() // Retornar a la página de No encontrado de Next.js

  return (
    <div className="">
      <div className="flex items-center gap-8 sticky top-0 backdrop-blur-md p-4 z-10 bg-[#00000084]">
        <Link href="/">
          <Image path="icons/back.svg" alt="back" w={24} h={24} />
        </Link>
        <h1 className="font-bold text-lg">Post</h1>
      </div>

      <Post type="status" post={post} /> {/* Componente */}

      <Comments // Componente
        comments={post.comments}
        postId={post.id}
        username={post.user.username}
      />
    </div>
  )
}