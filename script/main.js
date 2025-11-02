// ==========================
// ELEMENT SELECTORS
// ==========================
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const searchContainer = document.querySelector(".search-container");
const searchButton = document.getElementById("searchButton");
const searchField = document.getElementById("searchField");
const imageContainer = document.getElementById("imageContainer");
const trendingSection = document.getElementById("trending");
const featuredSection = document.getElementById("featured");
const recentSection = document.getElementById("recent");

// ==========================
// NAV MENU TOGGLE (Mobile/Tablet)
// ==========================
menuToggle.addEventListener("click", () => {
  menuToggle.classList.toggle("active");
  navLinks.classList.toggle("active");
});

// ==========================
// SEARCH BAR EXPAND/COLLAPSE
// ==========================
searchButton.addEventListener("click", () => {
  searchContainer.classList.toggle("active");
  const isActive = searchContainer.classList.contains("active");
  if (isActive) searchField.focus();
  else searchField.value = "";
});

searchField.addEventListener("keypress", (e) => {
  if (e.key === "Enter") performSearch();
});

// ==========================
// HIDE / SHOW MAIN SECTIONS
// ==========================
function hideMainSections() {
  [trendingSection, featuredSection, recentSection].forEach((sec) => {
    sec.classList.add("fade-out");
    setTimeout(() => (sec.style.display = "none"), 300);
  });
  document.body.classList.add("content-focused");
}

function showMainSections() {
  [trendingSection, featuredSection, recentSection].forEach((sec) => {
    sec.style.display = "";
    sec.classList.remove("fade-out");
    sec.classList.add("fade-in");
    setTimeout(() => sec.classList.remove("fade-in"), 300);
  });
  document.body.classList.remove("content-focused");
}

// ==========================
// RENDER VIDEO CARDS
// ==========================
function renderVideos(videos, container) {
  container.classList.add("fade-out");
  setTimeout(() => {
    container.innerHTML = "";
    videos.forEach((video) => {
      const videoCard = document.createElement("a");
      videoCard.classList.add("video-card");

      const videoId = video.id || video.url.split("/video-")[1]?.split("/")[0];
      videoCard.href = `video.html?id=${videoId}`;
      videoCard.target = "_self";

      const img = document.createElement("img");
      img.src = video.default_thumb?.src || "";
      img.alt = video.title;

      const title = document.createElement("div");
      title.classList.add("video-title");
      title.textContent = video.title;

      // Hover preview animation
      const thumbs = (video.thumbs || []).map((t) => t.src);
      let intervalId = null;
      let currentIndex = 0;

      img.addEventListener("mouseenter", () => {
        if (!thumbs.length) return;
        intervalId = setInterval(() => {
          img.src = thumbs[currentIndex];
          currentIndex = (currentIndex + 1) % thumbs.length;
        }, 1000);
      });

      img.addEventListener("mouseleave", () => {
        clearInterval(intervalId);
        img.src = video.default_thumb?.src || "";
      });

      videoCard.appendChild(img);
      videoCard.appendChild(title);
      container.appendChild(videoCard);
    });
    container.classList.remove("fade-out");
    container.classList.add("fade-in");
    setTimeout(() => container.classList.remove("fade-in"), 300);
  }, 200);
}

// ==========================
// FETCH & DISPLAY VIDEOS
// ==========================
async function fetchAndDisplayVideos(query, label = "results") {
  hideMainSections();
  imageContainer.innerHTML = `<p>Loading ${label}...</p>`;

  try {
    const response = await fetch(
      `https://www.eporner.com/api/v2/video/search/?query=${encodeURIComponent(
        query
      )}&per_page=12&page=1`
    );
    const data = await response.json();

    if (data.videos?.length) {
      renderVideos(data.videos, imageContainer);
    } else {
      imageContainer.innerHTML = `<p>No ${label} found.</p>`;
    }
  } catch (error) {
    console.error("Error fetching videos:", error);
    imageContainer.innerHTML = `<p>Failed to load ${label}.</p>`;
  }
}

// ==========================
// SEARCH FUNCTION
// ==========================
function performSearch() {
  const query = searchField.value.trim();
  if (query) fetchAndDisplayVideos(query, `results for "${query}"`);
}

// ==========================
// CATEGORY DROPDOWN FILTER
// ==========================
const dropBtn = document.querySelector(".dropbtn");
const dropdown = document.getElementById("categoryDropdown");
const categoryLinks = document.querySelectorAll("#categoryDropdown a");

if (dropBtn && dropdown) {
  dropBtn.addEventListener("click", () => dropdown.classList.toggle("show"));
  window.addEventListener("click", (e) => {
    if (!e.target.matches(".dropbtn")) dropdown.classList.remove("show");
  });
}

categoryLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const category = e.target.dataset.category;
    fetchAndDisplayVideos(category, `${category} videos`);
  });
});

// ==========================
// LOAD HOMEPAGE SECTIONS
// ==========================
document.addEventListener("DOMContentLoaded", () => {
  loadVideos("trending", "https://www.eporner.com/api/v2/video/search/?order=top-weekly&per_page=8&page=1");
  loadVideos("featured", "https://www.eporner.com/api/v2/video/search/?order=top-rated&per_page=8&page=1");
  loadVideos("recent", "https://www.eporner.com/api/v2/video/search/?order=newest&per_page=8&page=1");
});

async function loadVideos(sectionId, apiUrl) {
  const grid = document.getElementById(sectionId + "Grid");
  grid.innerHTML = "<p>Loading...</p>";

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    renderVideos(data.videos || [], grid);
  } catch (error) {
    console.error("Error loading section:", error);
    grid.innerHTML = "<p>Failed to load videos.</p>";
  }
}
