/**
 * Jurl30fruit RSVP — Google Apps Script backend.
 *
 * Receives RSVP submissions from rsvp.html, saves any payment-proof file to a
 * private Drive folder, and appends a row to a private Google Sheet.
 *
 * Setup instructions are in RSVP-SETUP.md.
 */

// ── Fill these two in (see RSVP-SETUP.md) ────────────────────────────────────
const SHEET_ID  = "PASTE_YOUR_SHEET_ID_HERE";
const FOLDER_ID = "PASTE_YOUR_DRIVE_FOLDER_ID_HERE";
// ─────────────────────────────────────────────────────────────────────────────

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    let fileUrl = "";
    if (data.fileData && data.fileName) {
      const folder = DriveApp.getFolderById(FOLDER_ID);
      const blob = Utilities.newBlob(
        Utilities.base64Decode(data.fileData),
        data.fileType || "application/octet-stream",
        data.fileName
      );
      const file = folder.createFile(blob);
      // Prefix the file with the guest's name so it's easy to match in the Sheet.
      file.setName((data.name || "guest") + " — " + data.fileName);
      fileUrl = file.getUrl();
    }

    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName("RSVPs") || ss.getSheets()[0];

    // Add a header row the first time the sheet is used.
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Timestamp", "Name", "Attending", "Guests", "Other guest names", "Dietary / Notes", "Payment proof"]);
    }

    sheet.appendRow([
      new Date(),
      data.name || "",
      data.attending || "",
      data.guests || "",
      data.guestNames || "",
      data.dietary || "",
      fileUrl
    ]);

    return json({ result: "success" });
  } catch (err) {
    return json({ result: "error", error: String(err) });
  }
}

// Lets you open the web-app URL in a browser to confirm it's deployed.
function doGet() {
  return json({ result: "ok", message: "RSVP endpoint is live." });
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
