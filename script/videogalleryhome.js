// ✅ USER ADDED VIDEOS PAGINATION + FETCH
let userPage = 1;

async function loadUserAddedVideos(page = 1) {
  const api = `https://www.eporner.com/api/v2/video/search/?page=${page}&per_page=12&order=latest&lq=1&format=json`;

  try {
    const res = await fetch(api);
    const data = await res.json();

    // We reuse your existing renderer:
    renderVideos(data.videos, document.getElementById("userAddedVideoGrid"));
    
    document.getElementById("userPageInfo").textContent = `Page ${page}`;
    document.getElementById("userPrevPage").disabled = page === 1;
  } catch (err) {
    console.error("Error loading user-added videos:", err);
  }
}

// Pagination buttons
document.getElementById("userNextPage").addEventListener("click", () => {
  userPage++;
  loadUserAddedVideos(userPage);
});

document.getElementById("userPrevPage").addEventListener("click", () => {
  if (userPage > 1) {
    userPage--;
    loadUserAddedVideos(userPage);
  }
});

// ✅ Initial load
loadUserAddedVideos();