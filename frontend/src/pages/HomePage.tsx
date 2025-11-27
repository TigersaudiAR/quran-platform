import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function HomePage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="bg-gradient-to-bl from-primary-800 via-primary-700 to-primary-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 font-arabic">
            منصة القرآن الكريم
          </h1>
          <p className="text-xl md:text-2xl text-primary-100 mb-8 max-w-3xl mx-auto">
            منصة متكاملة لتحفيظ القرآن الكريم ومتابعة التقدم والانضمام إلى الحلقات التعليمية
          </p>
          
          {isAuthenticated ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/quran"
                className="bg-gold-500 hover:bg-gold-400 text-black font-bold px-8 py-4 rounded-lg text-lg transition-colors"
              >
                📖 تصفح المصحف
              </Link>
              <Link
                to="/dashboard"
                className="bg-white hover:bg-gray-100 text-primary-800 font-bold px-8 py-4 rounded-lg text-lg transition-colors"
              >
                📊 لوحة التحكم
              </Link>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="bg-gold-500 hover:bg-gold-400 text-black font-bold px-8 py-4 rounded-lg text-lg transition-colors"
              >
                ابدأ رحلتك الآن
              </Link>
              <Link
                to="/login"
                className="bg-white/20 hover:bg-white/30 text-white font-bold px-8 py-4 rounded-lg text-lg transition-colors"
              >
                تسجيل الدخول
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-primary-800 mb-12">
            مميزات المنصة
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="text-5xl mb-4">📖</div>
              <h3 className="text-xl font-bold text-primary-800 mb-3">عرض المصحف</h3>
              <p className="text-gray-600">
                تصفح المصحف الشريف بسهولة مع واجهة عربية مريحة للقراءة والحفظ
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="text-5xl mb-4">📈</div>
              <h3 className="text-xl font-bold text-primary-800 mb-3">متابعة التقدم</h3>
              <p className="text-gray-600">
                سجل تقدمك في الحفظ والمراجعة مع إحصائيات تفصيلية ومواعيد المراجعة
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="text-5xl mb-4">👥</div>
              <h3 className="text-xl font-bold text-primary-800 mb-3">الحلقات التعليمية</h3>
              <p className="text-gray-600">
                انضم إلى حلقات تحفيظ القرآن مع معلمين متخصصين وطلاب من حول العالم
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quran Quote Section */}
      <section className="py-16 bg-primary-800 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-3xl font-arabic leading-loose mb-4">
            ﴿ إِنَّا نَحْنُ نَزَّلْنَا الذِّكْرَ وَإِنَّا لَهُ لَحَافِظُونَ ﴾
          </p>
          <p className="text-primary-200">سورة الحجر - الآية 9</p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-primary-800 mb-4">
            ابدأ رحلتك مع القرآن الكريم
          </h2>
          <p className="text-gray-600 mb-8 text-lg">
            سجل الآن وابدأ في حفظ كتاب الله مع متابعة تقدمك يوماً بيوم
          </p>
          {!isAuthenticated && (
            <Link
              to="/register"
              className="inline-block bg-primary-600 hover:bg-primary-500 text-white font-bold px-8 py-4 rounded-lg text-lg transition-colors"
            >
              إنشاء حساب مجاني
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}
