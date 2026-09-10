# 🛡️ CyberGuard

CyberGuard is a Chrome browser extension designed to help users identify potentially unsafe websites before they become victims of phishing, scams, malware, or other online threats.

The extension analyzes the currently visited website, gathers security-related information, calculates a risk score, and displays easy-to-understand security insights directly in the browser.

---

## 🚀 Features

### Website Security Analysis
- HTTPS detection
- Domain reputation checks
- Website risk scoring
- Suspicious domain detection
- Security warning generation

### Domain Intelligence
- Website IP address lookup
- Hosting organization identification
- DNS information retrieval
- Domain metadata analysis

### Risk Assessment Engine
CyberGuard calculates a security score based on multiple indicators, including:

- Secure HTTPS connection
- Domain characteristics
- Hosting information
- Suspicious patterns
- Security best practices

The final score is displayed visually through an intuitive risk bar:

| Score Range | Risk Level |
|------------|------------|
| 80-100 | ✅ Safe |
| 50-79 | ⚠️ Moderate |
| 0-49 | 🚨 High Risk |

### Real-Time Alerts
When CyberGuard detects a potentially dangerous website, it displays a security warning banner to help users make informed decisions before interacting with the site.

---

## 🏗️ Project Architecture
CyberGuard
│
├── manifest.json
├── popup.html
├── popup.css
├── popup.js
│
├── background.js
│
├── content.js
│
├── analyze.js
│
└── assets/
