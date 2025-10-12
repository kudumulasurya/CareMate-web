'use client'

import React from 'react';
import { Activity, Calendar, FileText, User } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: Activity },
        { id: 'prediction', label: 'AI Prediction', icon: Activity },
        { id: 'appointments', label: 'Book Appointment', icon: Calendar },
        { id: 'my-appointments', label: 'My Appointments', icon: FileText },
        { id: 'reports', label: 'Medical Reports', icon: FileText },
        { id: 'profile', label: 'Profile Settings', icon: User }
    ];

    return (
        <div className="w-64 bg-white shadow-lg">
            <div className="p-6">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                        <Activity className="text-white" size={24} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">HealthCare AI</h1>
                        <p className="text-xs text-gray-500">Patient Portal</p>
                    </div>
                </div>
            </div>

            <nav className="mt-6">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center space-x-3 px-6 py-3 text-left ${activeTab === item.id
                                ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600'
                                : 'text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        <item.icon size={20} />
                        <span className="font-medium">{item.label}</span>
                    </button>
                ))}
            </nav>
        </div>
    );
}