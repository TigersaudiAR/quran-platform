import { Router } from 'express';
import {
  getAllSurahs,
  getSurahById,
  getAyahsBySurah,
  getAyahByNumber,
  getJuzInfo,
  getPageInfo
} from '../controllers/quranController';

const router = Router();

// Surah routes
router.get('/surahs', getAllSurahs);
router.get('/surahs/:id', getSurahById);
router.get('/surahs/:surahId/ayahs', getAyahsBySurah);
router.get('/surahs/:surahId/ayahs/:ayahNumber', getAyahByNumber);

// Juz routes
router.get('/juz/:juzNumber', getJuzInfo);

// Page routes
router.get('/pages/:pageNumber', getPageInfo);

export default router;
