import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { halaqat, users } from '../data/store';
import { Halaqah, UserRole } from '../types';
import { AuthenticatedRequest } from '../middleware/auth';

export const getAllHalaqat = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const userRole = req.user?.role;
    
    if (!userId) {
      res.status(401).json({ success: false, error: 'Not authenticated' });
      return;
    }

    let halaqatList = Array.from(halaqat.values());
    
    // Filter based on role
    if (userRole === UserRole.TEACHER) {
      halaqatList = halaqatList.filter(h => h.teacherId === userId);
    } else if (userRole === UserRole.STUDENT) {
      halaqatList = halaqatList.filter(h => h.studentIds.includes(userId));
    }

    // Enrich with teacher info
    const enrichedHalaqat = halaqatList.map(h => {
      const teacher = users.get(h.teacherId);
      return {
        ...h,
        teacherName: teacher?.name,
        studentCount: h.studentIds.length
      };
    });

    res.json({
      success: true,
      data: enrichedHalaqat
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const getHalaqahById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const halaqahId = req.params.id;
    const userId = req.user?.userId;
    const userRole = req.user?.role;
    
    if (!userId) {
      res.status(401).json({ success: false, error: 'Not authenticated' });
      return;
    }

    const halaqah = halaqat.get(halaqahId);
    
    if (!halaqah) {
      res.status(404).json({ success: false, error: 'Halaqah not found' });
      return;
    }

    // Check access
    if (userRole === UserRole.TEACHER && halaqah.teacherId !== userId) {
      res.status(403).json({ success: false, error: 'Not authorized to view this halaqah' });
      return;
    }
    if (userRole === UserRole.STUDENT && !halaqah.studentIds.includes(userId)) {
      res.status(403).json({ success: false, error: 'Not authorized to view this halaqah' });
      return;
    }

    const teacher = users.get(halaqah.teacherId);
    const students = halaqah.studentIds.map(id => {
      const student = users.get(id);
      return student ? { id: student.id, name: student.name, email: student.email } : null;
    }).filter(s => s !== null);

    res.json({
      success: true,
      data: {
        ...halaqah,
        teacherName: teacher?.name,
        students
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const createHalaqah = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const userRole = req.user?.role;
    
    if (!userId) {
      res.status(401).json({ success: false, error: 'Not authenticated' });
      return;
    }

    // Only admins and teachers can create halaqat
    if (userRole !== UserRole.ADMIN && userRole !== UserRole.TEACHER) {
      res.status(403).json({ success: false, error: 'Only admins and teachers can create halaqat' });
      return;
    }

    const { name, description, schedule, teacherId } = req.body;

    if (!name) {
      res.status(400).json({ success: false, error: 'Name is required' });
      return;
    }

    // Use provided teacherId for admins, or current user for teachers
    const finalTeacherId = userRole === UserRole.ADMIN && teacherId ? teacherId : userId;

    const halaqahId = uuidv4();
    const newHalaqah: Halaqah = {
      id: halaqahId,
      name,
      teacherId: finalTeacherId,
      studentIds: [],
      description: description || '',
      schedule: schedule || '',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    halaqat.set(halaqahId, newHalaqah);

    const teacher = users.get(finalTeacherId);

    res.status(201).json({
      success: true,
      data: {
        ...newHalaqah,
        teacherName: teacher?.name
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const updateHalaqah = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const halaqahId = req.params.id;
    const userId = req.user?.userId;
    const userRole = req.user?.role;
    
    if (!userId) {
      res.status(401).json({ success: false, error: 'Not authenticated' });
      return;
    }

    const halaqah = halaqat.get(halaqahId);
    
    if (!halaqah) {
      res.status(404).json({ success: false, error: 'Halaqah not found' });
      return;
    }

    // Check authorization
    if (userRole !== UserRole.ADMIN && halaqah.teacherId !== userId) {
      res.status(403).json({ success: false, error: 'Not authorized to update this halaqah' });
      return;
    }

    const { name, description, schedule } = req.body;

    if (name) halaqah.name = name;
    if (description !== undefined) halaqah.description = description;
    if (schedule !== undefined) halaqah.schedule = schedule;
    halaqah.updatedAt = new Date();

    halaqat.set(halaqahId, halaqah);

    const teacher = users.get(halaqah.teacherId);

    res.json({
      success: true,
      data: {
        ...halaqah,
        teacherName: teacher?.name
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const addStudentToHalaqah = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const halaqahId = req.params.id;
    const { studentId } = req.body;
    const userId = req.user?.userId;
    const userRole = req.user?.role;
    
    if (!userId) {
      res.status(401).json({ success: false, error: 'Not authenticated' });
      return;
    }

    if (!studentId) {
      res.status(400).json({ success: false, error: 'studentId is required' });
      return;
    }

    const halaqah = halaqat.get(halaqahId);
    
    if (!halaqah) {
      res.status(404).json({ success: false, error: 'Halaqah not found' });
      return;
    }

    // Check authorization
    if (userRole !== UserRole.ADMIN && halaqah.teacherId !== userId) {
      res.status(403).json({ success: false, error: 'Not authorized to modify this halaqah' });
      return;
    }

    // Check if student exists
    const student = users.get(studentId);
    if (!student || student.role !== UserRole.STUDENT) {
      res.status(404).json({ success: false, error: 'Student not found' });
      return;
    }

    // Check if already enrolled
    if (halaqah.studentIds.includes(studentId)) {
      res.status(400).json({ success: false, error: 'Student is already enrolled in this halaqah' });
      return;
    }

    halaqah.studentIds.push(studentId);
    halaqah.updatedAt = new Date();
    halaqat.set(halaqahId, halaqah);

    res.json({
      success: true,
      message: 'Student added successfully',
      data: { halaqahId, studentId }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const removeStudentFromHalaqah = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const halaqahId = req.params.id;
    const studentId = req.params.studentId;
    const userId = req.user?.userId;
    const userRole = req.user?.role;
    
    if (!userId) {
      res.status(401).json({ success: false, error: 'Not authenticated' });
      return;
    }

    const halaqah = halaqat.get(halaqahId);
    
    if (!halaqah) {
      res.status(404).json({ success: false, error: 'Halaqah not found' });
      return;
    }

    // Check authorization
    if (userRole !== UserRole.ADMIN && halaqah.teacherId !== userId) {
      res.status(403).json({ success: false, error: 'Not authorized to modify this halaqah' });
      return;
    }

    const studentIndex = halaqah.studentIds.indexOf(studentId);
    if (studentIndex === -1) {
      res.status(404).json({ success: false, error: 'Student not found in this halaqah' });
      return;
    }

    halaqah.studentIds.splice(studentIndex, 1);
    halaqah.updatedAt = new Date();
    halaqat.set(halaqahId, halaqah);

    res.json({
      success: true,
      message: 'Student removed successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const deleteHalaqah = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const halaqahId = req.params.id;
    const userId = req.user?.userId;
    const userRole = req.user?.role;
    
    if (!userId) {
      res.status(401).json({ success: false, error: 'Not authenticated' });
      return;
    }

    const halaqah = halaqat.get(halaqahId);
    
    if (!halaqah) {
      res.status(404).json({ success: false, error: 'Halaqah not found' });
      return;
    }

    // Only admin or the teacher can delete
    if (userRole !== UserRole.ADMIN && halaqah.teacherId !== userId) {
      res.status(403).json({ success: false, error: 'Not authorized to delete this halaqah' });
      return;
    }

    halaqat.delete(halaqahId);

    res.json({
      success: true,
      message: 'Halaqah deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};
