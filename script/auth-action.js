/* ==========================================================
   EROS HUB - AUTH & CONDITIONAL ACTIONS
   ========================================================== */

/**
 * Handles "Add Video" button behavior
 * Opens the login or signup modal depending on user registration state.
 */

// Wait until the DOM is ready and modals are available
document.addEventListener("DOMContentLoaded", () => {
  const addVideoBtn = document.getElementById("addVideoBtn");
  const signupModal = document.getElementById("signupModal");
  const loginModal = document.getElementById("loginModal");

  // Helper functions from main.js (redefine here if loaded separately)
  const openModal = (modal) => {
    modal.style.display = "flex";
    document.body.style.overflow = "hidden";
  };

  // Check registration state (you can adjust this for real login later)
  const isRegistered = localStorage.getItem("userRegistered") === "true";

  addVideoBtn?.addEventListener("click", (e) => {
    e.preventDefault();

    if (isRegistered) {
      openModal(loginModal);
    } else {
      openModal(signupModal);
    }
  });
});

localStorage.setItem("userRegistered", "true");
