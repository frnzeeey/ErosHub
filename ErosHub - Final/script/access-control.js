/* ==========================================================
   EROSHUB — ACCESS CONTROL (Upload + User Gallery Lock)
   ========================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const uploadModal = document.getElementById("uploadModal");
  const closeUpload = document.getElementById("closeUpload");
  const addVideoBtn = document.getElementById("addVideoBtn");
  const loginModal = document.getElementById("loginModal");
  const userGallerySection = document.getElementById("userGallery");
  const userLockOverlay = document.getElementById("userLockOverlay");

  // ===== Helper: Check login state =====
  function isUserLoggedIn() {
    const user = JSON.parse(localStorage.getItem("erosUser"));
    return user && user.email && user.password;
  }

  // ===== Upload button access control =====
  addVideoBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    if (!isUserLoggedIn()) {
      alert("⚠️ Please log in first before uploading videos.");
      if (loginModal) loginModal.style.display = "flex";
      if (uploadModal) uploadModal.style.display = "none";
      return false;
    }
    uploadModal.style.display = "flex";
  });

  closeUpload?.addEventListener("click", () => {
    if (uploadModal) uploadModal.style.display = "none";
  });

  window.addEventListener("click", (e) => {
    if (e.target === uploadModal) uploadModal.style.display = "none";
  });

  // ===== Update Gallery Lock/Unlock =====
  function updateUserGalleryVisibility() {
    if (!userGallerySection) return;

    const loggedIn = isUserLoggedIn();

    if (loggedIn) {
      // 🔓 Unlock
      userGallerySection.classList.remove("locked");
      userGallerySection.style.pointerEvents = "auto";
      userGallerySection.style.filter = "none";
      userGallerySection.style.opacity = "1";
      if (userLockOverlay) {
        userLockOverlay.style.transition = "opacity 0.3s ease";
        userLockOverlay.style.opacity = "0";
        setTimeout(() => (userLockOverlay.style.display = "none"), 300);
      }
    } else {
      // 🔒 Lock
      userGallerySection.classList.add("locked");
      userGallerySection.style.pointerEvents = "none";
      userGallerySection.style.filter = "blur(2px) grayscale(50%)";
      userGallerySection.style.opacity = "0.6";
      if (userLockOverlay) {
        userLockOverlay.style.display = "flex";
        setTimeout(() => (userLockOverlay.style.opacity = "1"), 10);
      }
    }
  }

  // Expose for global use (auth-final.js calls this instantly)
  window.refreshUserGallery = updateUserGalleryVisibility;

  // Clicking the overlay opens Login
  if (userLockOverlay) {
    userLockOverlay.addEventListener("click", () => {
      if (!isUserLoggedIn() && loginModal) {
        loginModal.style.display = "flex";
      }
    });
  }

  // Initial update on load
  updateUserGalleryVisibility();

  // React to manual login/logout or cross-tab
  window.addEventListener("userStatusChanged", updateUserGalleryVisibility);
  window.addEventListener("storage", (event) => {
    if (event.key === "erosUser") updateUserGalleryVisibility();
  });
});
