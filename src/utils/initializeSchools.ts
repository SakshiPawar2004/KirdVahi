// Utility function to initialize schools in Firebase
// This can be called from browser console or used in a setup page
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { School } from '../contexts/SchoolContext';

export const defaultSchools: Omit<School, 'id'>[] = [
    {
        name: 'टी झेड पवार माध्यमिक विद्यालय गोराणे ता बागलाण जि नाशिक',
        adminId: '27200105403',
        adminPassword: '27200105403'
    },
    {
        name: 'माध्यमिक विद्यालय नांदीन ता बागलाण जि नाशिक',
        adminId: '27200111502',
        adminPassword: '27200111502'
    },
    {
        name: 'शि म भा हिरे विद्यालय पिंपळगांव ता मालेगांव जि नाशिक',
        adminId: '27200710202',
        adminPassword: '27200710202'
    },
    {
        name: 'शि म भा हिरे विद्यालय व कनिष्ठ महाविद्यालय पिंपळगांव ता मालेगांव जि नाशिक',
        adminId: '27200710203',
        adminPassword: '27200710203'
    },
    {
        name: 'समाजकल्याण विभाग मुलांचे वस्तीगृह पिंपळगांव ता मालेगांव जि नाशिक',
        adminId: '27200710204',
        adminPassword: '27200710204'
    },
    {
        name: 'तरूण मित्र मंडळ पिंपळगांव ता मालेगांव जि नाशिक',
        adminId: '27200710205',
        adminPassword: '27200710205'
    }
];

export async function initializeSchools(): Promise<void> {
    if (!db) {
        throw new Error('Firebase is not initialized. Please check your .env file and Firebase configuration.');
    }
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

// Function to update existing schools with new names
export async function updateSchoolNames(): Promise<void> {
    if (!db) {
        throw new Error('Firebase is not initialized. Please check your .env file and Firebase configuration.');
    }
    try {
        console.log('Updating school names...');
        
        // Get all existing schools
        const schoolsSnapshot = await getDocs(collection(db, 'schools'));
        const existingSchools: { id: string; adminId: string; name: string }[] = [];
        
        schoolsSnapshot.forEach((doc) => {
            const data = doc.data();
            existingSchools.push({
                id: doc.id,
                adminId: data.adminId || '',
                name: data.name || ''
            });
        });
        
        // Update each school by matching adminId
        let updatedCount = 0;
        for (const defaultSchool of defaultSchools) {
            const existingSchool = existingSchools.find(s => s.adminId === defaultSchool.adminId);
            
            if (existingSchool) {
                // Update the school name and password from defaultSchools
                const schoolRef = doc(db, 'schools', existingSchool.id);
                await updateDoc(schoolRef, {
                    name: defaultSchool.name,
                    adminPassword: defaultSchool.adminPassword
                });
                console.log(`✓ Updated: ${defaultSchool.name} (ID: ${existingSchool.id})`);
                updatedCount++;
            } else {
                console.log(`⚠ School with adminId ${defaultSchool.adminId} not found. Skipping...`);
            }
        }
        
        console.log(`Updated ${updatedCount} school(s) successfully!`);
        alert(`Updated ${updatedCount} school(s) successfully! Please refresh the page.`);
    } catch (error) {
        console.error('Error updating school names:', error);
        alert('Error updating school names. Check console for details.');
        throw error;
    }
}

// Function to update school passwords in Firebase (matches adminPassword from defaultSchools)
export async function updateSchoolPasswords(): Promise<void> {
    if (!db) {
        throw new Error('Firebase is not initialized. Please check your .env file and Firebase configuration.');
    }
    try {
        console.log('Updating school passwords...');
        const schoolsSnapshot = await getDocs(collection(db, 'schools'));
        let updatedCount = 0;
        for (const docSnap of schoolsSnapshot.docs) {
            const data = docSnap.data();
            const adminId = data.adminId || '';
            const defaultSchool = defaultSchools.find(s => s.adminId === adminId);
            if (defaultSchool) {
                await updateDoc(doc(db, 'schools', docSnap.id), {
                    adminPassword: defaultSchool.adminPassword
                });
                console.log(`✓ Updated password for ${defaultSchool.name}`);
                updatedCount++;
            }
        }
        console.log(`Updated ${updatedCount} school password(s) successfully!`);
        alert(`Updated ${updatedCount} school password(s). Please refresh the page and try logging in again.`);
    } catch (error) {
        console.error('Error updating school passwords:', error);
        alert('Error updating school passwords. Check console for details.');
        throw error;
    }
}

/**
 * Keep only the 6 main schools in Firebase. Deletes all other school documents.
 * For each main school name, keeps the first matching document and updates it to correct adminId/adminPassword.
 * Run from browser console: keepOnlyMainSchools()
 */
export async function keepOnlyMainSchools(): Promise<void> {
    if (!db) {
        throw new Error('Firebase is not initialized. Please check your .env file and Firebase configuration.');
    }
    try {
        console.log('Keeping only 6 main schools, removing rest...');
        const snapshot = await getDocs(collection(db, 'schools'));
        const idsToKeep: string[] = [];
        const docsToUpdate: { id: string; defaultSchool: (typeof defaultSchools)[0] }[] = [];

        for (const defaultSchool of defaultSchools) {
            const match = snapshot.docs.find(
                d => (d.data().name || '').trim() === defaultSchool.name.trim()
            );
            if (match) {
                idsToKeep.push(match.id);
                docsToUpdate.push({ id: match.id, defaultSchool });
            }
        }

        const toDelete = snapshot.docs.filter(d => !idsToKeep.includes(d.id));
        for (const d of toDelete) {
            await deleteDoc(doc(db, 'schools', d.id));
            console.log(`Deleted extra school: ${d.id}`);
        }

        for (const { id, defaultSchool } of docsToUpdate) {
            await updateDoc(doc(db, 'schools', id), {
                name: defaultSchool.name,
                adminId: defaultSchool.adminId,
                adminPassword: defaultSchool.adminPassword
            });
            console.log(`✓ Kept & updated: ${defaultSchool.name}`);
        }

        console.log(`Done. Deleted ${toDelete.length} extra school(s), kept ${idsToKeep.length} main school(s).`);
        alert(`Done. Deleted ${toDelete.length} extra school(s), kept ${idsToKeep.length} main school(s). Refresh the page.`);
    } catch (error) {
        console.error('Error keeping main schools:', error);
        alert('Error. Check console for details.');
        throw error;
    }
}

// Make it available globally for browser console
if (typeof window !== 'undefined') {
    (window as any).initializeSchools = initializeSchools;
    (window as any).updateSchoolNames = updateSchoolNames;
    (window as any).updateSchoolPasswords = updateSchoolPasswords;
    (window as any).keepOnlyMainSchools = keepOnlyMainSchools;
}

