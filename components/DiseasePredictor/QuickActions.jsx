import { Calendar, Phone, Upload } from 'lucide-react';

export default function QuickActions() {
    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
            <div className="space-y-2">
                <button className="w-full flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition">
                    <Calendar className="w-5 h-5 text-teal-600" />
                    <span className="text-sm font-medium text-gray-700">Book Emergency Appointment</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition">
                    <Phone className="w-5 h-5 text-teal-600" />
                    <span className="text-sm font-medium text-gray-700">Call Health Hotline</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition">
                    <Upload className="w-5 h-5 text-teal-600" />
                    <span className="text-sm font-medium text-gray-700">Upload Medical Report</span>
                </button>
            </div>
        </div>
    );
}