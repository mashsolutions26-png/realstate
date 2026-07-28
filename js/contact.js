/* ==========================================================================
   NESTORIA — Contact page
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");
  if(!form) return;
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = document.getElementById("contactBtn");
    const msg = document.getElementById("contactMsg");
    const name = document.getElementById("cName").value.trim();
    const email = document.getElementById("cEmail").value.trim();
    const phone = document.getElementById("cPhone").value.trim();
    const message = document.getElementById("cMessage").value.trim();

    btn.disabled = true; btn.textContent = "Sending...";
    try{
      await db.collection("inquiries").add({
        name, email, phone, message,
        propertyId: null, propertyTitle: null,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      showFormMsg(msg, "Thanks! Our team will get back to you shortly.", "success");
      form.reset();
    }catch(err){
      showFormMsg(msg, "Something went wrong. Please try again.", "error");
    }
    btn.disabled = false; btn.textContent = "Send Message";
  });
});
