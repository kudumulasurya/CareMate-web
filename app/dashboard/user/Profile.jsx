'use client'

import React, { useState, useEffect } from 'react'
import { User, Mail, Phone, MapPin, Calendar, Droplet, Edit, Heart, Activity, FileText, AlertCircle, Pill, Shield } from 'lucide-react'

export default function Profile() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    age: '',
    gender: 'male',
    address: '',
    bloodGroup: '',
    phone: '',
    dateOfBirth: '',
    allergies: [],
    conditions: [],
    medications: []
  })

  // Mock health stats - replace with real data from backend
  const [healthStats, setHealthStats] = useState({
    bmi: { value: 22.5, status: 'Normal' },
    heartRate: { value: 72, unit: 'bpm' },
    bloodPressure: { value: '120/80', unit: 'mmHg' }
  })

  // Mock appointments - replace with real data from backend
  const [appointments, setAppointments] = useState({
    upcoming: {
      title: 'Annual Check-up',
      doctor: 'Dr. Emily Carter',
      date: '2025-11-10',
      time: '9:00 AM'
    },
    recent: {
      title: 'Dental Cleaning',
      doctor: 'Dr. Alan Grant',
      date: '2025-06-22'
    }
  })

  const [medicalReports, setMedicalReports] = useState([
    { name: 'Blood Test Results', date: 'Oct 2025' },
    { name: 'X-Ray Scan', date: 'Aug 2025' }
  ])

  useEffect(() => {
    // Get current user info
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        setUser(data)
        if (data.profile) {
          setFormData({
            age: data.profile.age || '',
            gender: data.profile.gender || 'male',
            address: data.profile.address || '',
            bloodGroup: data.profile.bloodGroup || '',
            phone: data.phone || '',
            dateOfBirth: data.profile.dateOfBirth || '',
            allergies: data.profile.allergies || [],
            conditions: data.profile.conditions || [],
            medications: data.profile.medications || []
          })
        }
        setLoading(false)
      })
      .catch(err => {
        console.error('Error fetching user:', err)
        setLoading(false)
      })
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) return

    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile: {
            age: parseInt(formData.age) || undefined,
            gender: formData.gender,
            address: formData.address,
            bloodGroup: formData.bloodGroup,
            dateOfBirth: formData.dateOfBirth,
            allergies: formData.allergies,
            conditions: formData.conditions,
            medications: formData.medications
          },
          phone: formData.phone
        })
      })

      if (response.ok) {
        alert('Profile updated successfully!')
        setEditing(false)
        // Refresh user data
        const userData = await fetch('/api/auth/me').then(res => res.json())
        setUser(userData)
      } else {
        alert('Failed to update profile')
      }
    } catch (err) {
      console.error('Error updating profile:', err)
      alert('Failed to update profile')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border p-8">
            <p className="text-gray-500">Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border p-8">
            <p className="text-red-500">Failed to load user data</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-blue-600" />
                </div>
                <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{user.name?.first} {user.name?.last}</h1>
                <p className="text-sm text-gray-600">Patient ID: {user._id?.slice(-8).toUpperCase()}</p>
              </div>
            </div>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
              >
                <Edit className="w-4 h-4" />
                Edit Profile
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-6">
                <User className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-bold text-gray-900">Personal Information</h2>
              </div>

              {!editing ? (
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">Full Name</label>
                    <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900">
                      {user.name?.first} {user.name?.last}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">Date of Birth</label>
                    <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900">
                      {formData.dateOfBirth || 'Not provided'}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">Gender</label>
                    <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900 capitalize">
                      {formData.gender}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">Blood Group</label>
                    <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900">
                      {formData.bloodGroup || 'Not provided'}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">Phone Number</label>
                    <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900">
                      {formData.phone || 'Not provided'}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">Email Address</label>
                    <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900">
                      {user.email}
                    </div>
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm text-gray-600 mb-1 block">Address</label>
                    <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900">
                      {formData.address || 'Not provided'}
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                      <input
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                      <select
                        value={formData.gender}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Blood Group</label>
                      <input
                        type="text"
                        value={formData.bloodGroup}
                        onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., A+, O-, B+"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter phone number"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                      <textarea
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your address"
                        rows={3}
                      />
                    </div>
                  </div>

                  <div className="flex space-x-4 pt-4">
                    <button
                      type="submit"
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditing(false)}
                      className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Medical Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-6">
                <Shield className="w-5 h-5 text-green-600" />
                <h2 className="text-lg font-bold text-gray-900">Medical Information</h2>
              </div>

              <div className="space-y-4">
                {/* Allergies */}
                <div className="flex items-start gap-3 p-4 bg-red-50 rounded-lg border border-red-100">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">Allergies</h3>
                    <p className="text-sm text-gray-700">
                      {formData.allergies.length > 0 ? formData.allergies.join(', ') : 'No known allergies'}
                    </p>
                  </div>
                </div>

                {/* Chronic Conditions */}
                <div className="flex items-start gap-3 p-4 bg-orange-50 rounded-lg border border-orange-100">
                  <Activity className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">Chronic Conditions</h3>
                    <p className="text-sm text-gray-700">
                      {formData.conditions.length > 0 ? formData.conditions.join(', ') : 'No chronic conditions'}
                    </p>
                  </div>
                </div>

                {/* Current Medications */}
                <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <Pill className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">Current Medications</h3>
                    <p className="text-sm text-gray-700">
                      {formData.medications.length > 0 ? formData.medications.join(', ') : 'No current medications'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Health Statistics */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Health Statistics</h2>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Activity className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-600">BMI</p>
                    <p className="text-lg font-bold text-gray-900">
                      {healthStats.bmi.value}{' '}
                      <span className="text-sm text-green-600 font-normal">
                        ({healthStats.bmi.status})
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <Heart className="w-5 h-5 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-600">Heart Rate</p>
                    <p className="text-lg font-bold text-gray-900">
                      {healthStats.heartRate.value} {healthStats.heartRate.unit}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Activity className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-600">Blood Pressure</p>
                    <p className="text-lg font-bold text-gray-900">
                      {healthStats.bloodPressure.value} {healthStats.bloodPressure.unit}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Appointments & Reports */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-teal-600" />
                <h2 className="text-lg font-bold text-gray-900">Appointments & Reports</h2>
              </div>

              <div className="space-y-3 mb-4">
                <div className="p-3 border-l-4 border-green-500 bg-green-50 rounded">
                  <p className="text-xs text-green-700 font-semibold mb-1">
                    Upcoming: {appointments.upcoming.title}
                  </p>
                  <p className="text-xs text-gray-600">
                    {appointments.upcoming.doctor} - {appointments.upcoming.date} @ {appointments.upcoming.time}
                  </p>
                </div>

                <div className="p-3 border-l-4 border-gray-300 bg-gray-50 rounded">
                  <p className="text-xs text-gray-700 font-semibold mb-1">
                    Recent: {appointments.recent.title}
                  </p>
                  <p className="text-xs text-gray-600">
                    {appointments.recent.doctor} - {appointments.recent.date}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3 text-sm">Medical Reports</h3>
                <div className="space-y-2">
                  {medicalReports.map((report, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-gray-700 hover:text-blue-600 cursor-pointer">
                      <FileText className="w-4 h-4" />
                      <span className="flex-1">{report.name}</span>
                      <span className="text-xs text-gray-500">- {report.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}