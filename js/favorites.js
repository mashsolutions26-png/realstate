/* ==========================================================================
   NESTORIA — Favorites page
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("favoritesGrid");
  const gate = document.getElementById("favoritesGate");
  grid.innerHTML = `<div class="loading-row"><div class="spinner"></div> Loading your favorites...</div>`;

  auth.onAuthStateChanged(async (user) => {
    if(!user){
      grid.style.display = "none";
      gate.style.display = "block";
      return;
    }
    gate.style.display = "none";
    grid.style.display = "grid";

    const favSnap = await db.collection("favorites").where("uid", "==", user.uid).get();
    if(favSnap.empty){
      grid.innerHTML = `<div class="empty-state"><h3>No favorites yet</h3><p>Tap the heart icon on any property to save it here.</p></div>`;
      return;
    }
    const ids = favSnap.docs.map(d => d.data().propertyId);
    const properties = (await Promise.all(ids.map(id => loadPropertyById(id)))).filter(Boolean);
    renderPropertyGrid(grid, properties);
  });
});
