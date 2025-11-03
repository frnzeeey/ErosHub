const params = new URLSearchParams(window.location.search);

const videoUrl = params.get("url");
const videoId = params.get("id");
const videoTitle = params.get("title") || "Untitled Video";

let embedSrc = "";

// Build correct embed URL
if (videoUrl) {
  embedSrc = videoUrl;
} else if (videoId) {
  embedSrc = `https://www.eporner.com/embed/${videoId}/`;
}

// Apply values
document.getElementById("videoPlayer").src = embedSrc;
document.getElementById("videoTitle").textContent = videoTitle;
document.getElementById("videoDesc").textContent = "Enjoy watching ❤️";
