'use client'

import React from 'react';

export default function Reminders() {
    const reminders = [
        { title: 'Take Medication', time: 'Today • 2:00 PM', icon: '💊', color: 'bg-orange-100' },
        { title: 'Blood Test', time: 'Tomorrow • 12:30 AM', icon: '🩸', color: 'bg-blue-100' }
    ];

    return (
        <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Reminders</h3>
            <div className="space-y-3">
                {reminders.map((reminder, idx) => (
                    <div key={idx} className={`flex items-center space-x-3 p-3 ${reminder.color} rounded-lg`}>
                        <span className="text-2xl">{reminder.icon}</span>
                        <div className="flex-1">
                            <p className="font-semibold text-gray-800 text-sm">{reminder.title}</p>
                            <p className="text-xs text-gray-600">{reminder.time}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}