import "./globals.css"
import LeftBar from "@/components/LeftBar"
import RightBar from "@/components/RightBar"
import { ClerkProvider } from "@clerk/nextjs"

export default function RootLayout({
  children,
  modal // Aplicando rutas paralelas con el nombre de la carpeta que empieza con '@'
}: Readonly<{
  children: React.ReactNode
  modal: React.ReactNode
}>) {
  return (
    // Proveedor Clerk
    <ClerkProvider>
      <html lang="en">
        <body>
          <div className="max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl xxl:max-w-screen-xxl mx-auto flex justify-between">
            <div className="px-2 xsm:px-4 xxl:px-8">
              <LeftBar /> {/* Componente */}
            </div>

            <div className="flex-1 lg:min-w-[600px] border-x-[1px] border-borderGray">
              {children}
              {modal}
            </div>

            <div className="hidden lg:flex ml-4 md:ml-8 flex-1">
              <RightBar /> {/* Componente */}
            </div>
          </div>
        </body>
      </html>
    </ClerkProvider>
  )
}