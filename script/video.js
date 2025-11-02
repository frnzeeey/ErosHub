// ==========================
// LOAD VIDEO BY ID
// ==========================
const urlParams = new URLSearchParams(window.location.search);
const videoId = urlParams.get("id");

const videoPlayer = document.getElementById("videoPlayer");
const videoTitle = document.getElementById("videoTitle");
const videoDesc = document.getElementById("videoDesc");

if (!videoId) {
  videoTitle.textContent = "Video Not Found";
  videoDesc.textContent = "No video ID was provided.";
} else {
  loadVideo(videoId);
}

async function loadVideo(id) {
  const endpoint = `https://www.eporner.com/api/v2/video/id/?id=${id}`;

  try {
    const response = await fetch(endpoint);
    if (!response.ok) throw new Error("Failed to fetch video data");

    const data = await response.json();

    // Set player and metadata
    videoPlayer.src = data.embed;
    videoTitle.textContent = data.title;
    videoDesc.textContent = data.tags.join(", ");
  } catch (err) {
    console.error(err);
    videoTitle.textContent = "                         ";
    videoDesc.textContent = "                          ";
  }
}
