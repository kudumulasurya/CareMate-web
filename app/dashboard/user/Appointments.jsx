'use client'

import React, { useState, useEffect } from 'react'
import { Search, Calendar, Clock, DollarSign } from 'lucide-react'
import dayjs from 'dayjs'

export default function Appointments() {
  const [doctors, setDoctors] = useState([])
  const [filteredDoctors, setFilteredDoctors] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSpecialty, setSelectedSpecialty] = useState('all')
  const [loading, setLoading] = useState(true)
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [bookingNotes, setBookingNotes] = useState('')
  const [booking, setBooking] = useState(false)

  const specialties = ['all', 'Cardiologist', 'Dermatologist', 'Neurologist', 'Pediatrician', 'Orthopedic', 'General']

  useEffect(() => {
    fetch('/api/doctors')
      .then(res => res.json())
      .then(data => {
        setDoctors(data)
        setFilteredDoctors(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Error fetching doctors:', err)
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    let filtered = doctors

    if (selectedSpecialty !== 'all') {
      filtered = filtered.filter(d => d.doctorProfile?.specialization === selectedSpecialty)
    }

    if (searchTerm) {
      filtered = filtered.filter(d => 
        `${d.name.first} ${d.name.last}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.doctorProfile?.specialization?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredDoctors(filtered)
  }, [searchTerm, selectedSpecialty, doctors])

  const handleBookAppointment = async () => {
    if (!selectedDoctor || !selectedDate || !selectedTime) {
      alert('Please select date and time')
      return
    }

    setBooking(true)

    const startDateTime = dayjs(`${selectedDate} ${selectedTime}`).toISOString()
    const endDateTime = dayjs(`${selectedDate} ${selectedTime}`).add(30, 'minute').toISOString()

    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doctorId: selectedDoctor._id,
          start: startDateTime,
          end: endDateTime,
          notes: bookingNotes
        })
      })

      if (response.ok) {
        alert('Appointment booked successfully!')
        setSelectedDoctor(null)
        setSelectedDate('')
        setSelectedTime('')
        setBookingNotes('')
      } else {
        const error = await response.json()
        alert(error.message || 'Failed to book appointment')
      }
    } catch (err) {
      console.error('Error booking appointment:', err)
      alert('Failed to book appointment')
    } finally {
      setBooking(false)
    }
  }

  const generateTimeSlots = () => {
    const slots = []
    for (let hour = 9; hour < 18; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`)
      slots.push(`${hour.toString().padStart(2, '0')}:30`)
    }
    return slots
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border p-8">
          <p className="text-gray-500">Loading doctors...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Book Appointment</h2>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by doctor name or specialty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={selectedSpecialty}
            onChange={(e) => setSelectedSpecialty(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {specialties.map(specialty => (
              <option key={specialty} value={specialty}>
                {specialty === 'all' ? 'All Specialties' : specialty}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Doctors List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredDoctors.map(doctor => (
          <div key={doctor._id} className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition">
            <div className="flex items-start space-x-4 mb-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                {doctor.avatarUrl ? (
                  <img src={doctor.avatarUrl} alt="" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <span className="text-2xl">👨‍⚕️</span>
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-800">
                  Dr. {doctor.name.first} {doctor.name.last}
                </h3>
                <p className="text-blue-600 text-sm">{doctor.doctorProfile?.specialization || 'General'}</p>
                <p className="text-gray-500 text-sm">{doctor.doctorProfile?.yearsExperience || 0} years experience</p>
              </div>
            </div>

            {doctor.doctorProfile?.bio && (
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{doctor.doctorProfile.bio}</p>
            )}

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2 text-gray-600 text-sm">
                <DollarSign size={16} />
                <span>${doctor.doctorProfile?.consultationFee || 50}</span>
              </div>
              {doctor.doctorProfile?.qualifications && doctor.doctorProfile.qualifications.length > 0 && (
                <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                  {doctor.doctorProfile.qualifications[0]}
                </span>
              )}
            </div>

            <button
              onClick={() => setSelectedDoctor(doctor)}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Book Appointment
            </button>
          </div>
        ))}
      </div>

      {filteredDoctors.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No doctors found</p>
        </div>
      )}

      {/* Booking Modal */}
      {selectedDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Book Appointment with Dr. {selectedDoctor.name.first} {selectedDoctor.name.last}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar size={16} className="inline mr-2" />
                  Select Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={dayjs().format('YYYY-MM-DD')}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock size={16} className="inline mr-2" />
                  Select Time
                </label>
                <select
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Choose time</option>
                  {generateTimeSlots().map(slot => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
                <textarea
                  value={bookingNotes}
                  onChange={(e) => setBookingNotes(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Any specific concerns or symptoms..."
                />
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong>Consultation Fee:</strong> ${selectedDoctor.doctorProfile?.consultationFee || 50}
                </p>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={handleBookAppointment}
                  disabled={booking || !selectedDate || !selectedTime}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {booking ? 'Booking...' : 'Confirm Booking'}
                </button>
                <button
                  onClick={() => {
                    setSelectedDoctor(null)
                    setSelectedDate('')
                    setSelectedTime('')
                    setBookingNotes('')
                  }}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
