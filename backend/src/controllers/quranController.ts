import { Request, Response } from 'express';
import { surahs } from '../data/surahs';
import { ayahs } from '../data/ayahs';

export const getAllSurahs = async (_req: Request, res: Response): Promise<void> => {
  try {
    res.json({
      success: true,
      data: surahs
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const getSurahById = async (req: Request, res: Response): Promise<void> => {
  try {
    const surahId = parseInt(req.params.id, 10);
    
    if (isNaN(surahId)) {
      res.status(400).json({ success: false, error: 'Invalid surah ID' });
      return;
    }

    const surah = surahs.find(s => s.id === surahId);
    
    if (!surah) {
      res.status(404).json({ success: false, error: 'Surah not found' });
      return;
    }

    res.json({
      success: true,
      data: surah
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const getAyahsBySurah = async (req: Request, res: Response): Promise<void> => {
  try {
    const surahId = parseInt(req.params.surahId, 10);
    
    if (isNaN(surahId)) {
      res.status(400).json({ success: false, error: 'Invalid surah ID' });
      return;
    }

    const surah = surahs.find(s => s.id === surahId);
    
    if (!surah) {
      res.status(404).json({ success: false, error: 'Surah not found' });
      return;
    }

    const surahAyahs = ayahs.filter(a => a.surahId === surahId);

    res.json({
      success: true,
      data: {
        surah,
        ayahs: surahAyahs
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const getAyahByNumber = async (req: Request, res: Response): Promise<void> => {
  try {
    const surahId = parseInt(req.params.surahId, 10);
    const ayahNumber = parseInt(req.params.ayahNumber, 10);
    
    if (isNaN(surahId) || isNaN(ayahNumber)) {
      res.status(400).json({ success: false, error: 'Invalid surah ID or ayah number' });
      return;
    }

    const ayah = ayahs.find(a => a.surahId === surahId && a.ayahNumber === ayahNumber);
    
    if (!ayah) {
      res.status(404).json({ success: false, error: 'Ayah not found' });
      return;
    }

    res.json({
      success: true,
      data: ayah
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const getJuzInfo = async (req: Request, res: Response): Promise<void> => {
  try {
    const juzNumber = parseInt(req.params.juzNumber, 10);
    
    if (isNaN(juzNumber) || juzNumber < 1 || juzNumber > 30) {
      res.status(400).json({ success: false, error: 'Invalid juz number (must be 1-30)' });
      return;
    }

    const juzAyahs = ayahs.filter(a => a.juz === juzNumber);

    res.json({
      success: true,
      data: {
        juz: juzNumber,
        ayahs: juzAyahs
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const getPageInfo = async (req: Request, res: Response): Promise<void> => {
  try {
    const pageNumber = parseInt(req.params.pageNumber, 10);
    
    if (isNaN(pageNumber) || pageNumber < 1 || pageNumber > 604) {
      res.status(400).json({ success: false, error: 'Invalid page number (must be 1-604)' });
      return;
    }

    const pageAyahs = ayahs.filter(a => a.page === pageNumber);

    res.json({
      success: true,
      data: {
        page: pageNumber,
        ayahs: pageAyahs
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};
