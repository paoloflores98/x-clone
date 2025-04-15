"use client"

interface Props {
  userId: string
  isFollowed: boolean
}

export default function FollowButton({ userId, isFollowed }: Props) {
  return (
    <button className="py-2 px-4 bg-white text-black font-bold rounded-full">
      {isFollowed ? "Dejar de seguir" : "Seguir"}
    </button>
  )
}