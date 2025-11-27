import MushafViewer from '../components/MushafViewer';

export default function QuranPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary-800 mb-2">المصحف الشريف</h1>
          <p className="text-gray-600">تصفح واقرأ القرآن الكريم</p>
        </div>
        
        <MushafViewer />
      </div>
    </div>
  );
}
