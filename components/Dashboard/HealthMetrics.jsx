'use client'

import React from 'react';
import { Activity, Heart, Weight } from 'lucide-react';

export default function HealthMetrics() {
    const healthMetrics = [
        { label: 'Blood Pressure', value: '120/80', icon: Activity, color: 'text-red-500' },
        { label: 'Heart Rate', value: '72 BPM', icon: Heart, color: 'text-pink-500' },
        { label: 'BMI', value: '22.5', icon: Activity, color: 'text-blue-500' },
        { label: 'Weight', value: '65 kg', icon: Weight, color: 'text-purple-500' }
    ];

    return (
        <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Health Metrics</h3>
            <div className="space-y-4">
                {healthMetrics.map((metric, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                            <metric.icon size={20} className={metric.color} />
                            <span className="text-sm text-gray-600">{metric.label}</span>
                        </div>
                        <span className="font-bold text-gray-800">{metric.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}