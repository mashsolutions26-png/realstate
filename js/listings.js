/* ==========================================================================
   NESTORIA — Listings page (with client-side filtering)
   ========================================================================== */
let ALL_PROPERTIES = [];

function applyFilters(){
  const loc = document.getElementById("filterLocation").value.trim().toLowerCase();
  const type = document.getElementById("filterType").value;
  const price = document.getElementById("filterPrice").value;
  const beds = document.getElementById("filterBeds").value;

  let results = ALL_PROPERTIES.filter(p => {
    if(loc && !(`${p.city} ${p.state}`.toLowerCase().includes(loc))) return false;
    if(type && p.type !== type) return false;
    if(beds && Number(p.beds) < Number(beds)) return false;
    if(price){
      const [min, max] = price.split("-").map(Number);
      if(max && (p.price < min || p.price > max)) return false;
      if(!max && p.price < min) return false;
    }
    return true;
  });

  const grid = document.getElementById("listingsGrid");
  const count = document.getElementById("resultsCount");
  count.textContent = `${results.length} propert${results.length === 1 ? "y" : "ies"} found`;
  renderPropertyGrid(grid, results);
}

document.addEventListener("DOMContentLoaded", async () => {
  const grid = document.getElementById("listingsGrid");
  grid.innerHTML = `<div class="loading-row"><div class="spinner"></div> Loading properties...</div>`;
  ALL_PROPERTIES = await loadProperties();

  // Prefill filters from query string (from home hero search)
  const loc = getParam("loc"); const type = getParam("type"); const price = getParam("price");
  if(loc) document.getElementById("filterLocation").value = loc;
  if(type) document.getElementById("filterType").value = type;
  if(price) document.getElementById("filterPrice").value = price;

  applyFilters();

  document.getElementById("filterForm").addEventListener("submit", (e) => {
    e.preventDefault();
    applyFilters();
  });
  document.getElementById("filterType").addEventListener("change", applyFilters);
  document.getElementById("filterPrice").addEventListener("change", applyFilters);
  document.getElementById("filterBeds").addEventListener("change", applyFilters);
});
