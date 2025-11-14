/* ==========================================================
   EROS HUB - MAIN SCRIPT (Production Ready, Auth-Safe)
   ========================================================== */

/* ==========================
   ELEMENT SELECTORS
   ========================== */
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const searchContainer = document.querySelector(".search-container");
const searchButton = document.getElementById("searchButton");
const searchField = document.getElementById("searchField");
const imageContainer = document.getElementById("imageContainer");
const homeVideoGallery = document.getElementById("videoGallery");
const trendingSection = document.getElementById("trending");
const featuredSection = document.getElementById("featured");
const recentSection = document.getElementById("recent");
const userGallery = document.getElementById("userGallery");

/* ==========================================================
   NAV MENU TOGGLE (Mobile)
   ========================================================== */
menuToggle?.addEventListener("click", () => {
  menuToggle.classList.toggle("active");
  navLinks?.classList.toggle("active");
});

/* ==========================================================
   SEARCH BAR FUNCTIONALITY
   ========================================================== */
searchButton?.addEventListener("click", () => {
  searchContainer.classList.toggle("active");
  if (searchContainer.classList.contains("active")) {
    searchField.focus();
  } else {
    searchField.value = "";
    showMainSections();
  }
});

searchField?.addEventListener("keypress", (e) => {
  if (e.key === "Enter") performSearch();
});

/* ==========================================================
   SHOW / HIDE MAIN SECTIONS
   ========================================================== */
function hideMainSections() {
  [trendingSection, featuredSection, recentSection, userGallery].forEach((sec) => {
    if (!sec) return;
    sec.classList.add("fade-out");
    setTimeout(() => {
      sec.style.display = "none";
      sec.classList.remove("fade-out");
    }, 300);
  });

  if (homeVideoGallery) {
    homeVideoGallery.classList.replace("fade-show", "fade-hide");
    setTimeout(() => (homeVideoGallery.style.display = "none"), 400);
  }

  document.body.classList.add("content-focused");
}

function showMainSections() {
  [trendingSection, featuredSection, recentSection, userGallery].forEach((sec) => {
    if (!sec) return;
    sec.style.display = "";
    sec.classList.add("fade-in");
    setTimeout(() => sec.classList.remove("fade-in"), 300);
  });

  if (homeVideoGallery) {
    homeVideoGallery.style.display = "";
    homeVideoGallery.classList.replace("fade-hide", "fade-show");
  }

  document.body.classList.remove("content-focused");
}

/* ==========================================================
   RENDER VIDEO CARDS
   ========================================================== */
function renderVideos(videos, container) {
  if (!container) return;
  container.innerHTML = "";

  videos.forEach((v) => {
    const card = document.createElement("a");
    const embedUrl = v.embed || `https://www.eporner.com/embed/${v.id}/`;

    card.href = `video.html?url=${encodeURIComponent(embedUrl)}&title=${encodeURIComponent(v.title)}`;
    card.className = "video-card";
    card.target = "_self";

    card.innerHTML = `
      <img src="${v.default_thumb?.src || ''}" alt="${v.title}" loading="lazy">
      <div class="video-info">
        <p class="title">${v.title}</p>
        <p class="meta">${v.length_min || '?'} min • ${v.views?.toLocaleString() || '0'} views</p>
      </div>
    `;

    container.appendChild(card);
  });
}

/* ==========================================================
   GENERIC PAGINATION HANDLER
   ========================================================== */
function setupPagination(prevBtn, nextBtn, pageInfoEl, fetchFunction, pageSize = 20) {
  let page = 1;

  const updatePageInfo = (dataLength) => {
    pageInfoEl.textContent = `Page ${page}`;
    prevBtn.disabled = page <= 1;
    nextBtn.disabled = dataLength < pageSize;
  };

  prevBtn.addEventListener("click", () => {
    if (page > 1) fetchFunction(--page);
  });

  nextBtn.addEventListener("click", () => fetchFunction(++page));

  return updatePageInfo;
}

/* ==========================================================
   FETCH VIDEOS (Unified)
   ========================================================== */
async function loadVideos(container, updatePageInfo, page = 1, options = {}) {
  const { apiUrl, pageSize = 20 } = options;
  container.innerHTML = "<p style='color:#fff'>Loading...</p>";

  try {
    const res = await fetch(`${apiUrl}&per_page=${pageSize}&page=${page}`);
    const data = await res.json();

    if (data.videos?.length) {
      renderVideos(data.videos, container);
      updatePageInfo(data.videos.length);
    } else {
      container.innerHTML = "<p style='color:#fff'>No videos found.</p>";
      updatePageInfo(0);
    }
  } catch (err) {
    console.error(err);
    container.innerHTML = "<p style='color:#fff'>Failed to load videos.</p>";
  }
}

/* ==========================================================
   CATEGORY & SEARCH
   ========================================================== */
const dropBtn = document.querySelector(".dropbtn");
const dropdown = document.getElementById("categoryDropdown");
const categoryLinks = document.querySelectorAll("#categoryDropdown a");

dropBtn?.addEventListener("click", () => dropdown?.classList.toggle("show"));
window.addEventListener("click", (e) => {
  if (!e.target.matches(".dropbtn")) dropdown?.classList.remove("show");
});

categoryLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const category = e.target.dataset.category;
    loadResults(category, 1, "category");
  });
});

