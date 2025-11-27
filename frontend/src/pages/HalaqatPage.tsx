import { useState, useEffect } from 'react';
import type { Halaqah } from '../types';
import { halaqahApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';

export default function HalaqatPage() {
  const [halaqat, setHalaqat] = useState<Halaqah[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newHalaqah, setNewHalaqah] = useState({ name: '', description: '', schedule: '' });
  
  const { user } = useAuth();

  useEffect(() => {
    loadHalaqat();
  }, []);

  const loadHalaqat = async () => {
    try {
      const data = await halaqahApi.getHalaqat();
      setHalaqat(data);
    } catch (err) {
      setError('فشل تحميل الحلقات');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateHalaqah = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await halaqahApi.createHalaqah(newHalaqah);
      setNewHalaqah({ name: '', description: '', schedule: '' });
      setShowCreateForm(false);
      loadHalaqat();
    } catch (err) {
      setError('فشل إنشاء الحلقة');
    }
  };

  const canCreateHalaqah = user?.role === UserRole.ADMIN || user?.role === UserRole.TEACHER;

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="animate-pulse text-primary-600 text-xl">جارٍ التحميل...</div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-primary-800">الحلقات التعليمية</h1>
            <p className="text-gray-600 mt-1">حلقات تحفيظ القرآن الكريم</p>
          </div>
          
          {canCreateHalaqah && (
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="bg-primary-600 hover:bg-primary-500 text-white px-6 py-2 rounded-lg transition-colors"
            >
              {showCreateForm ? 'إلغاء' : '+ إنشاء حلقة'}
            </button>
          )}
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Create Halaqah Form */}
        {showCreateForm && canCreateHalaqah && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-primary-800 mb-4">إنشاء حلقة جديدة</h2>
            <form onSubmit={handleCreateHalaqah} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  اسم الحلقة
                </label>
                <input
                  type="text"
                  value={newHalaqah.name}
                  onChange={(e) => setNewHalaqah({ ...newHalaqah, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الوصف
                </label>
                <textarea
                  value={newHalaqah.description}
                  onChange={(e) => setNewHalaqah({ ...newHalaqah, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الجدول الزمني
                </label>
                <input
                  type="text"
                  value={newHalaqah.schedule}
                  onChange={(e) => setNewHalaqah({ ...newHalaqah, schedule: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="مثال: السبت والأحد - 5:00 مساءً"
                />
              </div>
              <button
                type="submit"
                className="bg-primary-600 hover:bg-primary-500 text-white px-6 py-2 rounded-lg transition-colors"
              >
                إنشاء الحلقة
              </button>
            </form>
          </div>
        )}

        {/* Halaqat List */}
        {halaqat.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {halaqat.map((halaqah) => (
              <div key={halaqah.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="bg-primary-600 text-white p-4">
                  <h3 className="text-xl font-bold">{halaqah.name}</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">المعلم:</span>
                      <span className="font-medium">{halaqah.teacherName || 'غير محدد'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">عدد الطلاب:</span>
                      <span className="font-medium">{halaqah.studentCount || 0}</span>
                    </div>
                    {halaqah.schedule && (
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">الموعد:</span>
                        <span className="font-medium">{halaqah.schedule}</span>
                      </div>
                    )}
                    {halaqah.description && (
                      <p className="text-gray-600 text-sm mt-2">{halaqah.description}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="text-5xl mb-4">👥</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">لا توجد حلقات</h3>
            <p className="text-gray-600">
              {canCreateHalaqah 
                ? 'ابدأ بإنشاء حلقة جديدة لتحفيظ القرآن الكريم'
                : 'لم يتم تسجيلك في أي حلقة بعد'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
