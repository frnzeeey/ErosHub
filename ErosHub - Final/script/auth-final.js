/* ==========================================================
   EROS HUB - AUTH + PROFILE (FINAL MERGED, FULLY FIXED)
   ========================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const $ = (id) => document.getElementById(id);

  // ===== Modals =====
  const signupModal = $("signupModal");
  const loginModal = $("loginModal");
  const uploadModal = $("uploadModal");
  const authButtons = $("authButtons");
  const userGreeting = $("userGreeting");
  const welcomeText = $("welcomeText");

  // ===== User Utils =====
  const getUser = () => JSON.parse(localStorage.getItem("erosUser"));
  const setUser = (u) => localStorage.setItem("erosUser", JSON.stringify(u));
  const clearUser = () => localStorage.removeItem("erosUser");

  // ===== Navbar Update =====
  function updateNavbar() {
    const user = getUser();
    if (user) {
      authButtons.style.display = "none";
      userGreeting.style.display = "flex";
      welcomeText.textContent = `👋 Welcome, ${user.username || user.email}`;
      toggleProfileVisibility(true, user.username || user.email);
    } else {
      authButtons.style.display = "flex";
      userGreeting.style.display = "none";
      toggleProfileVisibility(false);
    }
  }

  // ===== Modal Helpers =====
  const openModal = (m) => (m.style.display = "flex");
  const closeModal = (m) => (m.style.display = "none");

  // ===== Fix: Add event listeners for Signup/Login buttons =====
  document.querySelector(".signup-btn")?.addEventListener("click", (e) => {
    e.preventDefault();
    openModal(signupModal);
  });

  document.querySelector(".login-btn")?.addEventListener("click", (e) => {
    e.preventDefault();
    openModal(loginModal);
  });

  // ===== Close Modals When Clicking Outside =====
  window.addEventListener("click", (e) => {
    const modals = [signupModal, loginModal, uploadModal];
    const profileModalEl = document.getElementById("profileModal");
    modals.push(profileModalEl);

    modals.forEach((m) => {
      if (m && e.target === m) closeModal(m);
    });
  });

  // ===== Close Buttons =====
  $("closeSignup")?.addEventListener("click", () => closeModal(signupModal));
  $("closeLogin")?.addEventListener("click", () => closeModal(loginModal));
  $("closeUpload")?.addEventListener("click", () => closeModal(uploadModal));

  // ===== Sign Up =====
  const signupForm = $("signupForm");
  signupForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = $("signupUsername").value.trim();
    const email = $("signupEmail").value.trim();
    const password = $("signupPassword").value.trim();
    const birthdate = $("signupBirthdate").value;

    if (!username || !email || !password || !birthdate)
      return alert("⚠️ Please fill out all fields.");

    setUser({ username, email, password, birthdate });
    localStorage.setItem("userProfile", JSON.stringify({ name: username }));

    closeModal(signupModal);
    alert("✅ Signup successful!");
    updateNavbar();
  });

  // ===== Login =====
  const loginForm = $("loginForm");
  loginForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = $("loginEmail").value.trim();
    const password = $("loginPassword").value.trim();
    const stored = getUser();

    if (!stored) return alert("⚠️ No account found.");
    if (stored.email === email && stored.password === password) {
      alert(`✅ Welcome back, ${stored.username}!`);
      closeModal(loginModal);
      updateNavbar();
    } else alert("❌ Invalid credentials.");
  });

  updateNavbar();
});

/* ==========================================================
   PROFILE SECTION (Editable, Logout inside, Backend-ready)
========================================================== */

const profileIcon = document.getElementById("profileIcon");
const profileModal = document.getElementById("profileModal");
const closeProfile = document.getElementById("closeProfile");
const profileForm = document.getElementById("profileForm");
const profileName = document.getElementById("profileName");
const profileLocation = document.getElementById("profileLocation");
const profileBio = document.getElementById("profileBio");
const profileAvatarImg = document.getElementById("profileAvatarImg");
const profileAvatarPreview = document.getElementById("profileAvatarPreview");
const profilePhotoInput = document.getElementById("profilePhotoInput");
const changePhotoBtn = document.getElementById("changePhotoBtn");
const removePhotoBtn = document.getElementById("removePhotoBtn");
const logoutBtnModal = document.getElementById("logoutBtnModal");
const welcomeText = document.getElementById("welcomeText");

