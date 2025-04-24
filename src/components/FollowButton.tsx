"use client"
import { followUser } from "@/action"
import { useUser } from "@clerk/nextjs"
import { useOptimistic, useState } from "react"

interface Props {
  userId: string
  isFollowed: boolean
  // username: string
}

export default function FollowButton({ userId, isFollowed }: Props) {
  const [state, setState] = useState(isFollowed)

  const { user } = useUser()

  /**
   * optimisticFollow: Mostrar los valores actualizados de la UI, incluso antes de que el servidor confirme.
   * switchOptimisticFollow: Modificar el estado de la UI antes de que el backend confirme el resultado
   * state: Estado inicial que contiene los valores originales y que se van a optimizar
   * arrow function: Actualizar el estado de manera optimista en función a si seguir o no al usuario
   */
  const [optimisticFollow, switchOptimisticFollow] = useOptimistic(
    state,
    (prev) => !prev
  )

  if (!user) return

  const followAction = async () => {
    switchOptimisticFollow("")
    await followUser(userId) // Server action que se realiza realmente en el backend
    setState((prev) => !prev)

    // Enviar notificación
    /* socket.emit("sendNotification", {
      receiverUsername: username,
      data: {
        senderUsername: user.username,
        type: "follow",
        link: `/${user.username}`,
      },
    }) */
  }

  return (
    <form action={followAction}>
      <button className="py-2 px-4 bg-white text-black font-bold rounded-full">
        {optimisticFollow ? "Dejar de seguir" : "Seguir"}
      </button>
    </form>
  )
}