import Image from "./Image"

export default function PostInfo() {
  return (
    <div className="cursor-pointer w-4 h-4 relative">
      <Image // Componente
        path="icons/infoMore.svg"
        alt=""
        w={16}
        h={16}
      />
    </div>
  )
}