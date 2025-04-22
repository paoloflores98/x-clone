"use client"
import { useInfiniteQuery } from "@tanstack/react-query"
import InfiniteScroll from "react-infinite-scroll-component"
import Post from "./Post"

interface Props {
  userProfileId?: string
}

const fetchPosts = async (pageParam: number, userProfileId?: string) => {
  const response = await fetch(`http://localhost:3000/api/posts?cursor=${pageParam}&user=${userProfileId}`)
  // const response = await fetch(`https://abf5-38-253-148-65.ngrok-free.app/api/posts?cursor=${pageParam}&user=${userProfileId}`)

  return response.json()
}

export default function InfiniteFeed({ userProfileId }: Props) {
  /**
   * data: Contiene todas las páginas cargadas. Es un objeto con { pages, pageParams }. Cada page es una respuesta de la API
   * error: Si ocurre un error durante la carga de cualquier página, aquí se guarda el objeto de error
   * status: Es una cadena con el estado de la consulta: "loading", "success" o "error"
   * hasNextPage: Es true si getNextPageParam devuelve un valor. Es false si ya no hay más páginas para cargar
   * fetchNextPage: Función que se llama para cargar la siguiente página. Se dispara cuando el usuario hace scroll hasta el final
   
   * queryKey: Identifica esta consulta en la caché de React Query
   * queryFn: Función que obtiene los datos
   * initialPageParam: Valor inicial para pageParam. Se empieza desde 2 porque la página 1 se carga en el componente Feed.tsx
   * getNextPageParam: Decide qué valor pasar como pageParam en la siguiente llamada

   * lastPage: Respuesta de la última página cargada (lo que devuelve tu queryFn)
   * allPages: Array con todas las páginas que se han cargado hasta ahora
   */
  const { data, error, status, hasNextPage, fetchNextPage } = useInfiniteQuery({ // Aplicar consultas infinitas con useInfiniteQuery
    queryKey: ['posts'],
    // queryFn: ({ pageParam = 2 }) => fetchPosts(pageParam, userProfileId), // Se coloca 2 porque en el componente Feed.tsx trae la primera página de 3 elementos
    queryFn: ({ pageParam }) => fetchPosts(pageParam, userProfileId),
    initialPageParam: 2,
    getNextPageParam: (lastPage, allPages) => lastPage.hasMore ? allPages.length + 2 : undefined // hasMore viene de la respuesta de la API y se suma +2 poruqe se empezó desde el 2
  })

  if(error) return "¡Ha ocurrido un error!"
  if(status === "pending") return "Cargando..."

  console.log("Datos", data)

  // flatMap: Mapear cada elemento y luego aplanar el resultado Ej.: [[1, 2], [3, 4]] => [1, 2, 3, 4]
  // data.pages es un array de páginas (Objetos), parte de useInfiniteQuery. Cada page tiene un array de posts
  const allPosts = data?.pages?.flatMap(page => page.posts) || []

  return (
    /**
     * dataLength: Establecer la longitud de los datos. Esto desbloqueará las siguientes llamadas a next.
     * next: Función que se activa al llegar al final y debe cargar más datos, manteniendo también los datos anteriores. Ej.: Datos iniciales [1, 2, 3] - Siguiente carga [1, 2, 3, 4, 5, 6]
     * hasMore: Llamar a la función next si llega abajo y mostrar un endMessage al usuario
     * loader: Enviar un componente cargador para que se muestre mientras el componente espera la siguiente carga de datos
     * endMessage: Mostrar un mensaje al usuario cuando ha visto todos los registros
     */
    <InfiniteScroll
      dataLength={allPosts.length}
      next={fetchNextPage}
      hasMore={!!hasNextPage} // !!: Asegurar que sea true o false. Si en ello puede devolver undefined
      loader={<h1>Los posts están cargando...</h1>}
      endMessage={<h1>¡Todos los posts fueron cargados!</h1>}
    >
      {allPosts.map(post => (
        <Post key={post.id} post={post} />
      ))}
    </InfiniteScroll>
  )
}