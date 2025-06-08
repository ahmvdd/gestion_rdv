"use client"

import { useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"
import { Calendar, Clock, Users, Shield, Smartphone, Zap } from "lucide-react"

export default function WelcomePage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && user) {
      router.push("/")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-2">
              <Calendar className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">ScheduleApp</span>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Link href="/login">
                <Button variant="outline">Connexion</Button>
              </Link>
              <Link href="/signup">
                <Button>S'inscrire</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Gérez vos rendez-vous
              <span className="block text-blue-600">en toute simplicité</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              ScheduleApp est la solution moderne pour organiser votre emploi du temps, planifier vos rendez-vous et
              optimiser votre productivité au quotidien.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg" className="text-lg px-8 py-3">
                  Commencer gratuitement
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                  Se connecter
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Pourquoi choisir ScheduleApp ?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Découvrez les fonctionnalités qui font de ScheduleApp l'outil idéal pour votre gestion du temps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Calendar className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Calendrier intuitif</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Visualisez tous vos rendez-vous dans un calendrier moderne et facile à utiliser
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Clock className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Gestion des horaires</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Définissez vos créneaux de disponibilité et optimisez votre planning automatiquement
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Collaboration</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Partagez vos disponibilités et coordonnez facilement vos rendez-vous avec vos équipes
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Sécurité</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Vos données sont protégées avec un système d'authentification sécurisé et moderne
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Smartphone className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Responsive</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Accédez à vos rendez-vous depuis n'importe quel appareil, ordinateur, tablette ou mobile
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Zap className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Interface rapide et fluide pour une expérience utilisateur optimale au quotidien
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 dark:bg-blue-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Prêt à optimiser votre emploi du temps ?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Rejoignez des milliers d'utilisateurs qui ont déjà simplifié leur gestion de rendez-vous avec ScheduleApp
          </p>
          <Link href="/signup">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
              Créer mon compte gratuitement
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-gray-950 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Calendar className="h-6 w-6 text-blue-400" />
              <span className="text-xl font-bold">ScheduleApp</span>
            </div>
            <div className="text-gray-400 text-sm">© 2024 ScheduleApp. Tous droits réservés.</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
