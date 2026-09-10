console.log("CyberGuard Content Script Loaded");

// Get current URL
const url = new URL(window.location.href);

// Analyze website
const result = analyzeWebsite(url);

// Test banner
if (true) {
  const banner = document.createElement("div");

  banner.innerHTML = `
        <div class="cg-header">
            🛡️ CyberGuard Warning
        </div>

        <div class="cg-body">
            This website may be unsafe.
        </div>

        <div class="cg-score">
            Risk Score: ${result.score}/100
        </div>

        <button id="cg-dismiss">
            Dismiss
        </button>
    `;

  // Banner
  banner.style.position = "fixed";
  banner.style.top = "20px";
  banner.style.right = "20px";
  banner.style.width = "350px";
  banner.style.background = "white";
  banner.style.borderRadius = "16px";
  banner.style.boxShadow = "0 8px 25px rgba(0,0,0,.15)";
  banner.style.padding = "0";
  banner.style.overflow = "hidden";
  banner.style.zIndex = "999999";
  banner.style.opacity="0";
  banner.style.transform="trasnlateX(100px)";
  banner.style.transition="all 0.4 ease";

  // Grab elements
  const header = banner.querySelector(".cg-header");
  const body = banner.querySelector(".cg-body");
  const score = banner.querySelector(".cg-score");
  const button = banner.querySelector("#cg-dismiss");

  // Header
  header.style.background = "#dc2626";
  header.style.color = "white";
  header.style.padding = "15px";
  header.style.fontWeight = "bold";
  header.style.fontSize = "18px";

  // Body
  body.style.padding = "15px";
  body.style.fontSize = "14px";

  // Score
  score.style.padding = "0 15px 15px";
  score.style.fontWeight = "bold";
  score.style.color = "#dc2626";

  // Button
  button.style.margin = "0 15px 15px";
  button.style.padding = "10px";
  button.style.border = "none";
  button.style.borderRadius = "8px";
  button.style.cursor = "pointer";

  button.onclick = () => banner.remove();

  document.body.prepend(banner);

  setTimeout(()=>{
    banner.style.opacity="1";
    banner.style.transform= "translateX(0)";
  }, 10);
}
