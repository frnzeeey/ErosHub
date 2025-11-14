/* ==========================================================
   EROS HUB - VIDEO PAGE SCRIPT (Search + Category + Pagination)
   ========================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const searchField = document.getElementById("searchField");
  const searchButton = document.getElementById("searchButton");
  const categoryLinks = document.querySelectorAll("#categoryDropdown a");
  const resultsSection = document.getElementById("resultsSection");
  const resultsTitle = document.getElementById("resultsTitle");
  const resultsGrid = document.getElementById("resultsGrid");
  const resultsPagination = document.getElementById("resultsPagination");
  const resultsPrev = document.getElementById("resultsPrev");
  const resultsNext = document.getElementById("resultsNext");
  const resultsPageInfo = document.getElementById("resultsPageInfo");

  let currentQuery = "";
  let currentPage = 1;
  let currentType = "search"; // "search" or "category"

  /* ==========================
     RENDER VIDEO CARDS
     ========================== */
  function renderVideos(videos) {
    resultsGrid.innerHTML = "";

    videos.forEach((v) => {
      const card = document.createElement("a");
      const embedUrl = v.embed || `https://www.eporner.com/embed/${v.id}/`;

      card.href = `video.html?url=${encodeURIComponent(embedUrl)}&title=${encodeURIComponent(v.title)}`;
      card.className = "video-card";
      card.target = "_self";

      card.innerHTML = `
        <img src="${v.default_thumb?.src || ""}" alt="${v.title}" loading="lazy">
        <div class="video-info">
          <p class="title">${v.title}</p>
          <p class="meta">${v.length_min || "?"} min • ${v.views?.toLocaleString() || "0"} views</p>
        </div>
      `;

      resultsGrid.appendChild(card);
    });
  }

  /* ==========================
     FETCH VIDEOS
     ========================== */
  async function loadResults(query, page = 1, type = "search") {
    currentQuery = query;
    currentPage = page;
    currentType = type;

    resultsSection.style.display = "block";
    resultsGrid.innerHTML = "<p style='color:#fff'>Loading...</p>";
    resultsPagination.style.display = "flex";

    // Dynamic title
    resultsTitle.textContent =
      type === "category"
        ? `📂 Category: ${query.charAt(0).toUpperCase() + query.slice(1)}`
        : `🔍 Search Results for: "${query}"`;

    try {
      const res = await fetch(
        `https://www.eporner.com/api/v2/video/search/?query=${encodeURIComponent(query)}&per_page=12&page=${page}`
      );
      const data = await res.json();

      if (data.videos?.length) {
        renderVideos(data.videos);
        updatePagination(data.videos.length);
      } else {
        resultsGrid.innerHTML = "<p style='color:#fff'>No results found.</p>";
        resultsPagination.style.display = "none";
      }
    } catch (err) {
      console.error(err);
      resultsGrid.innerHTML = "<p style='color:#fff'>Failed to load videos.</p>";
      resultsPagination.style.display = "none";
    }
  }

  /* ==========================
     PAGINATION
     ========================== */
  function updatePagination(dataLength) {
    resultsPageInfo.textContent = `Page ${currentPage}`;
    resultsPrev.disabled = currentPage <= 1;
    resultsNext.disabled = dataLength < 12;
  }

  resultsPrev.addEventListener("click", () => {
    if (currentPage > 1) loadResults(currentQuery, currentPage - 1, currentType);
  });

  resultsNext.addEventListener("click", () => {
    loadResults(currentQuery, currentPage + 1, currentType);
  });

  /* ==========================
     SEARCH HANDLER
     ========================== */
  function performSearch() {
    const query = searchField.value.trim();
    if (query) loadResults(query, 1, "search");
  }

  searchButton?.addEventListener("click", performSearch);
  searchField?.addEventListener("keypress", (e) => {
    if (e.key === "Enter") performSearch();
  });

  /* ==========================
     CATEGORY HANDLER
     ========================== */
  categoryLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const category = e.target.dataset.category;
      loadResults(category, 1, "category");
    });
  });
});
