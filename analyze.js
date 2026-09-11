function analyzeWebsite(url) {
  /* Constants */

  let status;
  let riskScore = 0;
  const findings = [];
  const keywords = [
    "login",
    "verify",
    "secure",
    "bank",
    "account",
    "password",
    "update",
    "free",
  ];

  const cleanDomain = url.hostname.replace("www.", "");//clean domain up

  //Check if Protocol is Safedo you
  const isSafe = url.protocol === "https:";

  /* Scoring for riskScore */

  //Secure Protocol
  if (!isSafe) {
    riskScore += 40;
    findings.push("Unsafe protocol (+40)");
  }
  //Size of Domain
  if (cleanDomain.length > 30) {
    riskScore += 10;
    findings.push("Long Domain(+10)");
  }

  //Excessive Hyphens
  const hyphens = (cleanDomain.match(/-/g) || []).length;
  if (hyphens >= 2) {
    riskScore += 15;
    findings.push("Multiple Hyphens (+15)");
  }
  //Numbers in Domain
  if (/\d/.test(cleanDomain)) {
    riskScore += 10;
    findings.push("Numbers in Domain (+10)\'Per Number\'");
  }
  //Suspicious Words
  keywords.forEach((word) => {
    if (cleanDomain.includes(word)) {
      riskScore += 10;
      findings.push(`Keyword '${word}' (+10)`);
    }

    /* Helpers */

    riskScore = Math.min(riskScore, 100); //Cap to 100

    //Status
    if (riskScore <= 20) {
      status = "✅ Safe";
    } else if (riskScore <= 40) {
      status = "🟡 Low Risk";
    } else if (riskScore <= 60) {
      status = "🟠 Medium Risk";
    } else if (riskScore <= 80) {
      status = "🔴 High Risk";
    } else {
      status = "🚨 Dangerous";
    }
  });

  return {
    score: riskScore,
    findings: findings,
    status: status,
    domain: cleanDomain,
    isSafe: isSafe,
  };
}
