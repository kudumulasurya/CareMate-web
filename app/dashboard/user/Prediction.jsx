import { useState } from 'react';
import SymptomInput from '@/components/DiseasePredictor/SymptomInput';
import RecentPredictions from '@/components/DiseasePredictor/RecentPredictions';
import HealthTips from '@/components/DiseasePredictor/HealthTips';
import ConfidenceGuide from '@/components/DiseasePredictor/ConfidenceGuide';
import QuickActions from '@/components/DiseasePredictor/QuickActions';

export default function DiseasePredictor() {
  const [activeTags, setActiveTags] = useState(['Fever', 'Headache']);
  const [predictions] = useState([
    { id: 1, name: 'Migraine', date: 'Jan 15, 2024', confidence: 92, doctor: 'Book Doctor', icon: '🧠' },
    { id: 2, name: 'Bronchitis', date: 'Jan 12, 2024', confidence: 78, doctor: 'Book Doctor', icon: '🫁' }
  ]);

  return (
    <div>
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <SymptomInput
            activeTags={activeTags}
            setActiveTags={setActiveTags}
          />
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