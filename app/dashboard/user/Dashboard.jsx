import TopCards from '@/components/TopCards';
import Appointments from '@/components/Appointments';
import Predictions from '@/components/Predictions';
import HealthAnalytics from '@/components/HealthAnalytics';
import HealthTips from '@/components/HealthTips';
import HealthMetrics from '@/components/HealthMetrics';
import Reminders from '@/components/Reminders';

export default function MainDashboard() {
  return (
    <div>
          <TopCards />

          <div className="grid grid-cols-3 gap-8">
              {/* Left Column */}
              <div className="col-span-2 space-y-8">
                  <Appointments />
                  <Predictions />
                  <HealthAnalytics />
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                  <HealthTips />
                  <HealthMetrics />
                  <Reminders />
              </div>
          </div>
    </div>
  )
}
