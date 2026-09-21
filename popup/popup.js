chrome.tabs.query(
  {
    active: true,
    currentWindow: true,
  },
  async function (tabs) {
    try {
      console.group("CYBERGUARD ANALYSIS");

      // =====================================
      // CURRENT TAB
      // =====================================

      const url = new URL(tabs[0].url);

      const unsupportedProtocols = [
        "chrome:",
        "edge:",
        "about:",
        "moz-extension:",
      ];

      if (unsupportedProtocols.includes(url.protocol)) {
        console.warn(`Unsupported page detected: ${tabs[0].url}`);

        document.getElementById("status").textContent = "Unsupported Page";

        document.getElementById("website").textContent = tabs[0].url;

        document.getElementById("factors").innerHTML =
          "<li>CyberGuard cannot analyze browser internal pages.</li>";

        return;
      }

      const domain = url.hostname.replace("www.", "");

      if (!domain.includes(".")) {
        console.warn(`Invalid domain detected: ${domain}`);

        document.getElementById("status").textContent = "Invalid Domain";

        document.getElementById("website").textContent = domain;

        document.getElementById("factors").innerHTML =
          "<li>This page does not contain a valid internet domain.</li>";

        return;
      }

      console.log("Current URL:", tabs[0].url);
      console.log("Domain:", domain);

      // =====================================
      // BACKEND REQUEST
      // =====================================

      console.log("Calling Backend...");

      const response = await fetch(
        `http://localhost:3000/api/analyze/${domain}`,
      );

      console.log("Response Status:", response.status);

      if (!response.ok) {
        throw new Error(`Backend returned ${response.status}`);
      }

      const data = await response.json();

      console.log("Backend Response:");
      console.log(data);

      document.getElementById("analysisTime").textContent = new Date(
        data.analyzedAt,
      ).toLocaleString();

      // =====================================
      // VALIDATION
      // =====================================

      if (!data.reputation) {
        throw new Error("Missing reputation object from backend");
      }

      if (!data.risk) {
        throw new Error("Missing risk object from backend");
      }

      console.log("Reputation Data:");
      console.log(data.reputation);

      console.log("Risk Data:");
      console.log(data.risk);

      // =====================================
      // DOMAIN
      // =====================================

      document.getElementById("website").textContent = data.reputation.domain;

      // =====================================
      // DOMAIN AGE
      // =====================================

      const domainAgeElement = document.getElementById("domainAge");
      const domainCreatedDate = document.getElementById("createdDate");

      if (domainAgeElement) {
        domainAgeElement.textContent = `${data.reputation.ageYears} Years`;
      } else {
        console.warn('Missing HTML element: id="domainAge"');
      }
      if (domainCreatedDate) {
        domainCreatedDate.textContent = `${data.reputation.createdDate} `;
      } else {
        console.warn('Missing HTML element: id="createdDate"');
      }

      // =====================================
      // PROTOCOL
      // =====================================

      if (url.protocol === "https:") {
        document.getElementById("protocol").textContent = "✅ Secure HTTPS";
      } else {
        document.getElementById("protocol").textContent = "❌ Insecure HTTP";
      }

      // =====================================
      // RISK STATUS
      // =====================================

      document.getElementById("status").textContent = data.risk.status;

      // =====================================
      // RISK BAR
      // =====================================

      document.getElementById("riskBar").style.width = `${data.risk.score}%`;

      document.getElementById("riskBarText").textContent =
        `${data.risk.score}/100`;

      // =====================================
      // RISK COLORS
      // =====================================

      if (data.risk.status === "safe") {
        document.getElementById("status").style.color = "green";

        document.getElementById("riskBar").style.background = "green";
      } else if (data.risk.status === "warning") {
        document.getElementById("status").style.color = "orange";

        document.getElementById("riskBar").style.background = "orange";
      } else {
        document.getElementById("status").style.color = "red";

        document.getElementById("riskBar").style.background = "red";
      }

      // =====================================
      // RISK REASONS
      // =====================================

      const findingsList = document.getElementById("factors");

      findingsList.innerHTML = "";

      if (!data.risk.reasons || data.risk.reasons.length === 0) {
        const li = document.createElement("li");
        li.textContent = "No significant risk factors detected.";

        findingsList.appendChild(li);
      } else {
        data.risk.reasons.forEach((reason) => {
          const li = document.createElement("li");
          li.textContent = reason;

          findingsList.appendChild(li);
        });
      }

      // =====================================
      // IP LOOKUP
      // =====================================

      console.log("Resolving IP...");

      const ipAddress = await getIP(data.reputation.domain);

      console.log("IP:", ipAddress);

      document.getElementById("ipAddress").textContent = ipAddress;

      // =====================================
      // ORGANIZATION LOOKUP
      // =====================================

      let organization = "Unavailable";

      if (ipAddress !== "Lookup Failed!" && ipAddress !== "Could Not Resolve") {
        console.log("Looking up organization...");

        organization = await getOrganization(ipAddress);
      }

      console.log("Organization:", organization);

      document.getElementById("organization").textContent = organization;

      console.groupEnd();
    } catch (error) {
      console.group("CYBERGUARD ERROR");

      console.error("Full Error:");
      console.error(error);

      console.groupEnd();

      document.getElementById("status").textContent = "Error";
    }
  },
);

// =====================================
// GOOGLE DNS
// =====================================

async function getIP(domain) {
  try {
    console.log("DNS Lookup:", domain);

    const response = await fetch(
      `https://dns.google/resolve?name=${domain}&type=A`,
    );

    const data = await response.json();

    console.log("DNS Response:");
    console.log(data);

    if (data.Answer) {
      return data.Answer[0].data;
    }

    return "Could Not Resolve";
  } catch (error) {
    console.error("DNS Error:");
    console.error(error);

    return "Lookup Failed!";
  }
}

// =====================================
// IPINFO
// =====================================

async function getOrganization(ipAddress) {
  try {
    console.log("Organization Lookup:", ipAddress);

    const response = await fetch(`https://ipinfo.io/${ipAddress}/json`);

    const data = await response.json();

    console.log("IPInfo Response:");
    console.log(data);

    return data.org || "Unknown";
  } catch (error) {
    console.error("IPInfo Error:");
    console.error(error);

    return "Lookup Failed!";
  }
}
