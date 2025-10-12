export default function ConfidenceGuide() {
    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">AI Confidence Guide</h3>
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">High Confidence</span>
                    <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span className="text-sm font-semibold">85-100%</span>
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Medium Confidence</span>
                    <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <span className="text-sm font-semibold">65-84%</span>
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Low Confidence</span>
                    <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <span className="text-sm font-semibold">Below 60%</span>
                    </div>
                </div>
            </div>
            <p className="text-xs text-gray-500 mt-4 p-3 bg-gray-50 rounded-lg">
                ⚠️ AI predictions are for guidance only. Always consult a healthcare professional for proper diagnosis.
            </p>
        </div>
    );
}