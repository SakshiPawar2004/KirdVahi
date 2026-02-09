// School service for managing schools in Firebase
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { defaultSchools } from '../utils/initializeSchools';

export interface School {
  id: string;
  name: string;
  adminId: string;
  adminPassword: string;
}

const SCHOOLS_COLLECTION = 'schools';

// Build map of preferred adminId per school name (from defaultSchools)
function getPreferredAdminIds(): Map<string, string> {
  const map = new Map<string, string>();
  defaultSchools.forEach((s) => map.set(s.name.trim(), s.adminId));
  return map;
}

// School operations
export const schoolService = {
  // Get all schools (deduplicated by name; when duplicates exist, prefer doc matching defaultSchools)
  getAll: async (): Promise<School[]> => {
    if (!db) {
      throw new Error('Firebase is not initialized. Please check your .env file and Firebase configuration.');
    }
    try {
      const querySnapshot = await getDocs(collection(db, SCHOOLS_COLLECTION));
      const preferredByName = getPreferredAdminIds();

      const byName = new Map<string, School>();
      querySnapshot.forEach((d) => {
        const school = { id: d.id, ...d.data() } as School;
        const name = (school.name || '').trim();
        const existing = byName.get(name);
        const preferredAdminId = preferredByName.get(name);
        const isPreferred = preferredAdminId != null && school.adminId === preferredAdminId;
        if (!existing || (isPreferred && existing.adminId !== preferredAdminId)) {
          byName.set(name, school);
        }
      });

      return Array.from(byName.values()).sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    } catch (error) {
      console.error('Error fetching schools:', error);
      throw error;
    }
  },

  // Get school by ID
  getById: async (schoolId: string): Promise<School | null> => {
    if (!db) {
      throw new Error('Firebase is not initialized. Please check your .env file and Firebase configuration.');
    }
    try {
      const schoolDoc = await getDoc(doc(db, SCHOOLS_COLLECTION, schoolId));
      if (schoolDoc.exists()) {
        return {
          id: schoolDoc.id,
          ...schoolDoc.data()
        } as School;
      }
      return null;
    } catch (error) {
      console.error('Error fetching school:', error);
      throw error;
    }
  },

  // Create new school
  create: async (school: Omit<School, 'id'>): Promise<School> => {
    if (!db) {
      throw new Error('Firebase is not initialized. Please check your .env file and Firebase configuration.');
    }
    try {
      const docRef = await addDoc(collection(db, SCHOOLS_COLLECTION), school);
      return {
        id: docRef.id,
        ...school
      };
    } catch (error) {
      console.error('Error creating school:', error);
      throw error;
    }
  },

  // Update school
  update: async (id: string, updates: Partial<School>): Promise<void> => {
    if (!db) {
      throw new Error('Firebase is not initialized. Please check your .env file and Firebase configuration.');
    }
    try {
      const schoolRef = doc(db, SCHOOLS_COLLECTION, id);
      await updateDoc(schoolRef, updates);
    } catch (error) {
      console.error('Error updating school:', error);
      throw error;
    }
  },

  // Delete school
  delete: async (id: string): Promise<void> => {
    if (!db) {
      throw new Error('Firebase is not initialized. Please check your .env file and Firebase configuration.');
    }
    try {
      await deleteDoc(doc(db, SCHOOLS_COLLECTION, id));
    } catch (error) {
      console.error('Error deleting school:', error);
      throw error;
    }
  }
};


