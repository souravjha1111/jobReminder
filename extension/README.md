# ?? CareerClock - Smart Job Application Tracker

> Your routine is your competitive advantage. Never miss a job opportunity with automated reminders.

A Chrome extension that helps job seekers stay organized by creating scheduled reminders to check job search links. Built with Chrome Extension Manifest V3.

---

## ?? What is CareerClock?

**CareerClock** is a productivity tool designed specifically for job seekers. It automates your job search routine by:

- ? **Sending reminders** at scheduled times (daily or interval-based)
- ?? **Storing job search links** (LinkedIn, Indeed, Naukri, etc.)
- ?? **Opening all links** with one click when reminder fires
- ?? **Desktop notifications** so you never miss a check-in
- ?? **Pause/Resume** reminders when needed

**Perfect for:**
- Active job seekers checking multiple job boards daily
- Freelancers monitoring project platforms
- Anyone who wants a structured job search routine

---

## ?? Quick Start

### Installation

1. **Download or Clone** this repository
   ```bash
   git clone <repository-url>
   ```

2. **Open Chrome Extensions Page**
   - Navigate to `chrome://extensions/`
   - Or: Menu (?) ? Extensions ? Manage Extensions

3. **Enable Developer Mode**
   - Toggle "Developer mode" in the top-right corner

4. **Load Extension**
   - Click "Load unpacked"
 - Select the `extension` folder
 - ? Extension installed!

5. **Pin Extension (Optional)**
   - Click puzzle icon (??) in toolbar
   - Find "CareerClock - Smart Application Tracker"
   - Click pin icon to keep visible

---

## ?? How to Use

### First Time Setup

When you first install CareerClock, a default reminder is automatically created:

**"Software Developer Job"**
- ? Daily at 9:00 AM
- ?? LinkedIn Software Engineer Jobs - India (pre-configured)

You can use this as-is, modify it, or delete it and create your own!

### Creating a Reminder

1. **Click extension icon** in toolbar
2. **Click "+ Add Reminder"**
3. **Fill in details:**
   - **Name**: e.g., "Morning Job Hunt", "Frontend Positions"
   - **Type**: Choose Daily or Interval
     - **Daily**: Pick time (24-hour format)
     - `09:00` = 9:00 AM
       - `14:30` = 2:30 PM
       - `18:00` = 6:00 PM
     - **Interval**: Set frequency
       - Every 2 hours
       - Every 3 days
4. **Click "Save Reminder"**

### Adding Job Links

1. **Go to "Links" tab**
2. **Find your reminder card**
3. **Click "+ Add Link"**
4. **Enter:**
   - **Link Name**: e.g., "LinkedIn Frontend Jobs"
   - **Job URL**: Full URL starting with `https://`
5. **Click "Save Link"**
6. Repeat for up to 5 links per reminder

### When Reminder Fires

1. ?? **Desktop notification** appears (if enabled)
2. ?? **Sound plays** (if enabled)
3. ?? **Popup opens** automatically (if enabled)
4. **Choose:**
   - **"Open All Links"** ? All job links open in new tabs
   - **"Dismiss"** ? Close notification, check later

### Pause/Resume

- Click **?? Pause** to temporarily stop a reminder
- Click **?? Resume** to reactivate it
- Perfect for vacations or when you're between job searches

---

## ?? Settings

Access from Settings tab:

| Setting | Description | Default |
|---------|-------------|---------|
| ?? **Play sound** | Notification sound on reminder | ? ON |
| ?? **Auto-open popup** | Automatically open popup when reminder fires | ? ON |
| ?? **System notification** | Show desktop notification | ? ON |
| ?? **Auto-open all links** | Skip confirmation, open links immediately | ? OFF |

**Auto-open all links**: When enabled, job links open automatically without confirmation dialog. Great for quick daily checks!

---

## ?? Use Cases

### Scenario 1: Daily Job Search Routine
```
Reminder: "Morning Applications"
Schedule: Daily at 9:00 AM
Links:
  - LinkedIn Jobs
  - Indeed Search
  - Naukri.com
  - Company Career Pages
  - AngelList

Result: Every morning at 9 AM, get notified and open all 
        job boards in one click!
```

### Scenario 2: Frequent Check-ins
```
Reminder: "Quick Scan"
Schedule: Every 3 hours
Links:
  - Remote Jobs Board
  - Freelance Platform
  - Startup Jobs

Result: Check for new postings every 3 hours throughout 
        your job search
```

### Scenario 3: Weekly Follow-ups
```
Reminder: "Application Follow-up"
Schedule: Every 7 days
Links:
  - Application Tracker Sheet
  - Email Templates
  - Company Contact List

Result: Weekly reminder to follow up on pending applications
```

---

## ?? Features

### ? Smart Reminders
- Up to 3 custom reminder triggers
- Daily reminders (specific time)
- Interval reminders (every X hours/days)
- Visual countdown to next reminder
- Pause/Resume functionality

### ?? Link Management
- Store up to 5 links per reminder
- Auto-fetched website favicons
- Edit, delete, organize easily
- URL validation
- One-click "Open All"

