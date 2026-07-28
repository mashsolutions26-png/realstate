/* ==========================================================================
   NESTORIA — Home page
   ========================================================================== */
document.addEventListener("DOMContentLoaded", async () => {
  const grid = document.getElementById("featuredGrid");
  if(grid){
    grid.innerHTML = `<div class="loading-row"><div class="spinner"></div> Loading properties...</div>`;
    const all = await loadProperties();
    const featured = all.filter(p => p.featured).slice(0, 6);
    renderPropertyGrid(grid, featured.length ? featured : all.slice(0, 6));
  }

  const heroSearch = document.getElementById("heroSearchForm");
  if(heroSearch){
    heroSearch.addEventListener("submit", (e) => {
      e.preventDefault();
      const loc = document.getElementById("heroLocation").value;
      const type = document.getElementById("heroType").value;
      const price = document.getElementById("heroPrice").value;
      const params = new URLSearchParams();
      if(loc) params.set("loc", loc);
      if(type) params.set("type", type);
      if(price) params.set("price", price);
      location.href = "listings.html" + (params.toString() ? "?" + params.toString() : "");
    });
  }
});
