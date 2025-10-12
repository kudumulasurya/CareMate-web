'use client'

import React, { useState, useEffect } from 'react'
import { User, Mail, Phone, MapPin, Calendar, Droplet } from 'lucide-react'

export default function Profile() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    age: '',
    gender: 'male',
    address: '',
    bloodGroup: '',
    phone: ''
  })

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
            phone: data.phone || ''
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
            bloodGroup: formData.bloodGroup
          }
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
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border p-8">
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border p-8">
          <p className="text-red-500">Failed to load user data</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">My Profile</h2>
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Edit Profile
            </button>
          )}
        </div>

        {!editing ? (
          <div className="space-y-6">
            <div className="flex items-center space-x-4 pb-6 border-b">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                <User size={40} className="text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">{user.name}</h3>
                <p className="text-gray-500">{user.role}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="flex items-center space-x-3">
                <Mail className="text-gray-400" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-semibold text-gray-800">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Phone className="text-gray-400" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-semibold text-gray-800">{formData.phone || 'Not provided'}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Calendar className="text-gray-400" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Age</p>
                  <p className="font-semibold text-gray-800">{formData.age || 'Not provided'}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <User className="text-gray-400" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Gender</p>
                  <p className="font-semibold text-gray-800 capitalize">{formData.gender || 'Not provided'}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Droplet className="text-gray-400" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Blood Group</p>
                  <p className="font-semibold text-gray-800">{formData.bloodGroup || 'Not provided'}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <MapPin className="text-gray-400" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="font-semibold text-gray-800">{formData.address || 'Not provided'}</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your age"
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

            <div className="flex space-x-4">
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
    </div>
  )
}
