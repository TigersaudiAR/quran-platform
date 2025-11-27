import { useState, useEffect } from 'react';
import type { ProgressStats, MemorizationProgress } from '../types';
import { progressApi } from '../services/api';
import { MemorizationStatus } from '../types';

export default function MemorizationDashboard() {
  const [stats, setStats] = useState<ProgressStats | null>(null);
  const [progress, setProgress] = useState<MemorizationProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [statsData, progressData] = await Promise.all([
          progressApi.getStats(),
          progressApi.getProgress(),
        ]);
        setStats(statsData);
        setProgress(progressData);
      } catch (err) {
        setError('فشل تحميل البيانات');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const getStatusBadge = (status: MemorizationStatus) => {
    const badges = {
      [MemorizationStatus.MEMORIZED]: 'bg-green-100 text-green-800',
      [MemorizationStatus.IN_PROGRESS]: 'bg-yellow-100 text-yellow-800',
      [MemorizationStatus.NEEDS_REVIEW]: 'bg-orange-100 text-orange-800',
      [MemorizationStatus.NOT_STARTED]: 'bg-gray-100 text-gray-800',
    };
    return badges[status] || badges[MemorizationStatus.NOT_STARTED];
  };

  const getStatusText = (status: MemorizationStatus) => {
    const texts = {
      [MemorizationStatus.MEMORIZED]: 'محفوظ',
      [MemorizationStatus.IN_PROGRESS]: 'قيد الحفظ',
      [MemorizationStatus.NEEDS_REVIEW]: 'يحتاج مراجعة',
      [MemorizationStatus.NOT_STARTED]: 'لم يبدأ',
    };
    return texts[status] || 'غير محدد';
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-pulse text-primary-600 text-xl">جارٍ التحميل...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-primary-800 mb-8">لوحة التحكم</h1>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-r-4 border-primary-500">
            <p className="text-gray-500 text-sm mb-1">إجمالي الآيات المحفوظة</p>
            <p className="text-3xl font-bold text-primary-800">{stats.totalAyahsMemorized}</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border-r-4 border-green-500">
            <p className="text-gray-500 text-sm mb-1">السور المبدوءة</p>
            <p className="text-3xl font-bold text-green-800">{stats.surahsStarted}</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border-r-4 border-yellow-500">
            <p className="text-gray-500 text-sm mb-1">قيد الحفظ</p>
            <p className="text-3xl font-bold text-yellow-800">{stats.inProgress}</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border-r-4 border-orange-500">
            <p className="text-gray-500 text-sm mb-1">تحتاج مراجعة</p>
            <p className="text-3xl font-bold text-orange-800">{stats.needsReview}</p>
          </div>
        </div>
      )}

      {/* Progress Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 bg-primary-50 border-b border-primary-100">
          <h2 className="text-xl font-bold text-primary-800">سجل الحفظ</h2>
        </div>

        {progress.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">السورة</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">نطاق الآيات</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">الحالة</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">آخر مراجعة</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">المراجعة القادمة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {progress.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{record.surahNameArabic}</p>
                        <p className="text-sm text-gray-500">{record.surahName}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {record.ayahStart} - {record.ayahEnd}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm ${getStatusBadge(record.status)}`}>
                        {getStatusText(record.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {record.lastReviewDate 
                        ? new Date(record.lastReviewDate).toLocaleDateString('ar-SA')
                        : '-'
                      }
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {record.nextReviewDate
                        ? new Date(record.nextReviewDate).toLocaleDateString('ar-SA')
                        : '-'
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-6 py-12 text-center text-gray-500">
            <p>لا يوجد سجلات حفظ بعد</p>
            <p className="text-sm mt-2">ابدأ بحفظ القرآن الكريم من صفحة المصحف</p>
          </div>
        )}
      </div>
    </div>
  );
}
