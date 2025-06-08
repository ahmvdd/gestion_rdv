import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getUserFromRequest } from "@/lib/auth"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const appointment = await prisma.appointment.findFirst({
      where: {
        id: params.id,
        userId: user.userId,
      },
      include: {
        user: {
          select: { name: true, email: true },
        },
      },
    })

    if (!appointment) {
      return NextResponse.json({ error: "Rendez-vous non trouvé" }, { status: 404 })
    }

    return NextResponse.json(appointment)
  } catch (error) {
    console.error("Erreur lors de la récupération du rendez-vous:", error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const { title, description, date, startTime, endTime, status } = await request.json()

    const appointment = await prisma.appointment.findFirst({
      where: {
        id: params.id,
        userId: user.userId,
      },
    })

    if (!appointment) {
      return NextResponse.json({ error: "Rendez-vous non trouvé" }, { status: 404 })
    }

    const updatedAppointment = await prisma.appointment.update({
      where: { id: params.id },
      data: {
        title,
        description,
        date: date ? new Date(date) : undefined,
        startTime: startTime ? new Date(startTime) : undefined,
        endTime: endTime ? new Date(endTime) : undefined,
        status,
      },
      include: {
        user: {
          select: { name: true, email: true },
        },
      },
    })

    return NextResponse.json(updatedAppointment)
  } catch (error) {
    console.error("Erreur lors de la mise à jour du rendez-vous:", error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const appointment = await prisma.appointment.findFirst({
      where: {
        id: params.id,
        userId: user.userId,
      },
    })

    if (!appointment) {
      return NextResponse.json({ error: "Rendez-vous non trouvé" }, { status: 404 })
    }

    await prisma.appointment.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: "Rendez-vous supprimé avec succès" })
  } catch (error) {
    console.error("Erreur lors de la suppression du rendez-vous:", error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}
