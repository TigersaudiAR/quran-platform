import MemorizationDashboard from '../components/MemorizationDashboard';

export default function DashboardPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <MemorizationDashboard />
      </div>
    </div>
  );
}
