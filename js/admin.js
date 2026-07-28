/* ==========================================================================
   NESTORIA — Admin Panel
   ========================================================================== */
let CURRENT_PROPERTIES = [];
let EDITING_ID = null;

document.addEventListener("DOMContentLoaded", () => {
  const gate = document.getElementById("adminGate");
  const shell = document.getElementById("adminShell");

  auth.onAuthStateChanged(async (user) => {
    if(!user){
      gate.style.display = "block"; shell.style.display = "none";
      gate.innerHTML = adminGateMarkup("Please log in with an admin account to continue.", true);
      wireGateLogin();
      return;
    }
    const admin = await isAdminUser(user);
    if(!admin){
      gate.style.display = "block"; shell.style.display = "none";
      gate.innerHTML = adminGateMarkup(`Signed in as ${user.email}, but this account doesn't have admin access.`, false);
      return;
    }
    gate.style.display = "none"; shell.style.display = "flex";
    document.getElementById("adminEmail").textContent = user.email;
    initAdminPanel();
  });

  document.getElementById("adminLogoutBtn")?.addEventListener("click", () => {
    auth.signOut().then(() => location.reload());
  });

  document.getElementById("adminHamburger")?.addEventListener("click", () => {
    document.getElementById("adminSidebar").classList.toggle("open");
  });
});

function adminGateMarkup(message, showLogin){
  return `
    <div class="admin-gate">
      <h2 style="margin-bottom:10px;">Admin Access</h2>
      <p style="margin-bottom:20px;">${message}</p>
      ${showLogin ? `
      <form id="gateLoginForm" style="text-align:left;">
        <div class="field"><label>Email</label><input type="email" id="gateEmail" required placeholder="admin@nestoria.com"></div>
        <div class="field"><label>Password</label><input type="password" id="gatePassword" required placeholder="••••••••"></div>
        <div class="form-msg" id="gateMsg"></div>
        <button class="btn btn-primary btn-block" id="gateBtn">Log In</button>
      </form>` : `<a href="index.html" class="btn btn-outline">Back to site</a>`}
    </div>`;
}

function wireGateLogin(){
  const form = document.getElementById("gateLoginForm");
  if(!form) return;
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = document.getElementById("gateBtn");
    const msg = document.getElementById("gateMsg");
    btn.disabled = true; btn.textContent = "Signing in...";
    try{
      await auth.signInWithEmailAndPassword(
        document.getElementById("gateEmail").value.trim(),
        document.getElementById("gatePassword").value
      );
    }catch(err){
      showFormMsg(msg, "Incorrect email or password.", "error");
      btn.disabled = false; btn.textContent = "Log In";
    }
  });
}

/* ---- Main panel init ---- */
async function initAdminPanel(){
  await refreshProperties();
  loadInquiries();
  wirePropertyModal();

  document.getElementById("addPropertyBtn").addEventListener("click", () => openPropertyModal());
}

