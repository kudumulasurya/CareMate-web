'use client'

import React, { useState, useEffect } from 'react'
import { Calendar, Clock, MapPin, User, FileText, X } from 'lucide-react'
import dayjs from 'dayjs'

export default function MyAppointments() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all, upcoming, past, cancelled
  const [cancelling, setCancelling] = useState(null)

  useEffect(() => {
    fetchAppointments()
  }, [])

  const fetchAppointments = () => {
    setLoading(true)
    fetch('/api/appointments')
      .then(res => res.json())
      .then(async (data) => {
        // Fetch doctor details for each appointment
        const appointmentsWithDoctors = await Promise.all(
          data.map(async (apt) => {
            const doctorRes = await fetch(`/api/doctors?_id=${apt.doctorId}`)
            const doctors = await doctorRes.json()
            const doctor = doctors[0]
            return {
              ...apt,
              doctor: doctor ? {
                name: `${doctor.name.first} ${doctor.name.last}`,
                specialization: doctor.doctorProfile?.specialization || 'General',
                avatarUrl: doctor.avatarUrl,
                clinicAddress: doctor.doctorProfile?.clinicAddress
              } : null
            }
          })
        )
        setAppointments(appointmentsWithDoctors)
        setLoading(false)
      })
      .catch(err => {
        console.error('Error fetching appointments:', err)
        setLoading(false)
      })
  }

  const handleCancelAppointment = async (appointmentId) => {
    if (!confirm('Are you sure you want to cancel this appointment?')) return

    setCancelling(appointmentId)
    try {
      const response = await fetch(`/api/appointments/${appointmentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'cancelled' })
      })

      if (response.ok) {
        alert('Appointment cancelled successfully')
        fetchAppointments() // Refresh list
      } else {
        alert('Failed to cancel appointment')
      }
    } catch (err) {
      console.error('Error cancelling appointment:', err)
      alert('Failed to cancel appointment')
    } finally {
      setCancelling(null)
    }
  }

  const getFilteredAppointments = () => {
    const now = new Date()
    switch (filter) {
      case 'upcoming':
        return appointments.filter(a => new Date(a.start) >= now && a.status !== 'cancelled')
      case 'past':
        return appointments.filter(a => new Date(a.start) < now || a.status === 'completed')
      case 'cancelled':
        return appointments.filter(a => a.status === 'cancelled')
      default:
        return appointments
    }
  }

  const getStatusBadge = (status) => {
    const badges = {
      confirmed: 'bg-green-100 text-green-700',
      pending: 'bg-yellow-100 text-yellow-700',
      cancelled: 'bg-red-100 text-red-700',
      completed: 'bg-blue-100 text-blue-700',
      no_show: 'bg-gray-100 text-gray-700'
    }
    return badges[status] || badges.pending
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border p-8">
          <p className="text-gray-500">Loading appointments...</p>
        </div>
      </div>
    )
  }

  const filteredAppointments = getFilteredAppointments()

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">My Appointments</h2>
        <div className="flex space-x-2">
          {['all', 'upcoming', 'past', 'cancelled'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg capitalize transition ${
                filter === f
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {filteredAppointments.length > 0 ? (
        <div className="space-y-4">
          {filteredAppointments.map(appointment => {
            const isPast = new Date(appointment.start) < new Date()
            const canCancel = !isPast && appointment.status !== 'cancelled' && appointment.status !== 'completed'

            return (
              <div key={appointment._id} className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      {appointment.doctor?.avatarUrl ? (
                        <img 
                          src={appointment.doctor.avatarUrl} 
                          alt="" 
                          className="w-full h-full rounded-full object-cover" 
                        />
                      ) : (
                        <User size={32} className="text-blue-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-800">
                        {appointment.doctor?.name || 'Doctor'}
                      </h3>
                      <p className="text-blue-600 text-sm mb-2">
                        {appointment.doctor?.specialization || 'General'}
                      </p>
                      <div className="space-y-1">
                        <div className="flex items-center text-gray-600 text-sm">
                          <Calendar size={16} className="mr-2" />
                          <span>{dayjs(appointment.start).format('MMMM DD, YYYY')}</span>
                        </div>
                        <div className="flex items-center text-gray-600 text-sm">
                          <Clock size={16} className="mr-2" />
                          <span>
                            {dayjs(appointment.start).format('h:mm A')} - {dayjs(appointment.end).format('h:mm A')}
                          </span>
                        </div>
                        {appointment.doctor?.clinicAddress && (
                          <div className="flex items-center text-gray-600 text-sm">
                            <MapPin size={16} className="mr-2" />
                            <span>{appointment.doctor.clinicAddress}</span>
                          </div>
                        )}
                        {appointment.notes && (
                          <div className="flex items-start text-gray-600 text-sm mt-2">
                            <FileText size={16} className="mr-2 mt-0.5" />
                            <span>{appointment.notes}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusBadge(appointment.status)}`}>
                      {appointment.status}
                    </span>
                    {canCancel && (
                      <button
                        onClick={() => handleCancelAppointment(appointment._id)}
                        disabled={cancelling === appointment._id}
                        className="flex items-center space-x-1 px-3 py-1 text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                      >
                        <X size={16} />
                        <span className="text-sm">
                          {cancelling === appointment._id ? 'Cancelling...' : 'Cancel'}
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
          <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">No appointments found</p>
        </div>
      )}
    </div>
  )
}
