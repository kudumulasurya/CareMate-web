'use client'

import React from 'react';

export default function Appointments() {
    const appointments = [
        { id: 1, doctor: 'Dr. Michael Chen', specialty: 'Cardiologist', date: 'Oct 15, 2024', time: '10:30 AM', avatar: '👨‍⚕️' },
        { id: 2, doctor: 'Dr. Emily Rodriguez', specialty: 'Dermatologist', date: 'Oct 18, 2024', time: '2:15 PM', avatar: '👩‍⚕️' }
    ];

    return (
        <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-800">Upcoming Appointments</h3>
                <button className="text-blue-600 text-sm font-medium hover:underline">View All</button>
            </div>
            <div className="space-y-4">
                {appointments.map((apt) => (
                    <div key={apt.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl">
                                {apt.avatar}
                            </div>
                            <div>
                                <p className="font-semibold text-gray-800">{apt.doctor}</p>
                                <p className="text-sm text-gray-500">{apt.specialty}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="font-semibold text-gray-800">{apt.date}</p>
                            <p className="text-sm text-gray-500">{apt.time}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}   