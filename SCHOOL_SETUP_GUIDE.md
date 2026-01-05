# School Setup Guide

This guide will help you set up 6 schools in your Firebase project for the multi-school ledger system.

## Overview

The application now supports multiple schools. Each school has:
- A unique name
- A unique admin ID (username)
- A unique admin password
- Separate data storage in Firebase

## Firebase Data Structure

```
schools/
  {schoolId1}/
    accounts/
      {accountId}/
    entries/
      {entryId}/
  {schoolId2}/
    accounts/
      ...
    entries/
      ...
  ...
```

## Setting Up Schools in Firebase

You need to create 6 school documents in the `schools` collection in Firebase Firestore. Each school document should have the following fields:

### School Document Structure

- `name` (string): The name of the school (e.g., "शाळा 1", "School 1")
- `adminId` (string): Unique admin username for this school
- `adminPassword` (string): Admin password for this school

### Option 1: Using Firebase Console (Recommended)

1. **Open Firebase Console**: Go to [Firebase Console](https://console.firebase.google.com/)
2. **Navigate to Firestore**: Select your project → Firestore Database
3. **Create Collection**: 
   - Click "Start collection"
   - Collection ID: `schools`
   - Click "Next"
4. **Add First School Document**:
   - Document ID: Leave empty (Firebase will auto-generate) OR use a custom ID like `school1`
   - Add fields:
     ```
     name: "शाळा 1" (or "School 1")
     adminId: "admin1" (unique username)
     adminPassword: "password1" (secure password)
     ```
   - Click "Save"
5. **Repeat for All 6 Schools**: Create 5 more documents with different names, adminIds, and passwords

### Option 2: Using Firebase CLI

Create a file `initialize-schools.js`:

```javascript
// initialize-schools.js
const admin = require('firebase-admin');
const serviceAccount = require('./path-to-your-service-account-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const schools = [
  {
    name: 'शाळा 1',
    adminId: 'admin1',
    adminPassword: 'password1'
  },
  {
    name: 'शाळा 2',
    adminId: 'admin2',
    adminPassword: 'password2'
  },
  {
    name: 'शाळा 3',
    adminId: 'admin3',
    adminPassword: 'password3'
  },
  {
    name: 'शाळा 4',
    adminId: 'admin4',
    adminPassword: 'password4'
  },
  {
    name: 'शाळा 5',
    adminId: 'admin5',
    adminPassword: 'password5'
  },
  {
    name: 'शाळा 6',
    adminId: 'admin6',
    adminPassword: 'password6'
  }
];

async function initializeSchools() {
  const batch = db.batch();
  
  schools.forEach((school) => {
    const schoolRef = db.collection('schools').doc();
    batch.set(schoolRef, school);
  });
  
  await batch.commit();
  console.log('All schools initialized successfully!');
}

initializeSchools()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Error initializing schools:', error);
    process.exit(1);
  });
```

Run it with:
```bash
node initialize-schools.js
```

### Option 3: Manual Example (Recommended for First Time)

Here's an example of 6 schools you can create:

| School Name | Admin ID | Admin Password |
|------------|----------|----------------|
| शाळा 1 | admin1 | School1@2024 |
| शाळा 2 | admin2 | School2@2024 |
| शाळा 3 | admin3 | School3@2024 |
| शाळा 4 | admin4 | School4@2024 |
| शाळा 5 | admin5 | School5@2024 |
| शाळा 6 | admin6 | School6@2024 |

**Important**: Change these passwords to secure, unique passwords in production!

## How It Works

1. **School Selection**: When users open the website, they see a list of all schools and must select one
2. **School-Specific Data**: Each school's accounts and entries are stored separately in Firebase
3. **Admin Login**: Each school has its own admin credentials. When an admin logs in, they only have access to their school's data
4. **Session Management**: The selected school is stored in browser localStorage, so users don't need to re-select on every visit

## Security Notes

1. **Change Default Passwords**: Always use strong, unique passwords for each school's admin account
2. **Firestore Rules**: Update your Firestore security rules to restrict access:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Schools collection - readable by all, writable only by admins
       match /schools/{schoolId} {
         allow read: if true;
         allow write: if false; // Only through admin SDK or console
       }
       
       // School-specific data
       match /schools/{schoolId}/accounts/{accountId} {
         allow read, write: if true; // Adjust based on your security needs
       }
       
       match /schools/{schoolId}/entries/{entryId} {
         allow read, write: if true; // Adjust based on your security needs
       }
     }
   }
   ```

3. **Production Recommendations**:
   - Use Firebase Authentication instead of plain text passwords
   - Implement proper access control
   - Use environment variables for sensitive configuration
   - Enable Firebase App Check
   - Set up monitoring and alerts

## Troubleshooting

1. **No Schools Showing**: 
   - Verify schools collection exists in Firestore
   - Check that school documents have `name`, `adminId`, and `adminPassword` fields
   - Check browser console for errors

2. **Admin Login Not Working**:
   - Verify the adminId and adminPassword match exactly (case-sensitive)
   - Check that you've selected the correct school
   - Clear browser localStorage and try again

3. **Data Not Showing**:
   - Verify the school ID matches the selected school
   - Check Firebase console for data in `schools/{schoolId}/accounts` and `schools/{schoolId}/entries`
   - Check browser console for Firebase errors

## Testing

After setting up schools:

1. Open the application
2. You should see the school selection page
3. Select a school
4. Try logging in as admin using that school's credentials
5. Create some test accounts and entries
6. Verify data appears only for that school
7. Logout, select a different school, and verify data is separate

---

For any issues or questions, check the main README or Firebase setup guide.


