"use client"

import Link from "next/link"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Home, Settings, User } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export function Navbar() {
  const { user, logout } = useAuth()

  if (!user) return null

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2">
              <Calendar className="h-6 w-6 text-blue-600" />
              <span className="font-bold text-xl">ScheduleApp</span>
            </Link>

            <div className="hidden md:flex space-x-4">
              <Link
                href="/"
                className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <Home className="h-4 w-4" />
                <span>Accueil</span>
              </Link>
              <Link
                href="/calendar"
                className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <Calendar className="h-4 w-4" />
                <span>Calendrier</span>
              </Link>
              <Link
                href="/appointments/new"
                className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <Clock className="h-4 w-4" />
                <span>Nouveau RDV</span>
              </Link>
              <Link
                href="/schedules"
                className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <Settings className="h-4 w-4" />
                <span>Horaires</span>
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-700 dark:text-gray-300">{user.name}</span>
            </div>
            <ThemeToggle />
            <Button variant="outline" onClick={logout}>
              Déconnexion
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
