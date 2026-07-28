/* ==========================================================================
   NESTORIA — demo fallback data + shared rendering/favorites helpers
   The site reads properties from Firestore ("properties" collection).
   If that collection is empty (fresh Firebase project), these demo listings
   are shown instead so the UI is never empty. Add real properties from the
   Admin Panel and they will take over automatically.
   ========================================================================== */

const DEMO_PROPERTIES = [
  {
    id: "demo-1",
    title: "Modern Ocean Villa",
    city: "Miami", state: "Florida",
    type: "Villa", price: 4200, beds: 4, baths: 3, area: 3200,
    tag: "Featured", featured: true,
    images: [
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "A sun-soaked oceanfront villa with floor-to-ceiling glass, a private infinity pool and uninterrupted Atlantic views. Designed for indoor-outdoor living with a chef's kitchen and landscaped terraces.",
    agentName: "Sarah Collins", agentEmail: "sarah@nestoria.com", agentPhone: "+1 (305) 555-0142"
  },
  {
    id: "demo-2",
    title: "Urban Luxury Apartment",
    city: "Chicago", state: "Illinois",
    type: "Apartment", price: 2850, beds: 2, baths: 2, area: 1450,
    tag: "New", featured: true,
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "A bright, freshly renovated apartment in the heart of the city with skyline views, wide-plank floors and a designer kitchen. Steps from transit, dining and the riverwalk.",
    agentName: "Marcus Reid", agentEmail: "marcus@nestoria.com", agentPhone: "+1 (312) 555-0198"
  },
  {
    id: "demo-3",
    title: "Sunny Autumn House",
    city: "Austin", state: "Texas",
    type: "House", price: 3100, beds: 3, baths: 2, area: 2100,
    tag: "Hot Deal", featured: true,
    images: [
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "A warm, light-filled family home with an open-plan living area, a landscaped backyard and a two-car garage in a quiet, tree-lined neighborhood minutes from downtown Austin.",
    agentName: "Priya Nair", agentEmail: "priya@nestoria.com", agentPhone: "+1 (512) 555-0176"
  },
  {
    id: "demo-4",
    title: "Hillside Glass House",
    city: "Malibu", state: "California",
    type: "Villa", price: 6800, beds: 5, baths: 4, area: 4100,
    tag: "Featured", featured: false,
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Perched above the coastline, this architectural glass home frames panoramic ocean views from every room, with a cantilevered deck, a saltwater pool and a private canyon trailhead.",
    agentName: "Daniel Ortiz", agentEmail: "daniel@nestoria.com", agentPhone: "+1 (310) 555-0120"
  },
  {
    id: "demo-5",
    title: "Downtown Loft Studio",
    city: "New York", state: "New York",
    type: "Apartment", price: 3600, beds: 1, baths: 1, area: 900,
    tag: "New", featured: false,
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "An industrial-chic loft with exposed brick, oversized windows and 11-foot ceilings in a converted warehouse building, moments from the subway and the city's best restaurants.",
    agentName: "Elena Fischer", agentEmail: "elena@nestoria.com", agentPhone: "+1 (212) 555-0133"
  },
  {
    id: "demo-6",
    title: "Lakeside Family Retreat",
    city: "Traverse City", state: "Michigan",
    type: "House", price: 2400, beds: 4, baths: 3, area: 2800,
    tag: "Hot Deal", featured: false,
    images: [
      "https://images.unsplash.com/photo-1568084680786-a84f91d1153c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "A relaxed, sunlit retreat steps from the lakeshore, with a screened porch, a stone fireplace and a dock for morning kayaking. Ideal as a full-time home or weekend escape.",
    agentName: "Tom Whitfield", agentEmail: "tom@nestoria.com", agentPhone: "+1 (231) 555-0164"
  }
];

/* ---- Load properties from Firestore, falling back to demo data ---- */
async function loadProperties(){
  try{
    const snap = await db.collection("properties").orderBy("createdAt", "desc").get();
    if(snap.empty) return DEMO_PROPERTIES;
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  }catch(e){
    console.warn("Falling back to demo properties:", e.message);
    return DEMO_PROPERTIES;
  }
}

async function loadPropertyById(id){
  const demo = DEMO_PROPERTIES.find(p => p.id === id);
  if(demo) return demo;
  try{
    const doc = await db.collection("properties").doc(id).get();
    if(doc.exists) return { id: doc.id, ...doc.data() };
  }catch(e){ console.warn(e.message); }
  return null;
}

const HEART_ICON = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>`;
const PIN_ICON = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" stroke="currentColor"><path d="M12 21s-7-6.1-7-11a7 7 0 0 1 14 0c0 4.9-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>`;

/* ---- Card markup ---- */
function propertyCardHTML(p){
  const tagClass = p.tag === "Hot Deal" ? "tag-hot" : p.tag === "New" ? "tag-new" : "tag-featured";
  const img = (p.images && p.images[0]) || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80";
  return `
  <div class="property-card" data-id="${p.id}">
    <div class="property-media">
      <a href="property-details.html?id=${p.id}"><img src="${img}" alt="${p.title}" loading="lazy"></a>
      ${p.tag ? `<span class="property-tag ${tagClass}">${p.tag}</span>` : ""}
      <button class="fav-toggle" data-fav="${p.id}" aria-label="Save to favorites">${HEART_ICON}</button>
    </div>
    <div class="property-body">
      <a href="property-details.html?id=${p.id}"><h3>${p.title}</h3></a>
      <div class="property-loc">${PIN_ICON} ${p.city}, ${p.state}</div>
      <div class="property-foot">
        <div>
          <div class="property-price">${formatPrice(p.price)} <span>/ month</span></div>
          <div class="property-meta"><span>${p.beds} bed</span><span>${p.baths} bath</span><span>${p.area} sqft</span></div>
        </div>
      </div>
    </div>
  </div>`;
}

function renderPropertyGrid(container, properties){
  if(!properties.length){
    container.innerHTML = `<div class="empty-state" style="grid-column:1/-1">
      <h3>No properties found</h3><p>Try adjusting your search filters.</p></div>`;
    return;
  }
  container.innerHTML = properties.map(propertyCardHTML).join("");
  wireFavoriteButtons(container);
}

/* ==========================================================================
   Favorites (Firestore, keyed by uid + propertyId)
   ========================================================================== */
async function getFavoriteIds(uid){
  if(!uid) return [];
  const snap = await db.collection("favorites").where("uid", "==", uid).get();
  return snap.docs.map(d => d.data().propertyId);
}

async function isFavorited(uid, propertyId){
  if(!uid) return false;
  const snap = await db.collection("favorites").where("uid", "==", uid).where("propertyId", "==", propertyId).limit(1).get();
  return !snap.empty;
}

async function toggleFavorite(propertyId, btn){
  const user = auth.currentUser;
  if(!user){
    showToast("Please log in to save favorites", "error");
    setTimeout(() => location.href = "login.html", 900);
    return;
  }
  const existing = await db.collection("favorites").where("uid", "==", user.uid).where("propertyId", "==", propertyId).limit(1).get();
  if(existing.empty){
    await db.collection("favorites").add({ uid: user.uid, propertyId, createdAt: firebase.firestore.FieldValue.serverTimestamp() });
    if(btn) btn.classList.add("active");
    showToast("Added to favorites", "success");
  }else{
    await db.collection("favorites").doc(existing.docs[0].id).delete();
    if(btn) btn.classList.remove("active");
    showToast("Removed from favorites");
  }
}

function wireFavoriteButtons(container){
  const user = auth.currentUser;
  container.querySelectorAll("[data-fav]").forEach(async btn => {
    const id = btn.getAttribute("data-fav");
    if(user && await isFavorited(user.uid, id)) btn.classList.add("active");
    btn.addEventListener("click", async (e) => {
      e.preventDefault(); e.stopPropagation();
      await toggleFavorite(id, btn);
    });
  });
}
