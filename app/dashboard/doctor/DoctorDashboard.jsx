'use client'

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import dayjs from 'dayjs';

export default function DoctorDashboard() {
  const [stats, setStats] = useState({
    todayAppointments: 0,
    upcomingAppointments: 0,
    completedToday: 0,
    cancelledToday: 0
  });
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch all appointments for doctor
      const response = await fetch('/api/appointments');
      const appointments = await response.json();

      // Process appointments
      const now = new Date();
      const startOfToday = dayjs().startOf('day').toDate();
      const endOfToday = dayjs().endOf('day').toDate();

      const todayAppts = appointments.filter(a => {
        const apptDate = new Date(a.start);
        return apptDate >= startOfToday && apptDate <= endOfToday;
      });

      const upcomingAppts = appointments.filter(a => {
        const apptDate = new Date(a.start);
        return apptDate > endOfToday && a.status !== 'cancelled';
      }).slice(0, 5);

      // Fetch patient details for today's appointments
      const todayWithPatients = await Promise.all(
        todayAppts.map(async (apt) => {
          try {
            const patientRes = await fetch(`/api/users/${apt.patientId}`);
            const patient = await patientRes.json();
            return {
              ...apt,
              patient: patient ? {
                name: `${patient.name?.first || ''} ${patient.name?.last || ''}`.trim() || 'Unknown',
                email: patient.email
              } : null
            };
          } catch (err) {
            return { ...apt, patient: null };
          }
        })
      );

      // Fetch patient details for upcoming appointments
      const upcomingWithPatients = await Promise.all(
        upcomingAppts.map(async (apt) => {
          try {
            const patientRes = await fetch(`/api/users/${apt.patientId}`);
            const patient = await patientRes.json();
            return {
              ...apt,
              patient: patient ? {
                name: `${patient.name?.first || ''} ${patient.name?.last || ''}`.trim() || 'Unknown',
                email: patient.email
              } : null
            };
          } catch (err) {
            return { ...apt, patient: null };
          }
        })
      );

      setTodayAppointments(todayWithPatients);
      setUpcomingAppointments(upcomingWithPatients);

      // Calculate stats
      setStats({
        todayAppointments: todayAppts.length,
        upcomingAppointments: upcomingAppts.length,
        completedToday: todayAppts.filter(a => a.status === 'completed').length,
        cancelledToday: todayAppts.filter(a => a.status === 'cancelled').length
      });

      setLoading(false);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (appointmentId, newStatus) => {
    try {
      const response = await fetch(`/api/appointments/${appointmentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        // Refresh data
        fetchDashboardData();
      } else {
        alert('Failed to update appointment status');
      }
    } catch (err) {
      console.error('Error updating appointment:', err);
      alert('Failed to update appointment status');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      confirmed: { bg: 'bg-green-100', text: 'text-green-700', label: 'Confirmed' },
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Pending' },
      cancelled: { bg: 'bg-red-100', text: 'text-red-700', label: 'Cancelled' },
      completed: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Completed' },
      no_show: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'No Show' }
    };
    const badge = badges[status] || badges.pending;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Doctor Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back! Here's your schedule for today.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Today's Appointments</p>
                <p className="text-3xl font-bold text-gray-800">{stats.todayAppointments}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="text-blue-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Upcoming</p>
                <p className="text-3xl font-bold text-gray-800">{stats.upcomingAppointments}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Clock className="text-purple-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Completed Today</p>
                <p className="text-3xl font-bold text-gray-800">{stats.completedToday}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="text-green-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Cancelled Today</p>
                <p className="text-3xl font-bold text-gray-800">{stats.cancelledToday}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <XCircle className="text-red-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Today's Schedule */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Today's Schedule</h2>
          {todayAppointments.length > 0 ? (
            <div className="space-y-4">
              {todayAppointments.map((appointment) => (
                <div key={appointment._id} className="border rounded-lg p-4 hover:shadow-md transition">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users size={24} className="text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">
                          {appointment.patient?.name || 'Unknown Patient'}
                        </h3>
                        <p className="text-sm text-gray-500">{appointment.patient?.email || ''}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <div className="flex items-center text-sm text-gray-600">
                            <Clock size={14} className="mr-1" />
                            {dayjs(appointment.start).format('h:mm A')} - {dayjs(appointment.end).format('h:mm A')}
                          </div>
                          {appointment.notes && (
                            <div className="flex items-center text-sm text-gray-600">
                              <AlertCircle size={14} className="mr-1" />
                              <span className="truncate max-w-xs">{appointment.notes}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      {getStatusBadge(appointment.status)}
                      {appointment.status === 'confirmed' && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleUpdateStatus(appointment._id, 'completed')}
                            className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition"
                          >
                            Complete
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(appointment._id, 'no_show')}
                            className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition"
                          >
                            No Show
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">No appointments scheduled for today</p>
            </div>
          )}
        </div>

        {/* Upcoming Appointments */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Upcoming Appointments</h2>
          {upcomingAppointments.length > 0 ? (
            <div className="space-y-3">
              {upcomingAppointments.map((appointment) => (
                <div key={appointment._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <Users size={20} className="text-purple-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">
                        {appointment.patient?.name || 'Unknown Patient'}
                      </p>
                      <p className="text-sm text-gray-500">{appointment.patient?.email || ''}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-800">
                      {dayjs(appointment.start).format('MMM DD, YYYY')}
                    </p>
                    <p className="text-sm text-gray-500">
                      {dayjs(appointment.start).format('h:mm A')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Clock size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">No upcoming appointments</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
