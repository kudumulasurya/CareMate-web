import { Home, Brain, Calendar, FileText, Settings } from 'lucide-react';

export const navigationItems = [
    { icon: Home, label: 'Dashboard', active: false },
    { icon: Brain, label: 'AI Prediction', active: true },
    { icon: Calendar, label: 'My Appointments', active: false },
    { icon: FileText, label: 'Medical Reports', active: false },
    { icon: Settings, label: 'Profile Settings', active: false }
];