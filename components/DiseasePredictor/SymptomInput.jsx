import { useState } from 'react';
import { Activity } from 'lucide-react';
import Tag from '../ui/Tag';

export default function SymptomInput({ activeTags, setActiveTags, onPredict, predicting }) {
    const [symptoms, setSymptoms] = useState('');

    const removeTag = (tag) => {
        setActiveTags(activeTags.filter(t => t !== tag));
    };

    const addSymptom = () => {
        if (symptoms.trim() && !activeTags.includes(symptoms.trim())) {
            setActiveTags([...activeTags, symptoms.trim()]);
            setSymptoms('');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            addSymptom();
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
                Enter Your Symptoms
            </label>
            <div className="relative">
                <input
                    type="text"
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter symptoms (e.g., fever, cough, headache)"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                />
                <button 
                    onClick={addSymptom}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                    <Activity className="w-5 h-5" />
                </button>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
                {activeTags.map((tag, idx) => (
                    <Tag key={idx} tag={tag} onRemove={() => removeTag(tag)} />
                ))}
            </div>

            <button 
                onClick={onPredict}
                disabled={predicting || activeTags.length === 0}
                className="w-full mt-6 bg-gradient-to-r from-teal-500 to-teal-600 text-white py-3 rounded-lg font-semibold hover:from-teal-600 hover:to-teal-700 transition flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <Activity className="w-5 h-5" />
                <span>{predicting ? 'Predicting...' : 'Predict Disease'}</span>
            </button>
        </div>
    );
}