// Script to initialize schools in Firebase
// Run this in browser console after the app is loaded, or adapt it for Node.js

// Copy and paste this code into your browser console when you're on the app page
// OR use this as a reference to create schools manually in Firebase Console

const schools = [
    {
        name: 'टी झेड पवार माध्यमिक विद्यालय गोराणे ता बागलाण जि नाशिक',
        adminId: 'admin1',
        adminPassword: 'School1@2024'
    },
    {
        name: 'माध्यमिक विद्यालय नांदीन ता बागलाण जि नाशिक',
        adminId: 'admin2',
        adminPassword: 'School2@2024'
    },
    {
        name: 'शि म भा हिरे विद्यालय पिंपळगांव ता मालेगांव जि नाशिक',
        adminId: 'admin3',
        adminPassword: 'School3@2024'
    },
    {
        name: 'शि म भा हिरे विद्यालय व कनिष्ठ महाविद्यालय पिंपळगांव ता मालेगांव जि नाशिक',
        adminId: 'admin4',
        adminPassword: 'School4@2024'
    },
    {
        name: 'समाजकल्याण विभाग मुलांचे वस्तीगृह पिंपळगांव ता मालेगांव जि नाशिक',
        adminId: 'admin5',
        adminPassword: 'School5@2024'
    },
    {
        name: 'तरूण मित्र मंडळ पिंपळगांव ता मालेगांव जि नाशिक',
        adminId: 'admin6',
        adminPassword: 'School6@2024'
    }
];

// Instructions:
// 1. Open your app in browser (localhost:5173)
// 2. Open browser console (F12)
// 3. You can use Firebase SDK if available, or use the manual method below

console.log('Schools data ready. Use one of these methods:');
console.log('1. Firebase Console (Recommended): Go to Firebase Console > Firestore > Create collection "schools" and add documents manually');
console.log('2. Browser Console: If Firebase is available, you can use addDoc to create schools');
console.log('3. Use the initialize-schools.html file in the project root');

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = schools;
}

