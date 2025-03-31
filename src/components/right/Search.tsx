import Image from "../Image"

export default function Search() {
  return (
    <div className='bg-inputGray py-2 px-4 flex items-center gap-4 rounded-full'>
      <Image path="icons/explore.svg" alt="buscar" w={16} h={16} /> {/* Componente */}
      <input type="text" placeholder="Buscar" className="bg-transparent outline-none placeholder:text-textGray"/>
    </div>
  )
}