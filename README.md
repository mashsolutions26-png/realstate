# Nestoria — Real Estate Listing Website

## Run it locally

1. Install dependencies:
   npm install

2. Start the dev server:
   npm run dev

3. Open the URL it prints (usually http://localhost:5173)

## Build for production

npm run build

This outputs a static site into the `dist/` folder — upload it to any
static host (Firebase Hosting, Netlify, Vercel, your own server, etc).

## Firebase Auth — required setup

The app is wired to Firebase project `realstate-c5585` (src/firebase.ts).
Before login/register will work, go to the Firebase Console for that
project and:

1. Build > Authentication > Get started
2. Enable the "Email/Password" sign-in provider
3. Enable the "Google" sign-in provider (pick a support email when prompted)
4. Build > Firestore Database > Create database (start in production mode
   or test mode — either is fine to get started)
5. In Firestore > Rules, use something like this so each user can only
   read/write their own profile/favorites doc:

   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
     }
   }

That's it — email/password signup, Google sign-in, and favorites syncing
to Firestore (users/{uid}.favorites) will all work once those are on.

## Notes

- The Firebase apiKey in src/firebase.ts is safe to keep in client code —
  Firebase's real security boundary is the Firestore rules above, not the
  API key. Just make sure the rules are set before going live.
- Login/Register support both email+password and "Continue with Google".
- Favorites: logged-in users get them synced to Firestore automatically;
  logged-out users get session-only favorites (cleared on refresh).
- Inquiries / Scheduled Visits tabs in the dashboard are UI placeholders —
  wire them to a Firestore collection the same way favorites work if you
  want them functional.
- Mock property data lives at the top of src/App.tsx (the PROPERTIES array).
