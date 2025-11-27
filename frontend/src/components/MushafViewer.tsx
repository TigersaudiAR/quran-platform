import { useState, useEffect } from 'react';
import type { Surah, Ayah } from '../types';
import { quranApi } from '../services/api';

interface MushafViewerProps {
  initialSurahId?: number;
}

export default function MushafViewer({ initialSurahId = 1 }: MushafViewerProps) {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [selectedSurah, setSelectedSurah] = useState<number>(initialSurahId);
  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [currentSurah, setCurrentSurah] = useState<Surah | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSurahs = async () => {
      try {
        const data = await quranApi.getSurahs();
        setSurahs(data);
      } catch (err) {
        setError('فشل تحميل السور');
      }
    };

    loadSurahs();
  }, []);

  useEffect(() => {
    const loadAyahs = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await quranApi.getAyahs(selectedSurah);
        setAyahs(data.ayahs);
        setCurrentSurah(data.surah);
      } catch (err) {
        setError('فشل تحميل الآيات');
        setAyahs([]);
      } finally {
        setLoading(false);
      }
    };

    loadAyahs();
  }, [selectedSurah]);

  const goToPrevSurah = () => {
    if (selectedSurah > 1) {
      setSelectedSurah(selectedSurah - 1);
    }
  };

  const goToNextSurah = () => {
    if (selectedSurah < 114) {
      setSelectedSurah(selectedSurah + 1);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Surah Selector */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={goToPrevSurah}
          disabled={selectedSurah <= 1}
          className="bg-primary-600 hover:bg-primary-500 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg transition-colors"
        >
          السورة السابقة
        </button>

        <select
          value={selectedSurah}
          onChange={(e) => setSelectedSurah(Number(e.target.value))}
          className="bg-white border-2 border-primary-300 rounded-lg px-4 py-2 text-lg focus:outline-none focus:border-primary-500"
        >
          {surahs.map((surah) => (
            <option key={surah.id} value={surah.id}>
              {surah.id}. {surah.nameArabic} - {surah.name}
            </option>
          ))}
        </select>

        <button
          onClick={goToNextSurah}
          disabled={selectedSurah >= 114}
          className="bg-primary-600 hover:bg-primary-500 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg transition-colors"
        >
          السورة التالية
        </button>
      </div>

      {/* Mushaf Display */}
      <div className="mushaf-page rounded-lg p-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-pulse text-primary-600 text-xl">جارٍ تحميل الآيات...</div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600">{error}</p>
          </div>
        ) : (
          <>
            {/* Surah Header */}
            {currentSurah && (
              <div className="text-center mb-8">
                <h2 className="text-3xl font-arabic font-bold text-primary-800 mb-2">
                  سورة {currentSurah.nameArabic}
                </h2>
                <p className="text-gray-600">
                  {currentSurah.revelationType === 'meccan' ? 'مكية' : 'مدنية'} - 
                  {currentSurah.ayahCount} آية
                </p>
              </div>
            )}

            {/* Bismillah */}
            {selectedSurah !== 1 && selectedSurah !== 9 && (
              <div className="text-center mb-6">
                <p className="quran-text text-2xl text-gold-700">
                  بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                </p>
              </div>
            )}

            {/* Ayahs */}
            <div className="quran-text text-center leading-loose">
              {ayahs.length > 0 ? (
                ayahs.map((ayah, index) => (
                  <span key={ayah.id} className="inline">
                    <span className="text-black">{ayah.text}</span>
                    <span className="inline-flex items-center justify-center w-8 h-8 mx-1 rounded-full bg-primary-100 text-primary-800 text-sm font-sans">
                      {ayah.ayahNumber}
                    </span>
                    {index < ayahs.length - 1 && ' '}
                  </span>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">
                  لا توجد آيات متاحة لهذه السورة في قاعدة البيانات
                </p>
              )}
            </div>
          </>
        )}
      </div>

      {/* Page Info */}
      {ayahs.length > 0 && (
        <div className="mt-4 text-center text-gray-600">
          <p>
            الجزء: {ayahs[0]?.juz || '-'} | الصفحة: {ayahs[0]?.page || '-'}
          </p>
        </div>
      )}
    </div>
  );
}