async function refreshProperties(){
  const tbody = document.getElementById("propertiesTbody");
  tbody.innerHTML = `<tr><td colspan="5"><div class="loading-row"><div class="spinner"></div> Loading...</div></td></tr>`;
  try{
    const snap = await db.collection("properties").orderBy("createdAt", "desc").get();
    CURRENT_PROPERTIES = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  }catch(e){
    CURRENT_PROPERTIES = [];
  }

  document.getElementById("statTotal").textContent = CURRENT_PROPERTIES.length;
  document.getElementById("statFeatured").textContent = CURRENT_PROPERTIES.filter(p=>p.featured).length;
  const avg = CURRENT_PROPERTIES.length ? Math.round(CURRENT_PROPERTIES.reduce((s,p)=>s+Number(p.price||0),0)/CURRENT_PROPERTIES.length) : 0;
  document.getElementById("statAvgPrice").textContent = avg ? formatPrice(avg) : "$0";

  if(!CURRENT_PROPERTIES.length){
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;color:var(--muted);padding:40px;">
      No properties yet — click "Add Property" to create your first listing.</td></tr>`;
    return;
  }

  tbody.innerHTML = CURRENT_PROPERTIES.map(p => `
    <tr>
      <td style="display:flex;align-items:center;gap:12px;">
        <img class="admin-thumb" src="${(p.images&&p.images[0])||''}" alt="">
        <div><div class="admin-row-title">${p.title}</div><div class="admin-row-sub">${p.city}, ${p.state}</div></div>
      </td>
      <td>${p.type||"—"}</td>
      <td>${formatPrice(p.price)}/mo</td>
      <td>${p.featured ? '<span class="badge badge-green">Featured</span>' : (p.tag ? `<span class="badge badge-orange">${p.tag}</span>` : "—")}</td>
      <td>
        <div class="row-actions">
          <button class="icon-btn" data-edit="${p.id}" aria-label="Edit">✎</button>
          <button class="icon-btn danger" data-delete="${p.id}" aria-label="Delete">🗑</button>
        </div>
      </td>
    </tr>`).join("");

  tbody.querySelectorAll("[data-edit]").forEach(btn => btn.addEventListener("click", () => {
    const p = CURRENT_PROPERTIES.find(x => x.id === btn.dataset.edit);
    openPropertyModal(p);
  }));
  tbody.querySelectorAll("[data-delete]").forEach(btn => btn.addEventListener("click", () => deleteProperty(btn.dataset.delete)));
}

async function deleteProperty(id){
  if(!confirm("Delete this property? This cannot be undone.")) return;
  try{
    await db.collection("properties").doc(id).delete();
    showToast("Property deleted", "success");
    refreshProperties();
  }catch(e){
    showToast("Could not delete property", "error");
  }
}

/* ---- Add / Edit modal ---- */
function wirePropertyModal(){
  document.getElementById("modalCloseBtn").addEventListener("click", closePropertyModal);
  document.getElementById("modalOverlay").addEventListener("click", (e) => {
    if(e.target.id === "modalOverlay") closePropertyModal();
  });
  document.getElementById("propertyForm").addEventListener("submit", savePropertyForm);
}

function openPropertyModal(p){
  EDITING_ID = p ? p.id : null;
  document.getElementById("modalTitle").textContent = p ? "Edit Property" : "Add Property";
  const f = document.getElementById("propertyForm");
  f.reset();
  document.getElementById("pTitle").value = p?.title || "";
  document.getElementById("pCity").value = p?.city || "";
  document.getElementById("pState").value = p?.state || "";
  document.getElementById("pType").value = p?.type || "House";
  document.getElementById("pPrice").value = p?.price || "";
  document.getElementById("pBeds").value = p?.beds || "";
  document.getElementById("pBaths").value = p?.baths || "";
  document.getElementById("pArea").value = p?.area || "";
  document.getElementById("pTag").value = p?.tag || "";
  document.getElementById("pFeatured").checked = !!p?.featured;
  document.getElementById("pAgentName").value = p?.agentName || "";
  document.getElementById("pImages").value = (p?.images || []).join(", ");
  document.getElementById("pDescription").value = p?.description || "";
  document.getElementById("pImageFile").value = "";
  document.getElementById("modalOverlay").classList.add("open");
}

function closePropertyModal(){
  document.getElementById("modalOverlay").classList.remove("open");
  EDITING_ID = null;
}

async function savePropertyForm(e){
  e.preventDefault();
  const btn = document.getElementById("savePropertyBtn");
  btn.disabled = true; btn.textContent = "Saving...";

  try{
    let images = document.getElementById("pImages").value.split(",").map(s=>s.trim()).filter(Boolean);

    const file = document.getElementById("pImageFile").files[0];
    if(file){
      btn.textContent = "Uploading image...";
      const ref = storage.ref(`properties/${Date.now()}_${file.name}`);
      await ref.put(file);
      const url = await ref.getDownloadURL();
      images.unshift(url);
    }

    const data = {
      title: document.getElementById("pTitle").value.trim(),
      city: document.getElementById("pCity").value.trim(),
      state: document.getElementById("pState").value.trim(),
      type: document.getElementById("pType").value,
      price: Number(document.getElementById("pPrice").value),
      beds: Number(document.getElementById("pBeds").value),
      baths: Number(document.getElementById("pBaths").value),
      area: Number(document.getElementById("pArea").value),
      tag: document.getElementById("pTag").value,
      featured: document.getElementById("pFeatured").checked,
      agentName: document.getElementById("pAgentName").value.trim(),
      description: document.getElementById("pDescription").value.trim(),
      images
    };

    if(EDITING_ID){
      await db.collection("properties").doc(EDITING_ID).update(data);
      showToast("Property updated", "success");
    }else{
      data.createdAt = firebase.firestore.FieldValue.serverTimestamp();
      await db.collection("properties").add(data);
      showToast("Property added", "success");
    }
    closePropertyModal();
    refreshProperties();
  }catch(err){
    showToast(err.message || "Could not save property", "error");
  }
  btn.disabled = false; btn.textContent = "Save Property";
}

/* ---- Inquiries list ---- */
async function loadInquiries(){
  const tbody = document.getElementById("inquiriesTbody");
  if(!tbody) return;
  try{
    const snap = await db.collection("inquiries").orderBy("createdAt", "desc").limit(30).get();
    if(snap.empty){
      tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;color:var(--muted);padding:30px;">No inquiries yet.</td></tr>`;
      return;
    }
    tbody.innerHTML = snap.docs.map(d => {
      const q = d.data();
      return `<tr>
        <td><div class="admin-row-title">${q.name||"—"}</div><div class="admin-row-sub">${q.email||""}</div></td>
        <td>${q.propertyTitle || "General inquiry"}</td>
        <td style="max-width:280px;">${(q.message||"").slice(0,90)}</td>
        <td>${q.phone||"—"}</td>
      </tr>`;
    }).join("");
  }catch(e){
    tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;color:var(--muted);padding:30px;">Could not load inquiries.</td></tr>`;
  }
}
