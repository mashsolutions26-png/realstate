/* ==========================================================================
   NESTORIA — Login & Register logic (Firebase Auth + Firestore user profile)
   ========================================================================== */

/* ---- Register ---- */
const registerForm = document.getElementById("registerForm");
if(registerForm){
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("regName").value.trim();
    const email = document.getElementById("regEmail").value.trim();
    const password = document.getElementById("regPassword").value;
    const msg = document.getElementById("registerMsg");
    const btn = document.getElementById("registerBtn");

    if(password.length < 6){
      showFormMsg(msg, "Password must be at least 6 characters.", "error");
      return;
    }

    btn.disabled = true; btn.textContent = "Creating account...";
    try{
      const cred = await auth.createUserWithEmailAndPassword(email, password);
      await cred.user.updateProfile({ displayName: name });
      await db.collection("users").doc(cred.user.uid).set({
        uid: cred.user.uid, name, email,
        isAdmin: false,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      showFormMsg(msg, "Account created! Redirecting...", "success");
      setTimeout(() => location.href = "index.html", 1000);
    }catch(err){
      showFormMsg(msg, friendlyAuthError(err), "error");
      btn.disabled = false; btn.textContent = "Create Account";
    }
  });
}

/* ---- Login ---- */
const loginForm = document.getElementById("loginForm");
if(loginForm){
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;
    const msg = document.getElementById("loginMsg");
    const btn = document.getElementById("loginBtn");

    btn.disabled = true; btn.textContent = "Signing in...";
    try{
      await auth.signInWithEmailAndPassword(email, password);
      const redirect = getParam("redirect") || "index.html";
      location.href = redirect;
    }catch(err){
      showFormMsg(msg, friendlyAuthError(err), "error");
      btn.disabled = false; btn.textContent = "Log In";
    }
  });
}

function friendlyAuthError(err){
  const map = {
    "auth/email-already-in-use": "An account with this email already exists.",
    "auth/invalid-email": "Please enter a valid email address.",
    "auth/user-not-found": "No account found with this email.",
    "auth/wrong-password": "Incorrect password. Please try again.",
    "auth/invalid-credential": "Incorrect email or password.",
    "auth/weak-password": "Please choose a stronger password (6+ characters)."
  };
  return map[err.code] || err.message || "Something went wrong. Please try again.";
}

/* If an already-logged-in user lands on login/register, send them home */
auth.onAuthStateChanged(user => {
  if(user && (loginForm || registerForm)){
    const onAuthPage = document.body.dataset.authPage;
    if(onAuthPage) location.href = getParam("redirect") || "index.html";
  }
});
