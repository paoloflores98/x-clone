"use client"
import { useInfiniteQuery } from "@tanstack/react-query"
import InfiniteScroll from "react-infinite-scroll-component"
import Post from "./Post"

interface Props {
  userProfileId?: string
}

const fetchPosts = async (pageParam: number, userProfileId?: string) => {
  // const response = await fetch("http://localhost:3000/api/posts?cursor=" + pageParam + "&user=" + userProfileId)
  const response = await fetch(`http://localhost:3000/api/posts?cursor=${pageParam}&user=${userProfileId}`)

  return response.json()
}

export default function InfiniteFeed({ userProfileId }: Props) {
  const { data, error, status, hasNextPage, fetchNextPage } = useInfiniteQuery({ // Aplicar consultar infinitas con useInfiniteQuery
    queryKey: ['posts'],
    queryFn: ({ pageParam = 2 }) => fetchPosts(pageParam, userProfileId), // Se coloca dos porque en el componente Feed.tsx trae la primera página de 3 elementos
    initialPageParam: 2,
    getNextPageParam: (lastPage, pages) => lastPage.hasMore ? pages.length + 2 : undefined
  })

  if(error) return "¡Ha ocurrido un error!"
  if(status === "pending") return "Cargando..."

  console.log("XD", data)

  const allPosts = data?.pages?.flatMap(page => page.posts) || []

  return (
    <InfiniteScroll
      dataLength={allPosts.length}
      next={fetchNextPage}
      hasMore={!!hasNextPage}
      loader={<h1>Los posts están cargando...</h1>}
      endMessage={<h1>Todos los posts cargados...</h1>}  
    >
      {allPosts.map(post => (
        <Post key={post.id} post={post} />
      ))}
    </InfiniteScroll>
  )
}