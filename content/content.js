(async () => {
  console.group("CYBERGUARD CONTENT SCRIPT");

  try {
    console.log("CyberGuard Content Script Loaded");

    const url = new URL(window.location.href);

    const unsupportedProtocols = [
      "chrome:",
      "edge:",
      "about:",
      "moz-extension:",
    ];

    if (unsupportedProtocols.includes(url.protocol)) {
      console.warn(`Unsupported page: ${window.location.href}`);

      return;
    }

    const domain = url.hostname.replace("www.", "");

    console.log("Current Domain:", domain);

    // ==========================
    // Backend Analysis
    // ==========================

    const response = await fetch(`http://localhost:3000/api/analyze/${domain}`);

    console.log("Backend Status:", response.status);

    if (!response.ok) {
      throw new Error(`Backend returned ${response.status}`);
    }

    const result = await response.json();

    console.log("Backend Response:");
    console.log(result);

    // ==========================
    // Show Banner Only For Risky Sites
    // ==========================

    if (
      result.risk.status === "warning" ||
      result.risk.status === "dangerous"
    ) {
      console.log("Displaying CyberGuard Banner");

      showCyberGuardBanner(result);
    } else {
      console.log("Site considered safe. No banner shown.");
    }
  } catch (error) {
    console.error("CyberGuard Content Script Error:");

    console.error(error);
  }

  console.groupEnd();
})();

function showCyberGuardBanner(result) {
  const banner = document.createElement("div");

  banner.innerHTML = `
    <div class="cg-header">
      🛡️ CyberGuard Alert
    </div>

    <div class="cg-body">
      ${result.risk.reasons.join("<br>")}
    </div>

    <div class="cg-score">
      Risk Score: ${result.risk.score}/100
    </div>

    <button id="cg-dismiss">
      Dismiss
    </button>
  `;

  // ==========================
  // Banner Styling
  // ==========================

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

  banner.style.opacity = "0";

  banner.style.transform = "translateX(100px)";

  banner.style.transition = "all 0.4s ease";

  const header = banner.querySelector(".cg-header");

  const body = banner.querySelector(".cg-body");

  const score = banner.querySelector(".cg-score");

  const button = banner.querySelector("#cg-dismiss");

  // ==========================
  // Dynamic Warning Color
  // ==========================

  if (result.risk.status === "dangerous") {
    header.style.background = "#dc2626";
  } else {
    header.style.background = "#f59e0b";
  }

  header.style.color = "white";
  header.style.padding = "15px";
  header.style.fontWeight = "bold";
  header.style.fontSize = "18px";

  body.style.padding = "15px";
  body.style.fontSize = "14px";

  score.style.padding = "0 15px 15px";

  score.style.fontWeight = "bold";

  score.style.color =
    result.risk.status === "dangerous" ? "#dc2626" : "#f59e0b";

  button.style.margin = "0 15px 15px";

  button.style.padding = "10px";

  button.style.border = "none";

  button.style.borderRadius = "8px";

  button.style.cursor = "pointer";

  button.onclick = () => {
    banner.style.opacity = "0";

    banner.style.transform = "translateX(100px)";

    setTimeout(() => {
      banner.remove();
    }, 400);
  };

  document.body.prepend(banner);

  setTimeout(() => {
    banner.style.opacity = "1";

    banner.style.transform = "translateX(0)";
  }, 10);
}
