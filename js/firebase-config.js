/* ==========================================================================
   NESTORIA — Firebase configuration & initialization
   Uses the Firebase compat SDK (loaded via <script> tags in each HTML page)
   so every page can use plain global objects: firebase.auth(), firebase.firestore()...
   ========================================================================== */

const firebaseConfig = {
  apiKey: "AIzaSyD5KTlJKxpZ2BM9ohtx9h32zb5qj4gisY8",
  authDomain: "realstate-c5585.firebaseapp.com",
  projectId: "realstate-c5585",
  storageBucket: "realstate-c5585.firebasestorage.app",
  messagingSenderId: "216189514978",
  appId: "1:216189514978:web:1d74531d53e73dc3225abb",
  measurementId: "G-5BZXY0GPL2"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

/* Collections used across the app:
   - properties  { title, city, state, type, price, beds, baths, area, description,
                   images:[], tag, featured, createdAt, agentName }
   - users       { uid, name, email, createdAt, isAdmin }
   - favorites   { uid, propertyId, createdAt }
   - inquiries   { name, email, phone, message, propertyId (optional), propertyTitle (optional), createdAt }
*/

/* List of emails allowed into the Admin Panel. Edit this to add more admins,
   or manage an `isAdmin: true` flag on the user's Firestore document instead. */
const ADMIN_EMAILS = ["admin@nestoria.com"];

async function isAdminUser(user){
  if(!user) return false;
  if(ADMIN_EMAILS.includes(user.email)) return true;
  try{
    const doc = await db.collection("users").doc(user.uid).get();
    return doc.exists && doc.data().isAdmin === true;
  }catch(e){ return false; }
}