/* ==========================================================
   AGE VERIFICATION OVERLAY
   ========================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const ageOverlay = document.getElementById("ageOverlay");
  const backBtn = document.getElementById("backBtn");
  const confirmBtn = document.getElementById("confirmBtn");

  backBtn?.addEventListener("click", () => {
    ageOverlay.innerHTML = `<p style="color:#fff;font-size:1.2rem;text-align:center;">You must be 18+ to enter.</p>`;
    setTimeout(() => window.open("about:blank", "_self").close(), 1000);
  });

  confirmBtn?.addEventListener("click", () => {
    localStorage.setItem("ageVerified", "true");
    ageOverlay.classList.add("hidden");
  });
});

/* ==========================================================
   VIDEO SECTION PAGINATION (Trending, Featured, Recent)
   ========================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const sections = [
    { id: "trending", apiUrl: "https://www.eporner.com/api/v2/video/search/?order=top-weekly" },
    { id: "featured", apiUrl: "https://www.eporner.com/api/v2/video/search/?order=top-rated" },
    { id: "recent", apiUrl: "https://www.eporner.com/api/v2/video/search/?order=newest" },
  ];

  sections.forEach(({ id, apiUrl }) => {
    const grid = document.getElementById(`${id}Grid`);
    const prevBtn = document.getElementById(`${id}Prev`);
    const nextBtn = document.getElementById(`${id}Next`);
    const pageInfo = document.getElementById(`${id}PageInfo`);

    const updatePageInfo = setupPagination(prevBtn, nextBtn, pageInfo, (page) =>
      loadVideos(grid, updatePageInfo, page, { apiUrl, pageSize: 8 }),
      8
    );

    loadVideos(grid, updatePageInfo, 1, { apiUrl, pageSize: 8 });
  });
});

/* ==========================================================
   HOME VIDEO GALLERIES (Latest + User-Added)
   ========================================================== */
const latestContainer = document.getElementById("videoGrid");
const userContainer = document.getElementById("userAddedVideoGrid");

const updateLatestPageInfo = setupPagination(
  document.getElementById("prevPage"),
  document.getElementById("nextPage"),
  document.getElementById("pageInfo"),
  (page) =>
    loadVideos(latestContainer, updateLatestPageInfo, page, {
      apiUrl: "https://www.eporner.com/api/v2/video/search/?order=latest",
      pageSize: 20,
    }),
  20
);

const updateUserPageInfo = setupPagination(
  document.getElementById("userPrevPage"),
  document.getElementById("userNextPage"),
  document.getElementById("userPageInfo"),
  (page) =>
    loadVideos(userContainer, updateUserPageInfo, page, {
      apiUrl: "https://www.eporner.com/api/v2/video/search/?order=latest",
      pageSize: 12,
    }),
  12
);

/* ==========================================================
   INITIAL LOAD
   ========================================================== */
document.addEventListener("DOMContentLoaded", () => {
  loadVideos(latestContainer, updateLatestPageInfo, 1, {
    apiUrl: "https://www.eporner.com/api/v2/video/search/?order=latest",
    pageSize: 20,
  });

  loadVideos(userContainer, updateUserPageInfo, 1, {
    apiUrl: "https://www.eporner.com/api/v2/video/search/?order=latest",
    pageSize: 12,
  });
});

/* ==========================================================
   PAGINATED SEARCH & CATEGORY RESULTS
   ========================================================== */
const resultsSection = document.getElementById("resultsSection");
const resultsGrid = document.getElementById("resultsGrid");
const resultsTitle = document.getElementById("resultsTitle");
const resultsPrev = document.getElementById("resultsPrev");
const resultsNext = document.getElementById("resultsNext");
const resultsPageInfo = document.getElementById("resultsPageInfo");
const resultsPagination = document.getElementById("resultsPagination");

let currentResultsQuery = "";
let currentResultsPage = 1;
let currentResultsType = "search";

function updateResultsPageInfo(dataLength) {
  resultsPageInfo.textContent = `Page ${currentResultsPage}`;
  resultsPrev.disabled = currentResultsPage <= 1;
  resultsNext.disabled = dataLength < 12;
}

async function loadResults(query, page = 1, type = "search") {
  hideMainSections();
  currentResultsQuery = query;
  currentResultsPage = page;
  currentResultsType = type;

  resultsSection.style.display = "block";
  resultsGrid.innerHTML = "<p style='color:#fff'>Loading...</p>";
  resultsPagination.style.display = "flex";

  resultsTitle.textContent =
    type === "category"
      ? `📂 Category: ${query.charAt(0).toUpperCase() + query.slice(1)}`
      : `🔍 Search Results for: "${query}"`;

  try {
    const res = await fetch(
      `https://www.eporner.com/api/v2/video/search/?query=${encodeURIComponent(
        query
      )}&per_page=12&page=${page}`
    );
    const data = await res.json();

    if (data.videos?.length) {
      renderVideos(data.videos, resultsGrid);
      updateResultsPageInfo(data.videos.length);
    } else {
      resultsGrid.innerHTML = "<p style='color:#fff'>No results found.</p>";
      resultsPagination.style.display = "none";
    }
  } catch (err) {
    console.error(err);
    resultsGrid.innerHTML = "<p style='color:#fff'>Failed to load results.</p>";
    resultsPagination.style.display = "none";
  }
}

resultsPrev?.addEventListener("click", () => {
  if (currentResultsPage > 1)
    loadResults(currentResultsQuery, currentResultsPage - 1, currentResultsType);
});
resultsNext?.addEventListener("click", () => {
  loadResults(currentResultsQuery, currentResultsPage + 1, currentResultsType);
});

function performSearch() {
  const query = searchField.value.trim();
  if (query) loadResults(query, 1, "search");
  else showMainSections();
}
