'use client'

import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';

export default function Predictions() {
    const [predictions, setPredictions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/dashboard/recent-predictions')
            .then(res => res.json())
            .then(data => {
                setPredictions(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching predictions:', err);
                setLoading(false);
            });
    }, []);

    const getConfidenceColor = (predictions) => {
        if (!predictions || predictions.length === 0) return 'bg-gray-100 text-gray-700';
        const maxProb = Math.max(...predictions.map(p => p.probability || 0));
        if (maxProb >= 0.8) return 'bg-green-100 text-green-700';
        if (maxProb >= 0.6) return 'bg-yellow-100 text-yellow-700';
        return 'bg-orange-100 text-orange-700';
    };

    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-6">Recent AI Predictions</h3>
                <p className="text-gray-500">Loading...</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-6">Recent AI Predictions</h3>
            <div className="space-y-4">
                {predictions.length > 0 ? (
                    predictions.map((pred, idx) => {
                        const topPrediction = pred.predictedDiseases && pred.predictedDiseases.length > 0 
                            ? pred.predictedDiseases[0] 
                            : null;
                        const confidence = topPrediction ? Math.round(topPrediction.probability * 100) : 0;
                        
                        return (
                            <div key={pred._id || idx} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-bold text-gray-800">
                                        {topPrediction?.name || 'Diagnosis Pending'}
                                    </h4>
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getConfidenceColor(pred.predictedDiseases)}`}>
                                        {confidence}% Confidence
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600 mb-2">
                                    Based on symptoms: {pred.inputSymptoms || 'N/A'}
                                </p>
                                <p className="text-xs text-gray-400">
                                    Predicted on {dayjs(pred.createdAt).format('MMM DD, YYYY')}
                                </p>
                            </div>
                        );
                    })
                ) : (
                    <p className="text-gray-500 text-center py-4">No predictions yet</p>
                )}
            </div>
        </div>
    );
}