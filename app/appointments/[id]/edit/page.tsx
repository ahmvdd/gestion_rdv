"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { ProtectedRoute } from "@/components/protected-route"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Trash2 } from "lucide-react"
import Link from "next/link"

interface Appointment {
  id: string
  title: string
  description?: string
  date: string
  startTime: string
  endTime: string
  status: string
}

export default function EditAppointmentPage({ params }: { params: { id: string } }) {
  const [appointment, setAppointment] = useState<Appointment | null>(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [status, setStatus] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState("")
  const { token } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (token) {
      fetchAppointment()
    }
  }, [token])

  const fetchAppointment = async () => {
    try {
      const response = await fetch(`/api/appointments/${params.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const appointmentData = await response.json()
        setAppointment(appointmentData)
        setTitle(appointmentData.title)
        setDescription(appointmentData.description || "")
        setDate(appointmentData.date.split("T")[0])
        setStartTime(new Date(appointmentData.startTime).toTimeString().slice(0, 5))
        setEndTime(new Date(appointmentData.endTime).toTimeString().slice(0, 5))
        setStatus(appointmentData.status)
      } else {
        setError("Rendez-vous non trouvé")
      }
    } catch (error) {
      setError("Erreur lors du chargement du rendez-vous")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError("")

    try {
      const startDateTime = new Date(`${date}T${startTime}`)
      const endDateTime = new Date(`${date}T${endTime}`)

      if (endDateTime <= startDateTime) {
        setError("L'heure de fin doit être après l'heure de début")
        setIsSaving(false)
        return
      }

      const response = await fetch(`/api/appointments/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          date: date,
          startTime: startDateTime.toISOString(),
          endTime: endDateTime.toISOString(),
          status,
        }),
      })

      if (response.ok) {
        router.push("/")
      } else {
        const data = await response.json()
        setError(data.error || "Erreur lors de la mise à jour du rendez-vous")
      }
    } catch (error) {
      setError("Erreur de connexion au serveur")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce rendez-vous ?")) {
      return
    }

    setIsDeleting(true)

    try {
      const response = await fetch(`/api/appointments/${params.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        router.push("/")
      } else {
        const data = await response.json()
        setError(data.error || "Erreur lors de la suppression du rendez-vous")
      }
    } catch (error) {
      setError("Erreur de connexion au serveur")
    } finally {
      setIsDeleting(false)
    }
  }

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  if (!appointment) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <div className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900">Rendez-vous non trouvé</h2>
              <Link href="/" className="mt-4 inline-block text-blue-600 hover:text-blue-500">
                Retour au tableau de bord
              </Link>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <main className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="mb-6">
              <Link href="/" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Retour au tableau de bord
              </Link>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Modifier le rendez-vous</CardTitle>
                <CardDescription>Modifiez les détails de votre rendez-vous</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                      {error}
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="title">Titre *</Label>
                    <Input
                      id="title"
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                      placeholder="Réunion équipe, Rendez-vous client..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Détails du rendez-vous..."
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date">Date *</Label>
                    <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startTime">Heure de début *</Label>
                      <Input
                        id="startTime"
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="endTime">Heure de fin *</Label>
                      <Input
                        id="endTime"
                        type="time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Statut</Label>
                    <Select value={status} onValueChange={setStatus}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un statut" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SCHEDULED">Planifié</SelectItem>
                        <SelectItem value="COMPLETED">Terminé</SelectItem>
                        <SelectItem value="CANCELLED">Annulé</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex justify-between">
                    <div className="flex space-x-4">
                      <Button type="submit" disabled={isSaving}>
                        {isSaving ? "Sauvegarde..." : "Sauvegarder"}
                      </Button>
                      <Link href="/">
                        <Button type="button" variant="outline">
                          Annuler
                        </Button>
                      </Link>
                    </div>

                    <Button type="button" variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                      {isDeleting ? (
                        "Suppression..."
                      ) : (
                        <>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Supprimer
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
