// School service for managing schools in Firebase
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc,
  addDoc, 
  updateDoc, 
  deleteDoc,
  query, 
  where 
} from 'firebase/firestore';
import { db } from '../config/firebase';

export interface School {
  id: string;
  name: string;
  adminId: string;
  adminPassword: string;
}

const SCHOOLS_COLLECTION = 'schools';

// School operations
export const schoolService = {
  // Get all schools
  getAll: async (): Promise<School[]> => {
    try {
      const querySnapshot = await getDocs(collection(db, SCHOOLS_COLLECTION));
      
      const schools: School[] = [];
      querySnapshot.forEach((doc) => {
        schools.push({
          id: doc.id,
          ...doc.data()
        } as School);
      });
      
      return schools.sort((a, b) => a.name.localeCompare(b.name));
    } catch (error) {
      console.error('Error fetching schools:', error);
      throw error;
    }
  },

  // Get school by ID
  getById: async (schoolId: string): Promise<School | null> => {
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
    try {
      await deleteDoc(doc(db, SCHOOLS_COLLECTION, id));
    } catch (error) {
      console.error('Error deleting school:', error);
      throw error;
    }
  }
};


