// ==========================
// REUSABLE VIDEO RENDERER
// ==========================
function renderVideos(videos, container) {
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

// ==========================
// GENERIC PAGINATION HANDLER
// ==========================
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

  // return a function to update page info externally
  return updatePageInfo;
}

// ==========================
// FETCH VIDEOS (UNIFIED)
// ==========================
async function loadVideos(container, updatePageInfo, page = 1, options = {}) {
  const { apiUrl, pageSize = 20 } = options;

  container.innerHTML = "<p style='color:#fff'>Loading...</p>";

  try {
    const res = await fetch(`${apiUrl}&per_page=${pageSize}&page=${page}`);
    const data = await res.json();
    renderVideos(data.videos || [], container);
    updatePageInfo(data.videos?.length || 0);
  } catch (err) {
    container.innerHTML = "<p style='color:#fff'>Failed to load videos.</p>";
    console.error(err);
  }
}

// ==========================
// SELECT CONTAINERS & BUTTONS
// ==========================
const latestContainer = document.getElementById("videoGrid");
const userContainer = document.getElementById("userAddedVideoGrid");

// Latest Videos Pagination
const updateLatestPageInfo = setupPagination(
  document.getElementById("prevPage"),
  document.getElementById("nextPage"),
  document.getElementById("pageInfo"),
  (page) => loadVideos(latestContainer, updateLatestPageInfo, page, {
    apiUrl: "https://www.eporner.com/api/v2/video/search/?order=latest",
    pageSize: 20
  }),
  20
);

// User-Added Videos Pagination
const updateUserPageInfo = setupPagination(
  document.getElementById("userPrevPage"),
  document.getElementById("userNextPage"),
  document.getElementById("userPageInfo"),
  (page) => loadVideos(userContainer, updateUserPageInfo, page, {
    apiUrl: "https://www.eporner.com/api/v2/video/search/?order=latest",
    pageSize: 12
  }),
  12
);

// ==========================
// HIDE GALLERIES ON SEARCH/CATEGORY
// ==========================
function hideAllGalleries() {
  document.getElementById("videoGallery").style.display = "none";
  document.getElementById("userGallery").style.display = "none";
}

// ==========================
// INITIAL LOAD
// ==========================
document.addEventListener("DOMContentLoaded", () => {
  loadVideos(latestContainer, updateLatestPageInfo, 1, {
    apiUrl: "https://www.eporner.com/api/v2/video/search/?order=latest",
    pageSize: 20
  });
  loadVideos(userContainer, updateUserPageInfo, 1, {
    apiUrl: "https://www.eporner.com/api/v2/video/search/?order=latest",
    pageSize: 12
  });
});
