/* ==========================================================================
   NESTORIA — shared helpers used on every page
   ========================================================================== */

/* ---- Mobile hamburger menu ---- */
function initMobileNav(){
  const btn = document.getElementById("hamburgerBtn");
  const panel = document.getElementById("mobilePanel");
  if(!btn || !panel) return;
  btn.addEventListener("click", () => {
    panel.classList.toggle("open");
  });
  panel.querySelectorAll("a").forEach(a => a.addEventListener("click", () => panel.classList.remove("open")));
}

/* ---- Highlight current page in nav ---- */
function markActiveNav(){
  const file = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a, .mobile-panel a").forEach(a => {
    const href = a.getAttribute("href");
    if(href === file) a.classList.add("active");
  });
}

/* ---- Toast notifications ---- */
function showToast(message, type = ""){
  let toast = document.getElementById("globalToast");
  if(!toast){
    toast = document.createElement("div");
    toast.id = "globalToast";
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.className = "toast show" + (type ? " " + type : "");
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove("show"), 3200);
}

/* ---- Query string helper ---- */
function getParam(name){
  return new URLSearchParams(location.search).get(name);
}

/* ---- Formatting ---- */
function formatPrice(n){
  return "$" + Number(n).toLocaleString("en-US");
}

/* ---- Inline form message helper (used by auth/contact/property-details forms) ---- */
function showFormMsg(el, text, type){
  el.textContent = text;
  el.className = "form-msg show " + type;
}

/* ---- Auth-aware nav (login/register vs. user chip + logout) ---- */
function initAuthNav(){
  const desktopSlot = document.getElementById("navAuthSlot");
  const mobileSlot = document.getElementById("mobileAuthSlot");

  auth.onAuthStateChanged(user => {
    if(user){
      const initial = (user.displayName || user.email || "U").charAt(0).toUpperCase();
      const name = user.displayName || user.email.split("@")[0];
      if(desktopSlot){
        desktopSlot.innerHTML = `
          <a href="favorites.html" class="nav-user-chip">
            <span class="avatar-sm">${initial}</span> ${name}
          </a>
          <button class="btn btn-outline btn-sm" id="logoutBtn">Log Out</button>`;
      }
      if(mobileSlot){
        mobileSlot.innerHTML = `
          <a href="favorites.html">My Favorites</a>
          <a href="#" id="logoutBtnMobile">Log Out</a>`;
      }
      const doLogout = (e) => { e.preventDefault(); auth.signOut().then(()=>location.href="index.html"); };
      const b1 = document.getElementById("logoutBtn");
      const b2 = document.getElementById("logoutBtnMobile");
      if(b1) b1.addEventListener("click", doLogout);
      if(b2) b2.addEventListener("click", doLogout);
    }else{
      if(desktopSlot){
        desktopSlot.innerHTML = `
          <a href="login.html" class="btn btn-outline btn-sm">Log In</a>
          <a href="register.html" class="btn btn-primary btn-sm">Get Started</a>`;
      }
      if(mobileSlot){
        mobileSlot.innerHTML = `<a href="login.html">Log In</a><a href="register.html">Get Started</a>`;
      }
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initMobileNav();
  markActiveNav();
  initAuthNav();
  const yearEl = document.getElementById("year");
  if(yearEl) yearEl.textContent = new Date().getFullYear();
});