### ?? Beautiful UI
- Clean, modern design
- Smooth animations
- Modal dialogs
- Toast notifications
- Motivational tips

### ?? Privacy & Data
- All data stored locally (chrome.storage.sync)
- Syncs across your Chrome devices
- No external servers
- No data collection
- Full user control

---

## ??? Technical Details

### Built With
- Chrome Extension Manifest V3
- Vanilla JavaScript (no frameworks)
- HTML5 & CSS3
- Chrome APIs:
  - `chrome.storage.sync` - Data storage
  - `chrome.alarms` - Scheduled notifications
  - `chrome.notifications` - Desktop alerts
  - `chrome.tabs` - Opening links

### Permissions Required
- **storage**: Save reminders and settings
- **alarms**: Schedule notifications
- **notifications**: Desktop alerts
- **tabs**: Open job links

### Storage Limits
- Maximum 3 triggers (reminders)
- Maximum 5 links per trigger
- Total data: ~100KB (Chrome sync storage limit)

---

## ? FAQ

### Q: Will reminders work if Chrome is closed?
**A:** No. Chrome must be running for alarms to fire. However, alarms persist across browser restarts - they won't be lost.

### Q: Can I use this on multiple computers?
**A:** Yes! All your reminders and settings sync automatically across all Chrome browsers where you're logged in.

### Q: What happens if I delete the default trigger?
**A:** It's permanently removed and won't be re-added. CareerClock remembers your preference.

### Q: Why use 24-hour format for time?
**A:** For precision and international compatibility. The extension displays times in 12-hour format (with AM/PM) after saving.

### Q: Can I add more than 3 reminders?
**A:** Currently limited to 3 to maintain simplicity and avoid notification fatigue. This covers most use cases (morning, afternoon, evening).

### Q: What if a link is invalid?
**A:** Links must start with `http://` or `https://`. The extension validates URLs before saving.

### Q: How accurate are the reminders?
**A:** Chrome alarms have ±1 minute accuracy. Reminders may fire up to 1 minute late due to Chrome's scheduling.

### Q: Can I export my data?
**A:** Currently no built-in export. All data is in `chrome.storage.sync` which you can access via Chrome DevTools.

### Q: Will this work on mobile Chrome?
**A:** No. Chrome extensions are desktop-only. Mobile Chrome doesn't support extensions.

### Q: How do I update the extension?
**A:** If installed via "Load unpacked", manually reload it from `chrome://extensions/`. Published extensions update automatically.

---

## ?? Troubleshooting

### Reminders Not Firing

**Problem**: No notification at scheduled time

**Solutions**:
1. Verify Chrome is running
2. Check alarm exists:
   - Go to `chrome://extensions/`
   - Click "service worker" under CareerClock
   - In console: `chrome.alarms.getAll(console.log)`
3. Ensure system notification permissions are granted
4. Check reminder isn't paused (?? icon)

### Links Not Opening

**Problem**: Clicking "Open All" doesn't work

**Solutions**:
1. Ensure URLs start with `https://` or `http://`
2. Check browser console (F12) for errors
3. Try reloading extension
4. Check popup blocker settings

### Extension Not Loading

**Problem**: Error when loading extension

**Solutions**:
1. Verify all files are present in folder
2. Check `manifest.json` is valid
3. Look for errors on `chrome://extensions/` page
4. Try removing and re-adding extension

### Favicons Not Showing

**Problem**: Website icons missing next to links

**Solution**: Favicons load from Google's service. Check:
- Internet connection
- Some sites may not have favicons
- Try editing the link to refresh favicon

---

## ?? Limits & Constraints

| Item | Limit | Reason |
|------|-------|--------|
| Reminders | 3 max | Avoid notification overload |
| Links per reminder | 5 max | Keep UI clean and focused |
| Total storage | ~100KB | Chrome sync storage limit |
| Alarm accuracy | ±1 minute | Chrome API limitation |
| Link URL length | ~2000 chars | Browser URL limit |

---

## ?? Version History

### v1.0.0 (Current)
- ? Daily and interval reminders
- ? Up to 5 links per reminder
- ? Pause/Resume functionality
- ? Auto-open links option
- ? Desktop notifications
- ? Sound alerts
- ? Favicon auto-fetch
- ? Default trigger on install
- ? Settings sync across devices

---

## ?? License

This project is free to use for personal and commercial purposes.

---

## ?? Support

If you encounter issues:

1. **Check FAQ** above
2. **Try troubleshooting** steps
3. **Check console** for errors (Right-click icon ? Inspect popup)
4. **Reload extension** from `chrome://extensions/`

---

## ?? Credits

Built for job seekers who want to stay organized and never miss an opportunity.

**Happy job hunting! ???**

---

## ?? Notes

- Extension requires Chrome 88+ (Manifest V3)
- Works on Chrome, Edge, and other Chromium-based browsers
- Not compatible with Firefox (uses different extension API)
- All data is local - no analytics or tracking
- Open source - feel free to modify for your needs

---

**Made with ?? for job seekers worldwide**
