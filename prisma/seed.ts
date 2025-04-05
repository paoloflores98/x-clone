import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Crear 5 usuarios con datos únicos
  const users = []
  for (let i = 1; i <= 5; i++) {
    const user = await prisma.user.create({
      data: {
        id: `user${i}`,
        email: `user${i}@example.com`,
        username: `user${i}`,
        displayName: `User ${i}`,
        bio: `Hi I'm user${i}. Welcome to my profile!`,
        location: `USA`,
        job: `Developer`,
        website: `google.com`,
      },
    })
    users.push(user)
  }
  console.log(`${users.length} usuarios creados.`)

  // Crear 5 posts para cada usuario
  const posts = []
  for (let i = 0; i < users.length; i++) {
    for (let j = 1; j <= 5; j++) {
      const post = await prisma.post.create({
        data: {
          desc: `Post ${j} by ${users[i].username}`,
          userId: users[i].id,
        },
      })
      posts.push(post)
    }
  }
  console.log('Posts creados.')

  // Crear algunos follows
  await prisma.follow.createMany({
    data: [
      { followerId: users[0].id, followingId: users[1].id },
      { followerId: users[0].id, followingId: users[2].id },
      { followerId: users[1].id, followingId: users[3].id },
      { followerId: users[2].id, followingId: users[4].id },
      { followerId: users[3].id, followingId: users[0].id },
    ],
  })
  console.log('Follows creados.')

  // Crear algunos likes
  await prisma.like.createMany({
    data: [
      { userId: users[0].id, postId: posts[0].id },
      { userId: users[1].id, postId: posts[1].id },
      { userId: users[2].id, postId: posts[2].id },
      { userId: users[3].id, postId: posts[3].id },
      { userId: users[4].id, postId: posts[4].id },
    ],
  })
  console.log('Likes creados.')

  // Crear algunos comentarios (cada comentario es un post vinculado a un post padre)
  const comments = []
  for (let i = 0; i < posts.length; i++) {
    const comment = await prisma.post.create({
      data: {
        desc: `Comment on Post ${posts[i].id} by ${users[(i + 1) % 5].username}`,
        userId: users[(i + 1) % 5].id,
        parentPostId: posts[i].id, // Linking the comment to the post
      },
    })
    comments.push(comment)
  }
  console.log('Comentarios creados.')

  // Crear reposts utilizando el rePostId del modelo Post
  const reposts = []
  for (let i = 0; i < posts.length; i++) {
    const repost = await prisma.post.create({
      data: {
        desc: `Repost of Post ${posts[i].id} by ${users[(i + 2) % 5].username}`,
        userId: users[(i + 2) % 5].id, // El usuario que reenvía
        rePostId: posts[i].id, // Enlace al mensaje original que se vuelve a publicar
      },
    })
    reposts.push(repost)
  }
  console.log('Reposts creados.')

  // Crear posts guardadas (los usuarios guardan los posts que les gustan)
  await prisma.savedPosts.createMany({
    data: [
      { userId: users[0].id, postId: posts[1].id },
      { userId: users[1].id, postId: posts[2].id },
      { userId: users[2].id, postId: posts[3].id },
      { userId: users[3].id, postId: posts[4].id },
      { userId: users[4].id, postId: posts[0].id },
    ],
  })
  console.log('Posts guardados creados.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })