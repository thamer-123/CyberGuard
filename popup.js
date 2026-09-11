chrome.tabs.query({ active: true, currentWindow: true }, async function (tabs) {
   
  /* Get Information */

  //Get Domain
  const url = new URL(tabs[0].url);

  /* Constants */

  const result = analyzeWebsite(url)
  

  //Get IP Address
  const ipAddress = await getIP(result.domain);

  //Get Organization
  let organization = "Unavailable";

  if(ipAddress !=="Lookup Failed!"&&ipAddress !== "Could Not Resolve")
    {
        organization= await getOrganization(ipAddress);
    }


  /* Print Info */

  //Domain
  document.getElementById("website").textContent = result.domain;
  //Protocol
  if (result.isSafe) {
    document.getElementById("protocol").textContent = "✅ Secure HTTPS";
  } else if (!result.isSafe) {
    document.getElementById("protocol").textContent = "❌ Insecure HTTP";
  }
  //IP Address
  document.getElementById("ipAddress").textContent = ipAddress;

  //Organization
  document.getElementById("organization").textContent = organization;

  //RiskFactors
  const findingsList = document.getElementById("factors");
  findingsList.innerHTML = "";
  if(result.findings.length ===0){
    const li = document.createElement("li");
    li.textContent = "No significant risk factors detected.";
    findingsList.appendChild(li);
  }
  result.findings.forEach((finding) => {
    const li = document.createElement("li");
    li.textContent = finding;
    findingsList.appendChild(li);
  });
  //RiskBar
  document.getElementById("riskBar").style.width = result.score + "%";
  //ScoreRisk
  document.getElementById("riskBarText").textContent = result.score + "/ 100";
  //Warnings
  if(result.score>80)
  {
    document.getElementById("severeWarningBox").style.display = "block";
  }
  else if(result.score>70)
  {
    document.getElementById("mediumWarningBox").style.display = "block";
  }
  //Status
  if (result.score <= 20) {
    document.getElementById("status").textContent = result.status;
    document.getElementById("status").style.color = "green"; //Text Color
    document.getElementById("riskBar").style.background = "green"; //Bar Color
  } else if (result.score <= 40) {
    document.getElementById("status").textContent = result.status;
    document.getElementById("status").style.color = "gold"; //Text Color
    document.getElementById("riskBar").style.background = "gold"; //Bar Color
  } else if (result.score <= 60) {
    document.getElementById("status").textContent = result.status;
    document.getElementById("status").style.color = "orange"; //Text Color
    document.getElementById("riskBar").style.background = "orange"; //Bar Color
  } else if (result.score <= 80) {
    document.getElementById("status").textContent = result.status;
    document.getElementById("status").style.color = "red"; //Text Color
    document.getElementById("riskBar").style.background = "red"; //Bar Color
  } else {
    document.getElementById("status").textContent = result.status;
    document.getElementById("status").style.color = "darkred"; //Text Color
    document.getElementById("riskBar").style.background = "darkred"; //Bar Color
  }
});

async function getIP(domain) {
  try {
    const response = await fetch(
      `https://dns.google/resolve?name=${domain}&type=A`,
    );

    const data = await response.json();

    console.log(data);

    if (data.Answer) {
      return data.Answer[0].data;
    }
    return "Could Not Resolve";
  } catch (error) {
    console.error(error);
    return "Lookup Failed!";
  }
}

async function getOrganization(ipAddress) {
    try{
        const response = await fetch(
            `https://ipinfo.io/${ipAddress}/json`
        );
        const data = await response.json();

        console.log(data);

        return data.org || "Unknown";
    }
    catch(error){
        console.error(error);
        return "Lookup Failed!"
    }
    
}