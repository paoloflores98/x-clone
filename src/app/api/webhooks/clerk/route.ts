import { prisma } from "@/prisma"
import { verifyWebhook } from "@clerk/nextjs/webhooks"

export async function POST(req: Request) {
  try {
    const evt = await verifyWebhook(req)

    // Hacer algo con el payload. Para esta guía, registre el payload en la consola
    const { id } = evt.data
    const eventType = evt.type
    console.log(`Webhook recibido con ID ${id} y tipo de evento ${eventType}`)
    console.log('Webhook payload:', evt.data)

// Verificar si el evento es de tipo crear usuario
if (eventType === "user.created") {
  try {
    await prisma.user.create({
      data: {
        id: evt.data.id,
        username: evt.data.username!,
        email: evt.data.email_addresses[0].email_address!,
      }
    })

    return new Response("Usuario creado", { status: 200 })
  } catch (error) {
    console.log("Error", error)

    return new Response("Error: No se ha podido crear el usuario.", { status: 500 })
  }
}

// Verificar si el evento es de tipo eliminar usuario
if (eventType === "user.deleted") {
  try {
    await prisma.user.delete({
      where: {
        id: evt.data.id,
      }
    })

    return new Response("Usuario eliminado", { status: 200 })
  } catch (error) {
    console.log("Error", error)

    return new Response("Error: No se ha podido eliminar el usuario.", { status: 500 })
  }
}

    return new Response('Webhook recibido', { status: 200 })
  } catch (err) {
    console.error('Error al verificar el webhook:', err)

    return new Response('Error al verificar el webhook', { status: 400 })
  }
}