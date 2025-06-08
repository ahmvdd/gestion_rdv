import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { comparePassword, generateToken } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email et mot de passe requis" }, { status: 400 })
    }

    // Trouver l'utilisateur
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return NextResponse.json({ error: "Identifiants invalides" }, { status: 401 })
    }

    // Vérifier le mot de passe
    const isValidPassword = await comparePassword(password, user.password)

    if (!isValidPassword) {
      return NextResponse.json({ error: "Identifiants invalides" }, { status: 401 })
    }

    // Générer le token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    })

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Erreur lors de la connexion:", error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}
