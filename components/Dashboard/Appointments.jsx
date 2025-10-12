'use client'

import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';

export default function Appointments() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/dashboard/upcoming-appointments')
            .then(res => res.json())
            .then(data => {
                setAppointments(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching appointments:', err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-6">Upcoming Appointments</h3>
                <p className="text-gray-500">Loading...</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-800">Upcoming Appointments</h3>
                <button className="text-blue-600 text-sm font-medium hover:underline">View All</button>
            </div>
            <div className="space-y-4">
                {appointments.length > 0 ? (
                    appointments.map((apt) => (
                        <div key={apt._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl">
                                    {apt.doctor?.avatarUrl ? (
                                        <img src={apt.doctor.avatarUrl} alt="" className="w-full h-full rounded-full object-cover" />
                                    ) : (
                                        '👨‍⚕️'
                                    )}
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-800">{apt.doctor?.name || 'Doctor'}</p>
                                    <p className="text-sm text-gray-500">{apt.doctor?.specialization || 'General'}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-semibold text-gray-800">{dayjs(apt.start).format('MMM DD, YYYY')}</p>
                                <p className="text-sm text-gray-500">{dayjs(apt.start).format('h:mm A')}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 text-center py-4">No upcoming appointments</p>
                )}
            </div>
        </div>
    );
}