"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { ProtectedRoute } from "@/components/protected-route"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Clock, Plus, Trash2 } from "lucide-react"

interface Schedule {
  id: string
  dayOfWeek: string
  startTime: string
  endTime: string
  isActive: boolean
}

const DAYS_OF_WEEK = [
  { value: "MONDAY", label: "Lundi" },
  { value: "TUESDAY", label: "Mardi" },
  { value: "WEDNESDAY", label: "Mercredi" },
  { value: "THURSDAY", label: "Jeudi" },
  { value: "FRIDAY", label: "Vendredi" },
  { value: "SATURDAY", label: "Samedi" },
  { value: "SUNDAY", label: "Dimanche" },
]

export default function SchedulesPage() {
  const { token } = useAuth()
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [newSchedule, setNewSchedule] = useState({
    dayOfWeek: "",
    startTime: "09:00",
    endTime: "17:00",
    isActive: true,
  })

  useEffect(() => {
    if (token) {
      fetchSchedules()
    }
  }, [token])

  const fetchSchedules = async () => {
    try {
      const response = await fetch("/api/schedules", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const schedulesData = await response.json()
        setSchedules(schedulesData)
      }
    } catch (error) {
      console.error("Erreur lors du chargement des horaires:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError("")

    if (!newSchedule.dayOfWeek) {
      setError("Veuillez sélectionner un jour de la semaine")
      setSaving(false)
      return
    }

    if (newSchedule.endTime <= newSchedule.startTime) {
      setError("L'heure de fin doit être après l'heure de début")
      setSaving(false)
      return
    }

    try {
      const response = await fetch("/api/schedules", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newSchedule),
      })

      if (response.ok) {
        await fetchSchedules()
        setNewSchedule({
          dayOfWeek: "",
          startTime: "09:00",
          endTime: "17:00",
          isActive: true,
        })
      } else {
        const data = await response.json()
        setError(data.error || "Erreur lors de la sauvegarde de l'horaire")
      }
    } catch (error) {
      setError("Erreur de connexion au serveur")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (scheduleId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet horaire ?")) {
      return
    }

    try {
      const response = await fetch(`/api/schedules/${scheduleId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        await fetchSchedules()
      } else {
        const data = await response.json()
        setError(data.error || "Erreur lors de la suppression de l'horaire")
      }
    } catch (error) {
      setError("Erreur de connexion au serveur")
    }
  }

  const getDayLabel = (dayOfWeek: string) => {
    const day = DAYS_OF_WEEK.find((d) => d.value === dayOfWeek)
    return day ? day.label : dayOfWeek
  }

  const getAvailableDays = () => {
    const usedDays = schedules.map((s) => s.dayOfWeek)
    return DAYS_OF_WEEK.filter((day) => !usedDays.includes(day.value))
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Gestion des horaires</h1>
              <p className="mt-2 text-gray-600">
                Définissez vos créneaux horaires disponibles pour chaque jour de la semaine
              </p>
            </div>

            {/* Formulaire d'ajout */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Ajouter un créneau horaire</CardTitle>
                <CardDescription>Définissez vos heures de disponibilité pour un jour de la semaine</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="dayOfWeek">Jour de la semaine</Label>
                      <Select
                        value={newSchedule.dayOfWeek}
                        onValueChange={(value) => setNewSchedule((prev) => ({ ...prev, dayOfWeek: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un jour" />
                        </SelectTrigger>
                        <SelectContent>
                          {getAvailableDays().map((day) => (
                            <SelectItem key={day.value} value={day.value}>
                              {day.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="startTime">Heure de début</Label>
                      <Input
                        id="startTime"
                        type="time"
                        value={newSchedule.startTime}
                        onChange={(e) => setNewSchedule((prev) => ({ ...prev, startTime: e.target.value }))}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="endTime">Heure de fin</Label>
                      <Input
                        id="endTime"
                        type="time"
                        value={newSchedule.endTime}
                        onChange={(e) => setNewSchedule((prev) => ({ ...prev, endTime: e.target.value }))}
                        required
                      />
                    </div>

                    <div className="flex items-end">
                      <Button type="submit" disabled={isSaving || getAvailableDays().length === 0}>
                        {isSaving ? (
                          "Ajout..."
                        ) : (
                          <>
                            <Plus className="h-4 w-4 mr-2" />
                            Ajouter
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Liste des horaires */}
            <Card>
              <CardHeader>
                <CardTitle>Vos horaires de disponibilité</CardTitle>
                <CardDescription>Gérez vos créneaux horaires par jour de la semaine</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : schedules.length === 0 ? (
                  <div className="text-center py-8">
                    <Clock className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun horaire défini</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Commencez par ajouter vos créneaux horaires disponibles
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {DAYS_OF_WEEK.map((day) => {
                      const schedule = schedules.find((s) => s.dayOfWeek === day.value)

                      return (
                        <div key={day.value} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="w-24">
                              <span className="font-medium text-gray-900">{day.label}</span>
                            </div>

                            {schedule ? (
                              <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-2">
                                  <Clock className="h-4 w-4 text-gray-500" />
                                  <span className="text-sm text-gray-600">
                                    {schedule.startTime} - {schedule.endTime}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Switch
                                    checked={schedule.isActive}
                                    onCheckedChange={async (checked) => {
                                      try {
                                        await fetch("/api/schedules", {
                                          method: "POST",
                                          headers: {
                                            "Content-Type": "application/json",
                                            Authorization: `Bearer ${token}`,
                                          },
                                          body: JSON.stringify({
                                            dayOfWeek: schedule.dayOfWeek,
                                            startTime: schedule.startTime,
                                            endTime: schedule.endTime,
                                            isActive: checked,
                                          }),
                                        })
                                        await fetchSchedules()
                                      } catch (error) {
                                        console.error("Erreur lors de la mise à jour:", error)
                                      }
                                    }}
                                  />
                                  <span className="text-sm text-gray-600">
                                    {schedule.isActive ? "Actif" : "Inactif"}
                                  </span>
                                </div>
                              </div>
                            ) : (
                              <span className="text-sm text-gray-500">Aucun horaire défini</span>
                            )}
                          </div>

                          {schedule && (
                            <Button variant="outline" size="sm" onClick={() => handleDelete(schedule.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
