import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getUserFromRequest } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const date = searchParams.get("date")

    const whereClause: any = { userId: user.userId }

    if (date) {
      const startDate = new Date(date)
      const endDate = new Date(date)
      endDate.setDate(endDate.getDate() + 1)

      whereClause.date = {
        gte: startDate,
        lt: endDate,
      }
    }

    const appointments = await prisma.appointment.findMany({
      where: whereClause,
      orderBy: { startTime: "asc" },
      include: {
        user: {
          select: { name: true, email: true },
        },
      },
    })

    return NextResponse.json(appointments)
  } catch (error) {
    console.error("Erreur lors de la récupération des rendez-vous:", error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const { title, description, date, startTime, endTime } = await request.json()

    if (!title || !date || !startTime || !endTime) {
      return NextResponse.json({ error: "Tous les champs obligatoires doivent être remplis" }, { status: 400 })
    }

    const appointment = await prisma.appointment.create({
      data: {
        title,
        description,
        date: new Date(date),
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        userId: user.userId,
      },
      include: {
        user: {
          select: { name: true, email: true },
        },
      },
    })

    return NextResponse.json(appointment)
  } catch (error) {
    console.error("Erreur lors de la création du rendez-vous:", error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}
