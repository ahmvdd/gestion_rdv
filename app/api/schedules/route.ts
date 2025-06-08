import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getUserFromRequest } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const schedules = await prisma.schedule.findMany({
      where: { userId: user.userId },
      orderBy: { dayOfWeek: "asc" },
    })

    return NextResponse.json(schedules)
  } catch (error) {
    console.error("Erreur lors de la récupération des horaires:", error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const { dayOfWeek, startTime, endTime, isActive } = await request.json()

    if (!dayOfWeek || !startTime || !endTime) {
      return NextResponse.json({ error: "Tous les champs sont requis" }, { status: 400 })
    }

    const schedule = await prisma.schedule.upsert({
      where: {
        userId_dayOfWeek: {
          userId: user.userId,
          dayOfWeek,
        },
      },
      update: {
        startTime,
        endTime,
        isActive: isActive ?? true,
      },
      create: {
        dayOfWeek,
        startTime,
        endTime,
        isActive: isActive ?? true,
        userId: user.userId,
      },
    })

    return NextResponse.json(schedule)
  } catch (error) {
    console.error("Erreur lors de la création/mise à jour de l'horaire:", error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}
