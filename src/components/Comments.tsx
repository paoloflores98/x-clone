import Image from "./Image"
import Post from "./Post"
import { Post as PostType } from "@prisma/client"

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
  return (
    <div className="">
      <form className="flex items-center justify-between gap-4 p-4">
        <div className="relative w-10 h-10 rounded-full overflow-hidden">
          <Image path="general/avatar.png" alt="Lama Dev" w={100} h={100} tr={true} />
        </div>
        <input type="text" className="flex-1 bg-transparent outline-none p-2 text-xl" placeholder="Envía tu respuesta" />
        <button className="py-2 px-4 font-bold bg-white text-black rounded-full">Responder</button>
      </form>

      {comments.map(comment => (
        <div key={comment.id}>
          <Post post={comment} type="comment" /> {/* Componente */}
        </div>
      ))}
    </div>
  )
}