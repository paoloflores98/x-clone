"use client"
import { useUser } from "@clerk/nextjs"
import Image from "./Image"
import Post from "./Post"
import { Post as PostType } from "@prisma/client"
import { useActionState, useEffect } from "react"
import { addComment } from "@/action"
import { socket } from "@/socket"

type CommentWithDetails = PostType & {
  user: {
    displayName: string | null
    username: string
    img: string | null
  }
  _count: {
    likes: number
    rePosts: number
    comments: number
  }
  likes: { id: number }[]
  rePosts: { id: number }[]
  saves: { id: number }[]
}

interface Props {
  comments: CommentWithDetails[]
  postId: number
  username: string
}

export default function Comments({ comments, postId, username }: Props) {
  // user: Objeto con información del usuario autenticado
  const { user } = useUser()

  /**
   * state: Contiene el estado del server action. Puede tener un estado de success o error
   * formAction: Valor que se utiliza para manejar el server action en el formulario
   * isPending: Booleano si el server action está en proceso de ejecución
   * addComment: Server action que se va a ejecutar
   * {success: false, error: false}: Estado inicial del server action
   */
  const [state, formAction, isPending] = useActionState(addComment, { success: false, error: false })

  useEffect(() => {
    if (state.success) {
      // Socket.io
      socket.emit("sendNotification", {
        receiverUsername: username, // Autor del post
        data: {
          senderUsername: user?.username, // Usuario que comenta
          type: "comment", // Tipo de notificación o evento
          link: `/${username}/status/${postId}`, // URL para ver el comentario
        },
      })
    }

  }, [state.success, username, user?.username, postId])

  return (
    <div className="">
      {user && (
        <form
          className="flex items-center justify-between gap-4 p-4"
          action={formAction}
        >
          <div className="relative w-10 h-10 rounded-full overflow-hidden -z-10">
            <Image
              src={user?.imageUrl}
              alt="Lama Dev"
              w={100}
              h={100}
              tr={true}
            />
          </div>
          <input type="number" name="postId" hidden readOnly value={postId} />
          <input type="text" name="username" hidden readOnly value={username} />
          <input type="text" name="desc" className="flex-1 bg-transparent outline-none p-2 text-xl" placeholder="Envía tu respuesta" />
          <button
            className="py-2 px-4 font-bold bg-white text-black rounded-full disabled:cursor-not-allowed disabled:bg-slate-200"
            disabled={isPending}
          >
            {isPending ? "Respondiendo" : "Responder"}
          </button>
        </form>
      )}
      {state.error && (
        <span className="text-red-300 p-4">¡Algo salió mal!</span>
      )}

      {comments.map(comment => (
        <div key={comment.id}>
          <Post post={comment} type="comment" /> {/* Componente */}
        </div>
      ))}
    </div>
  )
}