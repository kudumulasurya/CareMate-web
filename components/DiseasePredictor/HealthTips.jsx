import { healthTips } from '../../data/healthTips';

export default function HealthTips() {
    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Health Tips</h3>
            <div className="space-y-4">
                {healthTips.map((tip, idx) => (
                    <div key={idx} className="flex items-start space-x-3">
                        <tip.icon className={`w-5 h-5 mt-0.5 ${tip.color}`} />
                        <p className="text-sm text-gray-600 leading-relaxed">{tip.text}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}