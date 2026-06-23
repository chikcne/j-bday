# RSVP form setup

The RSVP page (`rsvp.html`) is a native form on the site. When a guest submits, it
sends the data to a small **Google Apps Script** you own, which:

1. Saves the payment-proof file to a **private Google Drive folder**, and
2. Appends a row to a **private Google Sheet** (with a link to the file).

Guests never see a Google Form and don't need to sign in. Everything is free.

You only need to do this once. ~10 minutes.

---

## 1. Create the Sheet and Drive folder

1. Go to [sheets.new](https://sheets.new) and create a blank sheet. Name it e.g.
   `Jurl30fruit RSVPs`. (You don't need to add headers — the script does it.)
2. Copy its **ID** from the URL:
   `https://docs.google.com/spreadsheets/d/`**`THIS_LONG_ID`**`/edit`
3. Go to [drive.google.com](https://drive.google.com), create a folder e.g.
   `RSVP payment proofs`, open it, and copy its **ID** from the URL:
   `https://drive.google.com/drive/folders/`**`THIS_FOLDER_ID`**

Both stay private to your Google account — only you can see them.

## 2. Create the Apps Script

1. Go to [script.new](https://script.new) (creates a new Apps Script project).
2. Delete the placeholder code and paste in the contents of
   **`rsvp-apps-script.gs`** from this repo.
3. At the top, replace `PASTE_YOUR_SHEET_ID_HERE` and
   `PASTE_YOUR_DRIVE_FOLDER_ID_HERE` with the two IDs from step 1.
4. Save (💾).

## 3. Deploy it as a web app

1. Click **Deploy → New deployment**.
2. Click the gear ⚙️ next to "Select type" → choose **Web app**.
3. Set:
   - **Execute as:** Me (your account)
   - **Who has access:** **Anyone**  ← required so guests can submit
4. Click **Deploy**. Approve the permissions prompt (it needs Drive + Sheets
   access; click through "Advanced → Go to (project) → Allow").
5. Copy the **Web app URL** it gives you. It looks like
   `https://script.google.com/macros/s/AKfy.../exec`.

> Tip: paste that URL into a browser — you should see
> `{"result":"ok","message":"RSVP endpoint is live."}`.

## 4. Connect the site

1. Open **`rsvp.html`**.
2. Find this line near the bottom:
   ```js
   const ENDPOINT = "PASTE_YOUR_APPS_SCRIPT_URL_HERE";
   ```
3. Replace it with your Web app URL from step 3.
4. Commit and push. Done — submissions now land in your Sheet.

---

## Updating the script later

If you change `rsvp-apps-script.gs`, you must redeploy: **Deploy → Manage
deployments → (edit ✏️) → Version: New version → Deploy**. The URL stays the same.

## Notes & limits

- **File size:** the form caps uploads at 10 MB (plenty for a receipt photo/PDF).
- **Privacy:** "Who has access: Anyone" only means anyone can *submit*; nobody
  can read your Sheet or Drive folder. The script runs as you.
- **Spam:** this is a low-traffic birthday page, so there's no bot protection. If
  it ever gets abused, the simplest fix is to redeploy with a new URL.