let savedProfile = JSON.parse(localStorage.getItem("userProfile")) || {
  name: "User",
  location: "",
  bio: "",
  photoDataUrl: "",
};

// ===== Render Navbar Avatar =====
function renderNavbarAvatar() {
  if (savedProfile.photoDataUrl) {
    profileAvatarImg.src = savedProfile.photoDataUrl;
  } else {
    const initial = (savedProfile.name || "U")[0].toUpperCase();
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'>
      <rect width='100%' height='100%' fill='#222'/>
      <text x='50%' y='50%' dy='.35em' text-anchor='middle' font-size='96' fill='#ff3333' font-family='Montserrat'>${initial}</text>
    </svg>`;
    profileAvatarImg.src = `data:image/svg+xml;charset=utf8,${encodeURIComponent(svg)}`;
  }
}

// ===== Populate Modal =====
function showProfileData() {
  profileName.value = savedProfile.name;
  profileLocation.value = savedProfile.location;
  profileBio.value = savedProfile.bio;
  profileAvatarPreview.src =
    savedProfile.photoDataUrl || "assets/icons/user-profile.svg";
}

// ===== Open/Close =====
profileIcon?.addEventListener("click", () => {
  showProfileData();
  profileModal.style.display = "flex";
});
closeProfile?.addEventListener("click", () => (profileModal.style.display = "none"));

// ===== Photo Upload =====
changePhotoBtn?.addEventListener("click", () => profilePhotoInput.click());
profilePhotoInput?.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    savedProfile.photoDataUrl = ev.target.result;
    localStorage.setItem("userProfile", JSON.stringify(savedProfile));
    profileAvatarPreview.src = savedProfile.photoDataUrl;
    renderNavbarAvatar();
  };
  reader.readAsDataURL(file);
});

removePhotoBtn?.addEventListener("click", () => {
  savedProfile.photoDataUrl = "";
  localStorage.setItem("userProfile", JSON.stringify(savedProfile));
  renderNavbarAvatar();
  profileAvatarPreview.src = "assets/icons/user-profile.svg";
});

// ===== Save Profile =====
profileForm?.addEventListener("submit", (e) => {
  e.preventDefault();

  savedProfile.name = profileName.value.trim() || "User";
  savedProfile.location = profileLocation.value.trim();
  savedProfile.bio = profileBio.value.trim();
  localStorage.setItem("userProfile", JSON.stringify(savedProfile));

  // ✅ Live update the greeting
  if (welcomeText)
    welcomeText.textContent = `👋 Welcome, ${savedProfile.name}`;

  renderNavbarAvatar();
  alert("✅ Profile updated successfully!");
  profileModal.style.display = "none";
});

// ===== Logout =====
logoutBtnModal?.addEventListener("click", () => {
  localStorage.removeItem("erosUser");
  localStorage.removeItem("userProfile");
  profileModal.style.display = "none";
  location.reload();
});

// ===== Toggle Profile Icon =====
function toggleProfileVisibility(isLoggedIn, username) {
  const icon = document.getElementById("profileIcon");
  if (!icon) return;
  icon.style.display = isLoggedIn ? "flex" : "none";
  if (isLoggedIn && username && !savedProfile.name) {
    savedProfile.name = username;
    localStorage.setItem("userProfile", JSON.stringify(savedProfile));
  }
  renderNavbarAvatar();
}

renderNavbarAvatar();

/* ==========================================================
   ADD BUTTON — Open/Close Upload Modal + File Size Display
   ========================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const addVideoBtn = document.getElementById("addVideoBtn");
  const uploadModal = document.getElementById("uploadModal");
  const closeUpload = document.getElementById("closeUpload");
  const mediaFileInput = document.getElementById("mediaFile");
  const fileSizeText = document.getElementById("fileSizeText");

  // === Open Upload Modal ===
  addVideoBtn?.addEventListener("click", () => {
    uploadModal.style.display = "flex";
  });

  // === Close Upload Modal ===
  closeUpload?.addEventListener("click", () => {
    uploadModal.style.display = "none";
  });

  // === Optional: Close by clicking outside modal ===
  window.addEventListener("click", (e) => {
    if (e.target === uploadModal) uploadModal.style.display = "none";
  });

  // === File Size Display ===
  mediaFileInput?.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) {
      fileSizeText.textContent = "No file selected.";
      return;
    }

    const sizeInKB = file.size / 1024;
    const sizeFormatted =
      sizeInKB > 1024
        ? `${(sizeInKB / 1024).toFixed(2)} MB`
        : `${sizeInKB.toFixed(1)} KB`;

    fileSizeText.textContent = `📁 ${file.name} — ${sizeFormatted}`;
  });
});

/* ==========================================================
   EROSHUB — AUTH MODAL SWITCH + SOCIAL LOGIN (Final Merge)
   ========================================================== */
document.addEventListener("DOMContentLoaded", () => {
  /* ===== Modal References ===== */
  const signupModal = document.getElementById("signupModal");
  const loginModal = document.getElementById("loginModal");
  const switchToLogin = document.getElementById("switchToLogin");
  const switchToSignup = document.getElementById("switchToSignup");

  /* ===== Helper Functions ===== */
  const openModal = (modal) => (modal.style.display = "flex");
  const closeModal = (modal) => (modal.style.display = "none");

  /* ==========================================================
     SWITCH BETWEEN SIGNUP <-> LOGIN MODALS
     ========================================================== */
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

  /* ==========================================================
     SOCIAL MEDIA SIGNUP / LOGIN HANDLERS (Backend Ready)
     ========================================================== */
  const socialButtons = document.querySelectorAll(".social-btn");

  socialButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const platform = btn.getAttribute("data-platform");

      switch (platform) {
        case "gmail":
          alert("🔗 Redirecting to Gmail authentication...");
          // Example for backend integration:
          // window.location.href = "/auth/google";
          break;

        case "twitch":
          alert("🎮 Redirecting to Twitch authentication...");
          // Example for backend integration:
          // window.location.href = "/auth/twitch";
          break;

        case "x":
          alert("🐦 Redirecting to X (Twitter) authentication...");
          // Example for backend integration:
          // window.location.href = "/auth/twitter";
          break;

        default:
          alert("⚠️ Unknown social platform.");
      }
    });
  });

  /* ==========================================================
     OPTIONAL — CLOSE MODAL WHEN CLICKING OUTSIDE
     ========================================================== */
  window.addEventListener("click", (e) => {
    if (e.target === signupModal) closeModal(signupModal);
    if (e.target === loginModal) closeModal(loginModal);
  });
});


/* ==========================================================
   EROSHUB — UPLOAD ACCESS PROTECTION (FINAL LOCKED VERSION)
   ========================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const addVideoBtn = document.getElementById("addVideoBtn");
  const uploadModal = document.getElementById("uploadModal");
  const closeUpload = document.getElementById("closeUpload");
  const loginModal = document.getElementById("loginModal");

  // Helper: Check login status
  function isUserLoggedIn() {
    const user = JSON.parse(localStorage.getItem("erosUser"));
    return user && user.email && user.password; // stricter validation
  }

  // 🛑 Hide upload modal immediately if user isn't logged in
  if (!isUserLoggedIn()) {
    if (uploadModal) uploadModal.style.display = "none";
  }

  // Add Button click
  addVideoBtn?.addEventListener("click", (e) => {
    e.preventDefault();

    if (!isUserLoggedIn()) {
      alert("⚠️ Please login first before uploading videos.");
      if (loginModal) loginModal.style.display = "flex";
      if (uploadModal) uploadModal.style.display = "none"; // 🧱 force-hide just in case
      return false; // ⛔ Stop execution immediately
    }

    // ✅ Logged in → open modal
    if (uploadModal) uploadModal.style.display = "flex";
  });

  // Close upload modal button
  closeUpload?.addEventListener("click", () => {
    if (uploadModal) uploadModal.style.display = "none";
  });

  // Close when clicking outside
  window.addEventListener("click", (e) => {
    if (e.target === uploadModal) uploadModal.style.display = "none";
  });

    // === Auto-unlock sync fix ===
  window.addEventListener("userStatusChanged", () => {
    if (typeof window.refreshUserGallery === "function") {
      window.refreshUserGallery();
    }
  });

});
