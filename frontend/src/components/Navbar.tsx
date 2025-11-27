import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-primary-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 space-x-reverse">
              <span className="text-2xl font-arabic">📖</span>
              <span className="font-bold text-xl">منصة القرآن الكريم</span>
            </Link>
          </div>

          <div className="flex items-center gap-6">
            {isAuthenticated ? (
              <>
                <Link
                  to="/quran"
                  className="hover:text-primary-200 transition-colors"
                >
                  المصحف
                </Link>
                <Link
                  to="/dashboard"
                  className="hover:text-primary-200 transition-colors"
                >
                  لوحة التحكم
                </Link>
                <Link
                  to="/halaqat"
                  className="hover:text-primary-200 transition-colors"
                >
                  الحلقات
                </Link>
                <div className="flex items-center gap-4 border-r border-primary-600 pr-6 mr-2">
                  <span className="text-primary-200 text-sm">
                    مرحباً، {user?.name}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="bg-primary-600 hover:bg-primary-500 px-4 py-2 rounded-lg transition-colors"
                  >
                    تسجيل الخروج
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hover:text-primary-200 transition-colors"
                >
                  تسجيل الدخول
                </Link>
                <Link
                  to="/register"
                  className="bg-gold-500 hover:bg-gold-400 text-black px-4 py-2 rounded-lg transition-colors"
                >
                  إنشاء حساب
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
