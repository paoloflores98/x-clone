import Link from "next/link"
import Image from "./Image"

const menuList = [
  {
    id: 1,
    name: "Homepage",
    link: "/",
    icon: "home.svg",
  },
  {
    id: 2,
    name: "Explore",
    link: "/",
    icon: "explore.svg",
  },
  {
    id: 3,
    name: "Notification",
    link: "/",
    icon: "notification.svg",
  },
  {
    id: 4,
    name: "Messages",
    link: "/",
    icon: "message.svg",
  },
  {
    id: 5,
    name: "Bookmarks",
    link: "/",
    icon: "bookmark.svg",
  },
  {
    id: 6,
    name: "Jobs",
    link: "/",
    icon: "job.svg",
  },
  {
    id: 7,
    name: "Communities",
    link: "/",
    icon: "community.svg",
  },
  {
    id: 8,
    name: "Premium",
    link: "/",
    icon: "logo.svg",
  },
  {
    id: 9,
    name: "Profile",
    link: "/",
    icon: "profile.svg",
  },
  {
    id: 10,
    name: "More",
    link: "/",
    icon: "more.svg",
  },
];

export default function LeftBar() {
  return (
    <div className="h-screen sticky top-0 flex flex-col justify-between pt-2 pb-8">
      {/* Menú */}
      <div className="flex flex-col gap-4 text-lg items-center xxl:items-start">
        {/* Logo */}
        <Link className="p-2 rounded-full hover:bg-[#181818]" href="/">
          <Image // Componente
            path="icons/logo.svg"
            alt="logo"
            w={24}
            h={24}
          />
        </Link>

        {/* Lista del menú */}
        <div className="flex flex-col gap-4">
          {menuList.map((item) => (
            <Link
              className="p-2 rounded-full hover:bg-[#181818] flex items-center gap-4"
              href={item.link}
              key={item.id}
            >
              <Image // Componente
                path={`icons/${item.icon}`}
                alt={item.name}
                w={24}
                h={24}
              />
              <span className="hidden xxl:inline">{item.name}</span>
            </Link>
          ))}
        </div>

        {/* Botón Post */}
        <Link
          className="xxl:hidden bg-white text-black rounded-full w-12 h-12 flex items-center justify-center"
          href="/compose/post"
        >
          <Image // Componente
            path="icons/post.svg"
            alt="new post"
            w={24}
            h={24}
          />
        </Link>

        <Link
          className="hidden xxl:block bg-white text-black rounded-full font-bold py-2 px-20"
          href="/compose/post"
        >Post</Link>
      </div>

      {/* Usuario */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 relative rounded-full overflow-hidden">
            <Image // Componente
              path="/general/avatar.png"
              alt="Paolo Flores"
              w={100}
              h={100}
              tr={true}
            />
          </div>
          <div className="hidden xxl:flex flex-col">
            <span className="font-bold">Paolo Flores</span>
            <span className="text-sm text-textGray">@paoloflores98</span>
          </div>
        </div>
        <div className="hidden xxl:block cursor-pointer font-bold">...</div>
      </div>
    </div>
  )
}