'use client'

import React from 'react';

export default function HealthAnalytics() {
    const appointmentData = [4, 3, 5, 3, 4, 3];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

    return (
        <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-6">Health Analytics</h3>
            <div className="grid grid-cols-2 gap-6">
                {/* Appointments Chart */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-semibold text-gray-600">Appointments per Month</h4>
                    </div>
                    <div className="flex items-end justify-between h-40 space-x-2">
                        {appointmentData.map((value, idx) => (
                            <div key={idx} className="flex-1 flex flex-col items-center">
                                <div className="w-full bg-blue-500 rounded-t hover:bg-blue-600 transition-colors" style={{ height: `${value * 20}%` }}></div>
                                <span className="text-xs text-gray-500 mt-2">{months[idx]}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Consultations Pie */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-semibold text-gray-600">Consultations by Specialty</h4>
                    </div>
                    <div className="flex items-center justify-center h-40">
                        <div className="relative w-32 h-32">
                            <svg viewBox="0 0 100 100" className="transform -rotate-90">
                                <circle cx="50" cy="50" r="40" fill="none" stroke="#3b82f6" strokeWidth="20" strokeDasharray="75.4 251.2" />
                                <circle cx="50" cy="50" r="40" fill="none" stroke="#f97316" strokeWidth="20" strokeDasharray="62.8 251.2" strokeDashoffset="-75.4" />
                                <circle cx="50" cy="50" r="40" fill="none" stroke="#22c55e" strokeWidth="20" strokeDasharray="50.3 251.2" strokeDashoffset="-138.2" />
                                <circle cx="50" cy="50" r="40" fill="none" stroke="#eab308" strokeWidth="20" strokeDasharray="62.8 251.2" strokeDashoffset="-188.5" />
                            </svg>
                        </div>
                    </div>
                    <div className="mt-4 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                                <span className="text-gray-600">General</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 bg-orange-500 rounded"></div>
                                <span className="text-gray-600">Cardiology</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 bg-green-500 rounded"></div>
                                <span className="text-gray-600">Dermatology</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}