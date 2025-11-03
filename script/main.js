/* ==========================================================
   EROS HUB - MAIN SCRIPT (Production Ready)
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
const trendingSection = document.getElementById("trending");
const featuredSection = document.getElementById("featured");
const recentSection = document.getElementById("recent");
const homeVideoGallery = document.getElementById("videoGallery");

/* ==========================
   NAV MENU TOGGLE (Mobile)
   ========================== */
menuToggle?.addEventListener("click", () => {
  menuToggle.classList.toggle("active");
  navLinks?.classList.toggle("active");
});

/* ==========================
   SEARCH BAR FUNCTIONALITY
   ========================== */
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

/* ==========================
   SHOW / HIDE MAIN SECTIONS
   ========================== */
function hideMainSections() {
  [trendingSection, featuredSection, recentSection].forEach((sec) => {
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
  [trendingSection, featuredSection, recentSection].forEach((sec) => {
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

/* ==========================
   RENDER VIDEO CARDS
   ========================== */
function renderVideos(videos, container) {
  if (!container) return;
  container.classList.add("fade-out");

  setTimeout(() => {
    container.innerHTML = "";

    videos.forEach((video) => {
      const videoCard = document.createElement("a");
      videoCard.className = "video-card";

      const videoId = video.id || video.url?.split("/video-")[1]?.split("/")[0];
      videoCard.href = `video.html?id=${videoId}&title=${encodeURIComponent(video.title)}`;
      videoCard.target = "_self";

      const img = document.createElement("img");
      img.src = video.default_thumb?.src || "";
      img.alt = video.title;

      const title = document.createElement("div");
      title.className = "video-title";
      title.textContent = video.title;

      const thumbs = (video.thumbs || []).map((t) => t.src);
      let intervalId = null;
      let currentIndex = 0;

      img.addEventListener("mouseenter", () => {
        if (!thumbs.length) return;
        intervalId = setInterval(() => {
          img.src = thumbs[currentIndex];
          currentIndex = (currentIndex + 1) % thumbs.length;
        }, 800);
      });

      img.addEventListener("mouseleave", () => {
        clearInterval(intervalId);
        img.src = video.default_thumb?.src || "";
      });

      videoCard.append(img, title);
      container.appendChild(videoCard);
    });

    container.classList.remove("fade-out");
    container.classList.add("fade-in");
    setTimeout(() => container.classList.remove("fade-in"), 300);
  }, 200);
}

/* ==========================
   FETCH & DISPLAY VIDEOS
   ========================== */
async function fetchAndDisplayVideos(query, label = "results") {
  hideMainSections();
  imageContainer.innerHTML = `<p>Loading ${label}...</p>`;

  try {
    const res = await fetch(
      `https://www.eporner.com/api/v2/video/search/?query=${encodeURIComponent(
        query
      )}&per_page=12&page=1`
    );
    const data = await res.json();

    if (data.videos?.length) {
      renderVideos(data.videos, imageContainer);
    } else {
      imageContainer.innerHTML = `<p>No ${label} found.</p>`;
    }
  } catch {
    imageContainer.innerHTML = `<p>Failed to load ${label}.</p>`;
  }
}

/* ==========================
   SEARCH FUNCTION
   ========================== */
function performSearch() {
  const query = searchField.value.trim();
  if (query) fetchAndDisplayVideos(query, `results for "${query}"`);
}

/* ==========================
   CATEGORY DROPDOWN FILTER
   ========================== */
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
    fetchAndDisplayVideos(category, `${category} videos`);
  });
});

/* ==========================
   LOAD HOMEPAGE SECTIONS
   ========================== */
document.addEventListener("DOMContentLoaded", () => {
  loadSection("trending", "https://www.eporner.com/api/v2/video/search/?order=top-weekly&per_page=8&page=1");
  loadSection("featured", "https://www.eporner.com/api/v2/video/search/?order=top-rated&per_page=8&page=1");
  loadSection("recent", "https://www.eporner.com/api/v2/video/search/?order=newest&per_page=8&page=1");
});

async function loadSection(sectionId, apiUrl) {
  const grid = document.getElementById(`${sectionId}Grid`);
  if (!grid) return;
  grid.innerHTML = "<p>Loading...</p>";

  try {
    const res = await fetch(apiUrl);
    const data = await res.json();
    renderVideos(data.videos || [], grid);
  } catch {
    grid.innerHTML = "<p>Failed to load videos.</p>";
  }
}

/* ==========================
   AGE VERIFICATION OVERLAY
   ========================== */
document.addEventListener("DOMContentLoaded", () => {
  const ageOverlay = document.getElementById("ageOverlay");
  const backBtn = document.getElementById("backBtn");
  const confirmBtn = document.getElementById("confirmBtn");

  // Uncomment below if you want to remember verification
  // if (localStorage.getItem("ageVerified") === "true") {
  //   ageOverlay.classList.add("hidden");
  //   return;
  // }

  backBtn?.addEventListener("click", () => {
    ageOverlay.innerHTML = `<p style="color:#fff;font-size:1.2rem;text-align:center;">You must be 18+ to enter.</p>`;
    setTimeout(() => {
      window.open("about:blank", "_self").close();
    }, 1000);
  });

  confirmBtn?.addEventListener("click", () => {
    localStorage.setItem("ageVerified", "true");
    ageOverlay.classList.add("hidden");
  });
});

/* ==========================
   AUTH MODALS FUNCTIONALITY
   ========================== */
const signupBtn = document.querySelector(".signup-btn");
const loginBtn = document.querySelector(".login-btn");
const signupModal = document.getElementById("signupModal");
const loginModal = document.getElementById("loginModal");
const closeSignup = document.getElementById("closeSignup");
const closeLogin = document.getElementById("closeLogin");
const switchToLogin = document.getElementById("switchToLogin");
const switchToSignup = document.getElementById("switchToSignup");

function openModal(modal) {
  modal.style.display = "flex";
  document.body.style.overflow = "hidden";
}

function closeModal(modal) {
  modal.style.display = "none";
  document.body.style.overflow = "";
}

// Open modals
signupBtn?.addEventListener("click", (e) => {
  e.preventDefault();
  openModal(signupModal);
});
loginBtn?.addEventListener("click", (e) => {
  e.preventDefault();
  openModal(loginModal);
});

// Close modals
closeSignup?.addEventListener("click", () => closeModal(signupModal));
closeLogin?.addEventListener("click", () => closeModal(loginModal));

// Switch between modals
switchToLogin?.addEventListener("click", (e) => {
  e.preventDefault();
  closeModal(signupModal);
  openModal(loginModal);
});
switchToSignup?.addEventListener("click", (e) => {
  e.preventDefault();
  closeModal(loginModal);
  openModal(signupModal);
});

// Close on background click
window.addEventListener("click", (e) => {
  if (e.target === signupModal) closeModal(signupModal);
  if (e.target === loginModal) closeModal(loginModal);
});

// Handle form submissions
const signupForm = document.getElementById("signupForm");
const loginForm = document.getElementById("loginForm");

signupForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  alert("Sign-up successful! (Integrate backend later.)");
  closeModal(signupModal);
  signupForm.reset();
});

loginForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  alert("Login successful! (Integrate backend later.)");
  closeModal(loginModal);
  loginForm.reset();
});

/* ==========================
   ELEMENT SELECTORS (EXTENDED)
   ========================== */
const userGallery = document.getElementById("userGallery");

/* ==========================
   MODIFY SHOW/HIDE FUNCTIONS
   ========================== */
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
