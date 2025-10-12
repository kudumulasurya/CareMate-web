'use client'

import React from 'react';

export default function Predictions() {
    const predictions = [
        { condition: 'Common Cold', symptoms: 'Based on: symptoms: fever, cough, runny nose', confidence: '92% Confidence', date: 'Oct 10, 2024', color: 'bg-green-100 text-green-700' },
        { condition: 'Migraine', symptoms: 'Based on: symptoms: headache, sensitivity to light', confidence: '78% Confidence', date: 'Oct 8, 2024', color: 'bg-yellow-100 text-yellow-700' }
    ];

    return (
        <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-6">Recent AI Predictions</h3>
            <div className="space-y-4">
                {predictions.map((pred, idx) => (
                    <div key={idx} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-2">
                            <h4 className="font-bold text-gray-800">{pred.condition}</h4>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${pred.color}`}>
                                {pred.confidence}
                            </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{pred.symptoms}</p>
                        <p className="text-xs text-gray-400">Predicted on {pred.date}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}