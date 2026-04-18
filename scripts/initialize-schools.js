// Script to initialize schools in Firebase
// Run this in browser console after the app is loaded, or adapt it for Node.js

// Copy and paste this code into your browser console when you're on the app page
// OR use this as a reference to create schools manually in Firebase Console

const schools = [
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

