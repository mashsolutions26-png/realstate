/* ==========================================================================
   NESTORIA — Property details page
   ========================================================================== */
document.addEventListener("DOMContentLoaded", async () => {
  const id = getParam("id");
  const root = document.getElementById("pdRoot");
  if(!id){ root.innerHTML = `<div class="empty-state"><h3>No property selected</h3><p>Head back to listings to pick one.</p></div>`; return; }

  const p = await loadPropertyById(id);
  if(!p){ root.innerHTML = `<div class="empty-state"><h3>Property not found</h3><p>This listing may have been removed.</p></div>`; return; }

  document.title = `${p.title} — Nestoria`;

  const images = (p.images && p.images.length) ? p.images : ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80"];
  const thumbs = images.slice(1, 3);

  document.getElementById("pdGallery").innerHTML = `
    <div class="main-img"><img src="${images[0]}" alt="${p.title}"></div>
    <div class="pd-thumbs">
      ${thumbs.length ? thumbs.map(im => `<div><img src="${im}" alt="${p.title}"></div>`).join("") : `<div><img src="${images[0]}" alt="${p.title}"></div>`}
    </div>`;

  document.getElementById("pdHeader").innerHTML = `
    <div>
      <span class="eyebrow">${p.type || "Property"}</span>
      <h1>${p.title}</h1>
      <div class="property-loc">${PIN_ICON} ${p.city}, ${p.state}</div>
    </div>
    <button class="btn btn-outline" id="pdFavBtn" data-fav="${p.id}">${HEART_ICON} Save</button>`;

  document.getElementById("pdSpecs").innerHTML = `
    <div class="pd-spec"><strong>${p.beds}</strong><span>Bedrooms</span></div>
    <div class="pd-spec"><strong>${p.baths}</strong><span>Bathrooms</span></div>
    <div class="pd-spec"><strong>${p.area}</strong><span>Sq. Ft.</span></div>`;

  document.getElementById("pdDescription").textContent = p.description || "No description provided for this property yet.";

  document.getElementById("pdPriceBox").innerHTML = `
    <div class="amount">${formatPrice(p.price)}</div>
    <div class="per">per month</div>`;

  const agentInitial = (p.agentName || "N A").split(" ").map(w=>w[0]).slice(0,2).join("");
  document.getElementById("pdAgent").innerHTML = `
    <div class="agent-row">
      <div class="agent-avatar">${agentInitial}</div>
      <div>
        <div style="font-weight:700">${p.agentName || "Nestoria Agent"}</div>
        <div style="font-size:12.5px;color:var(--muted)">Listing Agent</div>
      </div>
    </div>`;

  wireFavoriteButtons(document.getElementById("pdHeader"));

  // Inquiry form
  const inquiryForm = document.getElementById("inquiryForm");
  inquiryForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = document.getElementById("inquiryBtn");
    const msg = document.getElementById("inquiryMsg");
    const name = document.getElementById("inqName").value.trim();
    const email = document.getElementById("inqEmail").value.trim();
    const phone = document.getElementById("inqPhone").value.trim();
    const message = document.getElementById("inqMessage").value.trim();

    btn.disabled = true; btn.textContent = "Sending...";
    try{
      await db.collection("inquiries").add({
        name, email, phone, message,
        propertyId: p.id, propertyTitle: p.title,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      showFormMsg(msg, "Your message has been sent to the agent!", "success");
      inquiryForm.reset();
    }catch(err){
      showFormMsg(msg, "Could not send your message. Please try again.", "error");
    }
    btn.disabled = false; btn.textContent = "Send Message";
  });
});
