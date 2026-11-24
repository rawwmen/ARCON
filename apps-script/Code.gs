/**
 * ARCON Growth — Enquiry backend.
 *
 * Routes each submission into one or more tabs of the SAME Google Sheet,
 * based on which "Requirement" checkboxes were selected on the form:
 *   - Funding               -> "Funding" tab
 *   - CA Services           -> "CA Services" tab
 *   - Marketing (PLSTC)     -> "Marketing" tab
 *   - Technology            -> "Technology" tab
 *   - Multiple Services /
 *     Other / nothing set   -> "General" tab
 * If more than one box is checked, the row is appended to each matching tab.
 * Tabs are created automatically (with a header row) the first time they're needed.
 *
 * Setup:
 * 1. Create a Google Sheet (any name, no tabs needed yet).
 * 2. Extensions > Apps Script, paste this file in as Code.gs.
 * 3. Deploy > New deployment > type "Web app".
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 4. Copy the deployment URL into config.js as `enquiryEndpoint`.
 */

var SHEET_BY_REQUIREMENT = {
  "Funding": "Funding",
  "CA Services": "CA Services",
  "Marketing (PLSTC)": "Marketing",
  "Technology": "Technology"
};
var GENERAL_SHEET_NAME = "General";

var HEADERS = [
  "Timestamp", "Full Name", "Email", "Phone", "Company", "Website",
  "Business Type", "City", "Requirement", "Funding Requirement",
  "Additional Info", "Preferred Contact Method", "Source Page"
];

function doPost(e) {
  var data = JSON.parse(e.postData.contents);

  // Honeypot: real visitors never see or fill this field. Bots that fill every
  // field will trip it — respond "ok" without writing a row, so they get no
  // signal that anything was rejected.
  if (data.hpCompanyWebsite) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "ok" }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  if (!data.fullName || !String(data.fullName).trim() ||
      !isValidEmail_(data.email)) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: "Name and a valid email are required." }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  var requirements = Array.isArray(data.requirement)
    ? data.requirement
    : (data.requirement ? [data.requirement] : []);

  var row = buildRow_(data, requirements);

  var targetSheets = [];
  requirements.forEach(function (r) {
    if (SHEET_BY_REQUIREMENT[r]) targetSheets.push(SHEET_BY_REQUIREMENT[r]);
  });

  var needsGeneral = targetSheets.length === 0 || requirements.some(function (r) {
    return r === "Multiple Services" || r === "Other";
  });
  if (needsGeneral) targetSheets.push(GENERAL_SHEET_NAME);

  // de-duplicate in case the same tab would be written twice
  targetSheets = targetSheets.filter(function (name, i) {
    return targetSheets.indexOf(name) === i;
  });

  targetSheets.forEach(function (name) {
    getOrCreateSheet_(name).appendRow(row);
  });

  return ContentService
    .createTextOutput(JSON.stringify({ status: "ok" }))
    .setMimeType(ContentService.MimeType.JSON);
}

function isValidEmail_(email) {
  return typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

// Google Sheets treats a cell starting with =, +, -, or @ as a formula. Prefix
// those with an apostrophe so submitted text is always stored as a literal
// string, never executed ("formula injection" / CSV injection protection).
function sanitizeCell_(value) {
  var str = String(value == null ? "" : value);
  if (/^[=+\-@]/.test(str)) return "'" + str;
  return str;
}

function buildRow_(data, requirements) {
  return [
    new Date(),
    sanitizeCell_(data.fullName),
    sanitizeCell_(data.email),
    sanitizeCell_(data.phone),
    sanitizeCell_(data.company),
    sanitizeCell_(data.website),
    sanitizeCell_(data.businessType),
    sanitizeCell_(data.city),
    sanitizeCell_(requirements.join(", ")),
    sanitizeCell_(data.fundingRequirement),
    sanitizeCell_(data.additionalInfo),
    sanitizeCell_(data.preferredContact),
    sanitizeCell_(data.sourcePage)
  ];
}

function getOrCreateSheet_(name) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(HEADERS);
  }
  return sheet;
}
