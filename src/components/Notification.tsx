"use client"
import { useEffect, useState } from "react"
import Image from "./Image"
import { socket } from "@/socket"
import { useRouter } from "next/navigation"

type NotificationType = {
  id: string
  senderUsername: string
  type: "like" | "comment" | "rePost" | "follow"
  link: string
}

export default function Notification() {
  const [notifications, setNotifications] = useState<NotificationType[]>([])
  const [open, setOpen] = useState(false)

  useEffect(() => {
    // Socket.io
    socket.on("getNotification", (data: NotificationType) => {
      setNotifications((prev) => [...prev, data])
    })
  }, [])

  const router = useRouter()

  /**
   * Limpia todas las notificaciones
   * Cierra el dropdown
   */
  const reset = () => {
    setNotifications([])
    setOpen(false)
  }

  /**
   * Elimina esa notificación específica del estado
   * Cierra el dropdown
   * Navega a la URL relacionada
   */
  const handleClick = (notification: NotificationType) => {
    const filteredList = notifications.filter((n) => n.id !== notification.id)
    setNotifications(filteredList)
    setOpen(false)
    router.push(notification.link)
  }

  return (
    <div className="relative mb-4">
      <div
        className="cursor-pointer p-2 rounded-full hover:bg-[#181818] flex items-center gap-4"
        onClick={() => setOpen(prev => !prev)}
      >
        <div className="relative">
          <Image path="icons/notification.svg" alt="" w={24} h={24} /> {/* Componente */}

          {notifications.length > 0 && (
            <div className="absolute -top-4 -right-4 w-6 h-6 bg-iconBlue p-2 rounded-full flex items-center justify-center text-sm">
              {notifications.length}
            </div>
          )}
        </div>
        <span className="hidden xxl:inline">Notificaciones</span>
      </div>

      {open && (
        <div className="absolute -right-full p-4 rounded-lg bg-white text-black flex flex-col gap-4 w-max">
          {notifications.length > 0
            ? (
              <>
                <h1 className="text-xl text-textGray">Notificaciones</h1>

                {notifications.map(notification => (
                  <div
                    className="cursor-pointer"
                    key={notification.id}
                    onClick={() => handleClick(notification)}
                  >
                    <b>{notification.senderUsername}</b>{" "}
                    {notification.type === "like"
                      ? "le gustó tu post"
                      : notification.type === "rePost"
                        ? "reposteó tu post"
                        : notification.type === "comment"
                          ? "respondió tu post"
                          : "empezó a seguirte"
                    }
                  </div>
                ))}

                <button
                  className="bg-black text-white p-2 text-sm rounded-lg"
                  onClick={reset}
                >Marcar como leído</button>
              </>
            )
            : (
              <h1 className="text-xl text-textGray">No tiene notificaciones</h1>
            )
          }
        </div>
      )}
    </div>
  )
}