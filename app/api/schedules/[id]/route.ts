import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getUserFromRequest } from "@/lib/auth"

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const schedule = await prisma.schedule.findFirst({
      where: {
        id: params.id,
        userId: user.userId,
      },
    })

    if (!schedule) {
      return NextResponse.json({ error: "Horaire non trouvé" }, { status: 404 })
    }

    await prisma.schedule.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: "Horaire supprimé avec succès" })
  } catch (error) {
    console.error("Erreur lors de la suppression de l'horaire:", error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}
