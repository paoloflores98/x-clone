"use client"

import { useClerk } from "@clerk/nextjs"
import Link from "next/link"
import { useState } from "react"

export default function Logout() {
  const [open, setOpen] = useState(false)

  // Cerrar sesión
  const { signOut } = useClerk()

  return (
    <div className="hidden xxl:block relative">
      <div
        className="cursor-pointer font-bold"
        onClick={() => setOpen((prev) => !prev)}
      >
        ...
      </div>
      {open && (
        <div className="bg-white p-4 rounded-xl absolute left-4 bottom-4 flex flex-col gap-2 w-max">
          <Link
            className="text-textGray text-sm"
            href="/profile"
            onClick={() => setOpen(false)}
          >
            Perfil del usuario
          </Link>
          <Link
            className="text-textGray text-sm"
            href="/profile"
            onClick={() => setOpen(false)}
          >
            Posts guardados
          </Link>
          <Link
            className="text-textGray text-sm"
            href="/profile"
            onClick={() => setOpen(false)}
          >
            Ajustes
          </Link>
          <hr />
          <button
            className="bg-black rounded-md px-2 py-1 cursor-pointer"
            onClick={() => signOut()}
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  )
}