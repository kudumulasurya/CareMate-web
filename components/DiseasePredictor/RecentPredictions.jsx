export default function RecentPredictions({ predictions }) {
    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Predictions</h3>
            <div className="space-y-3">
                {predictions.map((pred) => (
                    <div
                        key={pred.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                    >
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-2xl shadow-sm">
                                {pred.icon}
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-800">{pred.name}</h4>
                                <p className="text-sm text-gray-500">{pred.date}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="text-right">
                                <div className="text-2xl font-bold text-teal-600">{pred.confidence}%</div>
                                <button className="text-sm text-teal-600 hover:text-teal-700 font-medium">
                                    {pred.doctor}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}