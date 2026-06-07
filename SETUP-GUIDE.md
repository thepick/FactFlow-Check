# FactFlow Check — Teacher Setup Guide

## One-time setup (about 5 minutes per teacher)

### Step 1: Create a Google Sheet

1. Go to [sheets.google.com](https://sheets.google.com)
2. Click **+ Blank spreadsheet**
3. Title it "FactFlow Results" (or anything you like)

### Step 2: Add the Apps Script

1. In your Google Sheet, go to **Extensions → Apps Script**
2. Delete any starter code that appears
3. Copy the **entire contents** of `factflow-apps-script.gs` (provided in this folder)
4. Paste it into the Apps Script editor
5. Click the save icon (💾) or press **Ctrl+S**
6. Name the project "FactFlow Receiver" when prompted

### Step 3: Deploy as a Web App

1. In the Apps Script editor, click **Deploy → New Deployment**
2. Click the gear icon ⚙️ next to "Select type" and choose **Web app**
3. Set these values:
   - **Description:** `FactFlow Check receiver`
   - **Execute as:** `Me` (your Google account)
   - **Who has access:** `Anyone`
4. Click **Deploy**
5. Click **Authorize access** (Google will ask — safe, only accesses your Sheet)
6. **Copy the URL** that appears. It looks like:
   ```
   https://script.google.com/macros/s/AKfycbyx.../exec
   ```
7. Click **Done**

### Step 4: Add your URL to the TEACHERS map

1. Give your deployment URL to the person who maintains the `index.html` file
2. They will add an entry to the `TEACHERS` object near the top of the `<script>` section:
   ```js
   'IP5/9': {
     name: 'Ajarn Michael — IP5/9',
     url: 'https://script.google.com/macros/s/.../exec'
   }
   ```
3. Your teacher key (e.g. `IP5/9`) becomes the link your students use

### Step 5: Share your link and test

1. Your class link is `ffcbeta.mtomlinson.ca/?t=YOUR_KEY`
2. Open the link, enter a student name and a valid teacher code, complete a check
3. On the result screen, click **Send Results**
4. Open your Google Sheet — you should see:
   - **Raw Data** sheet (hidden): every submission, timestamped
   - **Summary** sheet (visible): one row per student, alphabetical, showing only the latest result

---

## Multi-teacher setup

A single hosted app at `ffcbeta.mtomlinson.ca` serves multiple teachers. Each teacher:

1. Creates their own Google Sheet and deploys their own Apps Script (Steps 1–3 above)
2. Gets an entry in the `TEACHERS` object in `index.html`
3. Shares their unique link (`?t=KEY`) with their class

| Teacher | Key | Link |
|---------|-----|------|
| Ajarn Michael | `IP5/9` | `ffcbeta.mtomlinson.ca/?t=IP5/9` |
| Ajarn Jordan | `IP5/8` | `ffcbeta.mtomlinson.ca/?t=IP5/8` |

The `DEFAULT_TEACHER_KEY` at the top of the script determines which teacher's sheet is used when no `?t=` parameter is present.

---

## When you update the Apps Script

If you edit the Apps Script later and want to push changes without changing your URL:

1. Click **Deploy → Manage deployments**
2. Find your Web App deployment in the list, click the **pencil/edit icon** ✏️
3. Under **Version**, select **New version**
4. Click **Deploy**

This pushes your code changes to the **same URL** — no need to update the TEACHERS map in `index.html` and no need to share a new link with students.

**⚠ Do NOT use Deploy → New Deployment** unless you want a fresh URL (e.g., for a brand-new sheet). New Deployment creates a new URL and the old one stops working.

---

## How it works

| Student clicks... | What happens |
|---|---|
| **Send Results** | Posts their result to their teacher's Sheet. Row appears in Summary instantly. |
| (offline / server error) | Falls back to copying results to clipboard with a toast message. |

## Sheet structure

**Raw Data** (hidden — full chronological log):
- Timestamp, Student, Code, Assessment, Verified, Developing, Accuracy %, Fluent, Slow, Wrong, Timeout, Questions, Missed Facts, Duration sec

**Summary** (what you look at):
- Student, Date, Code, Verified, Developing, Accuracy %, Fluent, Slow, Missed, Facts to Review
- One row per student
- Automatically sorted A–Z
- Each new submission updates that student's row in place

---

## Troubleshooting

**"Could not reach server" message:**
Check that the student's device has internet. If they're offline, results are copied to clipboard — they can paste into an email later.

**"Server error" message:**
The Apps Script may have a bug. Go to Extensions → Apps Script in your Sheet, click **Executions** in the left sidebar, and look for errors. Redeploy after fixing.

**Duplicate entries for the same student:**
Name normalization handles case and spacing, but not typos (e.g., "Ben" vs "Bne"). Remind the student to correct their spelling — the name is remembered on their device for next time.

**Data not appearing in your sheet:**
Check that the Apps Script is deployed (Deploy → Manage deployments — you should see an active Web App). If missing, follow Step 3 above. Also verify the `?t=` parameter in the student's link matches your TEACHERS key exactly (e.g., `?t=IP5/8`, not `?t=5/8`).
