'use client'

import { useState, useEffect } from 'react';
import SymptomInput from '@/components/DiseasePredictor/SymptomInput';
import RecentPredictions from '@/components/DiseasePredictor/RecentPredictions';
import HealthTips from '@/components/DiseasePredictor/HealthTips';
import ConfidenceGuide from '@/components/DiseasePredictor/ConfidenceGuide';
import QuickActions from '@/components/DiseasePredictor/QuickActions';
import dayjs from 'dayjs';

export default function DiseasePredictor() {
  const [activeTags, setActiveTags] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [predicting, setPredicting] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [latestPrediction, setLatestPrediction] = useState(null);

  useEffect(() => {
    // Fetch current user
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => setCurrentUser(data))
      .catch(err => console.error('Error fetching user:', err));

    // Fetch recent predictions
    fetchRecentPredictions();
  }, []);

  const fetchRecentPredictions = () => {
    fetch('/api/dashboard/recent-predictions')
      .then(res => res.json())
      .then(data => {
        const formatted = data.map(pred => ({
          id: pred._id,
          name: pred.predictedDiseases && pred.predictedDiseases.length > 0 
            ? pred.predictedDiseases[0].name 
            : 'Diagnosis Pending',
          date: dayjs(pred.createdAt).format('MMM DD, YYYY'),
          confidence: pred.predictedDiseases && pred.predictedDiseases.length > 0
            ? Math.round(pred.predictedDiseases[0].probability * 100)
            : 0,
          doctor: 'Book Doctor',
          icon: '🏥',
          rawData: pred
        }));
        setPredictions(formatted);
      })
      .catch(err => console.error('Error fetching predictions:', err));
  };

  const handlePredict = async () => {
    if (activeTags.length === 0) {
      alert('Please enter at least one symptom');
      return;
    }

    setPredicting(true);
    const symptomsText = activeTags.join(', ');

    try {
      const response = await fetch('/api/virtual-doctor/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser?.id,
          symptoms: symptomsText
        })
      });

      if (response.ok) {
        const result = await response.json();
        setLatestPrediction(result);
        // Refresh predictions list
        fetchRecentPredictions();
      } else {
        alert('Failed to get prediction');
      }
    } catch (err) {
      console.error('Error predicting:', err);
      alert('Failed to get prediction');
    } finally {
      setPredicting(false);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <SymptomInput
            activeTags={activeTags}
            setActiveTags={setActiveTags}
            onPredict={handlePredict}
            predicting={predicting}
          />
          
          {/* Show latest prediction result */}
          {latestPrediction && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Prediction Results</h3>
              <div className="space-y-4">
                {latestPrediction.predictions.map((pred, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-bold text-gray-800">{pred.disease}</h4>
                      <p className="text-sm text-gray-600">Confidence: {Math.round(pred.probability * 100)}%</p>
                    </div>
                    <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center">
                      <span className="text-2xl font-bold text-teal-600">
                        {Math.round(pred.probability * 100)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              {latestPrediction.explanation && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <strong>Note:</strong> {latestPrediction.explanation}
                  </p>
                </div>
              )}
              <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-sm text-yellow-800">
                  ⚠️ <strong>Disclaimer:</strong> This is an AI-generated prediction for informational purposes only. 
                  Please consult with a healthcare professional for proper diagnosis and treatment.
                </p>
              </div>
            </div>
          )}

          <RecentPredictions predictions={predictions} />
        </div>

        <div className="space-y-6">
          <HealthTips />
          <ConfidenceGuide />
          <QuickActions />
        </div>
      </div>
    </div>
  );
}