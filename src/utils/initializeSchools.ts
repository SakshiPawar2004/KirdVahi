// Utility function to initialize schools in Firebase
// This can be called from browser console or used in a setup page
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { School } from '../contexts/SchoolContext';

export const defaultSchools: Omit<School, 'id'>[] = [
    {
        name: 'School 1',
        adminId: 'admin1',
        adminPassword: 'School1@2024'
    },
    {
        name: 'School 2',
        adminId: 'admin2',
        adminPassword: 'School2@2024'
    },
    {
        name: 'School 3',
        adminId: 'admin3',
        adminPassword: 'School3@2024'
    },
    {
        name: 'School 4',
        adminId: 'admin4',
        adminPassword: 'School4@2024'
    },
    {
        name: 'School 5',
        adminId: 'admin5',
        adminPassword: 'School5@2024'
    },
    {
        name: 'School 6',
        adminId: 'admin6',
        adminPassword: 'School6@2024'
    }
];

export async function initializeSchools(): Promise<void> {
    try {
        console.log('Initializing schools...');
        
        for (const school of defaultSchools) {
            try {
                const docRef = await addDoc(collection(db, 'schools'), school);
                console.log(`✓ Created: ${school.name} (ID: ${docRef.id})`);
            } catch (error) {
                console.error(`✗ Error creating ${school.name}:`, error);
                throw error;
            }
        }
        
        console.log('All schools initialized successfully!');
        alert('All schools initialized successfully! Please refresh the page.');
    } catch (error) {
        console.error('Error initializing schools:', error);
        alert('Error initializing schools. Check console for details.');
        throw error;
    }
}

// Make it available globally for browser console
if (typeof window !== 'undefined') {
    (window as any).initializeSchools = initializeSchools;
}

