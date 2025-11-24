const MAX_TRIGGERS = 3;
const MAX_LINKS = 5;
const MOTIVATIONAL_TIPS = [
    "💡 Stay consistent — great jobs need great timing.",
    "🚀 Apply today, succeed tomorrow!",
    "🌱 Small steps lead to big opportunities.",
  "⏰ Reminders keep you on track!",
    "🔥 Persistence beats resistance.",
    "💼 Your dream job is just one application away!"
];
let triggers = [];
let settings = {
 sound: true,
 autoPopup: true,
 systemNotification: true,
 autoOpenLinks: false
};
let currentTab = 'reminders';
let tipIndex = 0;
let currentEditIndex = { trigger: null, link: null };
let isInitialized = false;
let pendingReminderMessage = null;

// Helper to generate unique IDs
function generateId() {
    return 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// --- Initialize ---
document.addEventListener('DOMContentLoaded', () => {
 console.log('DOM Content Loaded - Initializing...');
 initializeEventListeners();
 loadData();
 rotateTip();
 setInterval(rotateTip, 6000);
 setInterval(updateCountdown, 30000);
 isInitialized = true;
 
 // Process any pending reminder message that arrived before initialization
 if (pendingReminderMessage) {
     handleReminderFiredMessage(pendingReminderMessage);
     pendingReminderMessage = null;
 }
 console.log('✅ Initialization complete');
});

// --- Event Listeners ---
function initializeEventListeners() {
 console.log('Setting up event listeners...');
 
 // Tab navigation
 document.querySelectorAll('.tab-btn').forEach(btn => {
 btn.addEventListener('click', handleTabClick);
 });
 
 // Add reminder button
 const addReminderBtn = document.getElementById('add-reminder-btn');
 if (addReminderBtn) {
        addReminderBtn.addEventListener('click', () => openReminderModal());
 } else {
     console.error('add-reminder-btn not found!');
    }
 
 // Reminder modal
 document.getElementById('reminder-form').addEventListener('submit', handleReminderSubmit);
 document.getElementById('reminder-cancel').addEventListener('click', () => closeModal('reminder-modal'));
 document.getElementById('reminder-modal-close').addEventListener('click', () => closeModal('reminder-modal'));
 
 // Reminder type toggle
 document.querySelectorAll('input[name="reminder-type"]').forEach(radio => {
 radio.addEventListener('change', handleReminderTypeChange);
 });
 
 // Link modal
 document.getElementById('link-form').addEventListener('submit', handleLinkSubmit);
 document.getElementById('link-cancel').addEventListener('click', () => closeModal('link-modal'));
 document.getElementById('link-modal-close').addEventListener('click', () => closeModal('link-modal'));
 
 // Confirm modal
 document.getElementById('confirm-cancel').addEventListener('click', () => closeModal('confirm-modal'));
 document.getElementById('confirm-modal-close').addEventListener('click', () => closeModal('confirm-modal'));
 
 // Settings form
 document.getElementById('settings-form').addEventListener('submit', handleSettingsSave);
 
 // Event delegation for dynamic buttons
 document.getElementById('reminders-list').addEventListener('click', handleReminderAction);
 document.getElementById('links-list').addEventListener('click', handleLinkAction);

 document.querySelectorAll('.modal').forEach(modal => {
 modal.addEventListener('click', (e) => {
 if (e.target === modal) {
 closeModal(modal.id);
 }
 });
 });
 
 console.log('✅ Event listeners attached');
}

// --- Tab Navigation ---
function handleTabClick(e) {
 const btn = e.currentTarget;
 document.querySelectorAll('.tab-btn').forEach(b => {
 b.classList.remove('active');
 b.setAttribute('aria-selected', 'false');
 });
 btn.classList.add('active');
 btn.setAttribute('aria-selected', 'true');
 document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
 document.getElementById(btn.dataset.tab + '-tab').classList.add('active');
 currentTab = btn.dataset.tab;
 
 if (currentTab === 'links') renderLinksTab();
 if (currentTab === 'reminders') renderRemindersTab();
 if (currentTab === 'settings') renderSettingsTab();
}

// --- Modal Management ---
function openModal(modalId) {
    console.log('openModal called for:', modalId);
    const modal = document.getElementById(modalId);
    if (!modal) {
 console.error('Modal not found:', modalId);
     return;
    }
modal.classList.add('show');
    console.log('Modal opened:', modalId);
}

function closeModal(modalId) {
console.log('closeModal called for:', modalId);
    const modal = document.getElementById(modalId);
    if (!modal) {
 console.error('Modal not found:', modalId);
        return;
    }
 modal.classList.remove('show');
    console.log('Modal closed:', modalId);
}

// --- Reminder Modal ---
function openReminderModal(editIndex = null) {
 currentEditIndex.trigger = editIndex;
 const modal = document.getElementById('reminder-modal');
 const title = document.getElementById('reminder-modal-title');
 const form = document.getElementById('reminder-form');
 
 form.reset();
 
 if (editIndex !== null) {
 title.textContent = 'Edit Reminder';
 const trigger = triggers[editIndex];
 document.getElementById('reminder-name').value = trigger.name;
 
 if (trigger.reminder.type === 'daily') {
 document.querySelector('input[value="daily"]').checked = true;
 document.getElementById('daily-time').value = trigger.reminder.time;
 } else {
 document.querySelector('input[value="interval"]').checked = true;
 document.getElementById('interval-value').value = trigger.reminder.interval;
 document.getElementById('interval-unit').value = trigger.reminder.unit;
 }
 handleReminderTypeChange();
 } else {
 title.textContent = 'Add Reminder';
 document.querySelector('input[value="daily"]').checked = true;
 handleReminderTypeChange();
 }
 
 openModal('reminder-modal');
}

function handleReminderTypeChange() {
 const type = document.querySelector('input[name="reminder-type"]:checked').value;
 const dailyGroup = document.getElementById('daily-time-group');
 const intervalGroup = document.getElementById('interval-group');
 
 if (type === 'daily') {
 dailyGroup.classList.remove('hidden');
 intervalGroup.classList.add('hidden');
 document.getElementById('daily-time').required = true;
 document.getElementById('interval-value').required = false;
 } else {
 dailyGroup.classList.add('hidden');
 intervalGroup.classList.remove('hidden');
 document.getElementById('daily-time').required = false;
 document.getElementById('interval-value').required = true;
 }
}

function renderSettingsTab() {
 const soundCheck = document.getElementById('sound-notification');
 const popupCheck = document.getElementById('auto-popup');
 const notifCheck = document.getElementById('system-notification');
 const autoOpenCheck = document.getElementById('auto-open-links');
 
 if (soundCheck) soundCheck.checked = settings.sound;
 if (popupCheck) popupCheck.checked = settings.autoPopup;
 if (notifCheck) notifCheck.checked = settings.systemNotification;
 if (autoOpenCheck) autoOpenCheck.checked = settings.autoOpenLinks;
}

function handleSettingsSave(e) {
 e.preventDefault();
 settings.sound = document.getElementById('sound-notification').checked;
 settings.autoPopup = document.getElementById('auto-popup').checked;
 settings.systemNotification = document.getElementById('system-notification').checked;
 settings.autoOpenLinks = document.getElementById('auto-open-links').checked;
 saveSettings();
 showToast('⚙️ Settings saved', 'success');
}

function handleReminderFiredMessage(msg) {
    console.log('Processing reminder message:', msg.trigger.name);
    
    // Play sound if enabled
    chrome.storage.sync.get(['settings'], (data) => {
const settings = data.settings || { sound: true, autoOpenLinks: false };
        console.log('Sound setting:', settings.sound);
        console.log('Auto-open links setting:', settings.autoOpenLinks);

        if (settings.sound) {
            playReminderSound();
      }
        
    // Auto-open links if enabled
  if (settings.autoOpenLinks && msg.trigger.links.length > 0) {
      console.log('Auto-opening links:', msg.trigger.links.length);
    openAllLinksWithDelay(msg.trigger.links);
      showToast(`🚀 Opening ${msg.trigger.links.length} link${msg.trigger.links.length > 1 ? 's' : ''}!`, 'success');
 return;
 }
    });

    if (msg.trigger.links.length > 0) {
        // Show modal with Dismiss or Open All Links buttons
        const message = `🔔 Reminder: ${msg.trigger.name}\n\n${msg.trigger.links.length} job link(s) ready to open.\n\nOpen all links now?`;
        console.log('Showing confirm dialog:', message);
    
        showConfirm(
            message,
          () => {
            // Open All Links button clicked
  console.log('Opening all links:', msg.trigger.links.length, 'links');
     openAllLinksWithDelay(msg.trigger.links);
   },
            () => {
        // Dismiss button clicked
   console.log('Reminder dismissed');
                showToast(`⏭️ Reminder dismissed`, 'success');
      }
        );
    } else {
        // No links, just show notification with dismiss option
        showConfirm(
         `🔔 Reminder: ${msg.trigger.name}\n\nNo links added yet.`,
     () => {
                // OK button - just close
        console.log('Reminder acknowledged');
      showToast(`⏭️ Reminder dismissed`, 'success');
    }
        );
    }
}

function handleReminderSubmit(e) {
 e.preventDefault();
 
 const name = document.getElementById('reminder-name').value.trim();
 const type = document.querySelector('input[name="reminder-type"]:checked').value;
 
 let reminder;
 if (type === 'daily') {
 const time = document.getElementById('daily-time').value;
 reminder = { type: 'daily', time };
 } else {
 const interval = document.getElementById('interval-value').value;
 const unit = document.getElementById('interval-unit').value;
 reminder = { type: 'interval', interval, unit };
 }
 
    if (currentEditIndex.trigger !== null) {
        // Edit existing
        const idx = currentEditIndex.trigger;
        triggers[idx].name = name;
        triggers[idx].reminder = reminder;
        showToast('🔁 Reminder updated', 'success');
      
        // Clear old alarm and create new one
        chrome.runtime.sendMessage({
            type: 'clearAlarm',
  index: idx
        }, () => {
      // After clearing, create new alarm with updated settings
     chrome.runtime.sendMessage({
        type: 'createAlarm',
    trigger: triggers[idx],
index: idx
     });
    console.log('Alarm updated for trigger:', triggers[idx].name);
        });
    } else {
  // Add new
        if (triggers.length >= MAX_TRIGGERS) {
       showToast(`⚠️ Maximum ${MAX_TRIGGERS} triggers allowed`, 'error');
            closeModal('reminder-modal');
  return;
        }
        triggers.push({ name, reminder, links: [], paused: false }); // Add paused flag
        showToast('✅ Reminder created', 'success');

   // Notify background to create alarm
        chrome.runtime.sendMessage({
     type: 'createAlarm',
            trigger: triggers[triggers.length - 1],
            index: triggers.length - 1
        });
    }
 
 saveTriggers();
 renderRemindersTab();
 closeModal('reminder-modal');
}

function handleReminderAction(e) {
    const btn = e.target.closest('button');
    if (!btn) return;

    const action = btn.dataset.action;
    const index = parseInt(btn.dataset.index);

    if (action === 'edit') {
    openReminderModal(index);
    } else if (action === 'pause') {
 // Toggle pause state
     triggers[index].paused = !triggers[index].paused;
  
   if (triggers[index].paused) {
        // Pause: Clear the alarm
       chrome.runtime.sendMessage({
    type: 'clearAlarm',
           index: index
   });
      showToast(`⏸️ "${triggers[index].name}" paused`, 'success');
  } else {
   // Resume: Recreate the alarm
       chrome.runtime.sendMessage({
     type: 'createAlarm',
    trigger: triggers[index],
 index: index
   });
    showToast(`▶️ "${triggers[index].name}" resumed`, 'success');
   }
 
        saveTriggers();
     renderRemindersTab();
 } else if (action === 'delete') {
        showConfirm(
  `🗑️ Delete trigger "${triggers[index].name}"?`,
     () => {
  const triggerName = triggers[index].name;
                const isDefaultTrigger = triggers[index].isDefault || false;
             
  // If deleting default trigger, mark it as deleted so it won't be added again
   if (isDefaultTrigger) {
       chrome.storage.sync.set({ defaultTriggerDeleted: true }, () => {
       console.log('Default trigger marked as deleted - will not be re-added');
        });
     }
        
           triggers.splice(index, 1);
  saveTriggers();
 renderRemindersTab();
    renderLinksTab();
    showToast(`✅ "${triggerName}" deleted`, 'success');
    chrome.alarms.clear('trigger_' + index);
  }
 );
    }
}

// --- Link Modal ---
function openLinkModal(triggerIndex, linkIndex = null) {
 currentEditIndex.trigger = triggerIndex;
 currentEditIndex.link = linkIndex;
 
 const modal = document.getElementById('link-modal');
 const title = document.getElementById('link-modal-title');
 const form = document.getElementById('link-form');
 
 form.reset();
 
 if (linkIndex !== null) {
 title.textContent = 'Edit Link';
 const link = triggers[triggerIndex].links[linkIndex];
 document.getElementById('link-name').value = link.name;
 document.getElementById('link-url').value = link.url;
 } else {
 title.textContent = 'Add Link';
 }
 
 openModal('link-modal');
}

function handleLinkSubmit(e) {
    e.preventDefault();

    const name = document.getElementById('link-name').value.trim();
    const url = document.getElementById('link-url').value.trim();

    if (!/^https?:\/\/.+/.test(url)) {
showToast('❌ Invalid URL - must start with http:// or https://', 'error');
        return;
    }
 
    const tIdx = currentEditIndex.trigger;
    const lIdx = currentEditIndex.link;

    // Fetch favicon for the URL
    const favicon = getFaviconUrl(url);

    if (lIdx !== null) {
    triggers[tIdx].links[lIdx] = { name, url, favicon };
  showToast('🔁 Link updated', 'success');
    } else {
  if (triggers[tIdx].links.length >= MAX_LINKS) {
     showToast('⚠️ Maximum links reached', 'error');
closeModal('link-modal');
            return;
     }
        triggers[tIdx].links.push({ name, url, favicon });
   showToast('🔗 Link added', 'success');
    }

    saveTriggers();
    renderLinksTab();
    closeModal('link-modal');
}

// Helper function to get favicon URL from a website
function getFaviconUrl(url) {
    try {
        const urlObj = new URL(url);
        return `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=32`;
    } catch (e) {
   console.error('Error parsing URL for favicon:', e);
      return '';
    }
}

function handleLinkAction(e) {
    const btn = e.target.closest('button');
    if (!btn) return;

    const action = btn.dataset.action;
    const tIdx = parseInt(btn.dataset.trigger);
    const lIdx = parseInt(btn.dataset.link);

    if (action === 'add') {
        openLinkModal(tIdx);
    } else if (action === 'edit') {
        openLinkModal(tIdx, lIdx);
    } else if (action === 'delete') {
const linkName = triggers[tIdx].links[lIdx].name;
  showConfirm(
   `🗑️ Delete link "${linkName}"?`,
          () => {
     triggers[tIdx].links.splice(lIdx, 1);
       saveTriggers();
           renderLinksTab();
   showToast('✅ Link deleted', 'success');
            }
        );
    }
}

// --- Confirm Dialog ---
function showConfirm(message, onConfirm, onCancel = null) {
 console.log('showConfirm called with message:', message);
 
 const confirmMessageEl = document.getElementById('confirm-message');
 const confirmModal = document.getElementById('confirm-modal');
 
 if (!confirmMessageEl || !confirmModal) {
  console.error('Confirm modal elements not found!');
   return;
 }
 
 confirmMessageEl.textContent = message;
 
 const okBtn = document.getElementById('confirm-ok');
 const newOkBtn = okBtn.cloneNode(true);
 okBtn.parentNode.replaceChild(newOkBtn, okBtn);
 
 const cancelBtn = document.getElementById('confirm-cancel');
 const newCancelBtn = cancelBtn.cloneNode(true);
 cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);
 
 newOkBtn.addEventListener('click', () => {
     console.log('OK button clicked');
 onConfirm();
 closeModal('confirm-modal');
 });
 
 newCancelBtn.addEventListener('click', () => {
     console.log('Cancel button clicked');
 if (onCancel) onCancel();
 closeModal('confirm-modal');
 });
 
 console.log('Opening confirm modal');
 openModal('confirm-modal');
}

// --- Motivational Tip Rotation ---
function rotateTip() {
 const tipEl = document.getElementById('motivational-tip');
 if (!tipEl) return;
 tipEl.style.opacity = '0';
 setTimeout(() => {
 tipEl.textContent = MOTIVATIONAL_TIPS[tipIndex];
 tipEl.style.opacity = '1';
 tipIndex = (tipIndex + 1) % MOTIVATIONAL_TIPS.length;
 }, 300);
}

// --- Toast Notification ---
function showToast(msg, type = 'success') {
 const toast = document.getElementById('toast');
 toast.textContent = msg;
 toast.className = 'toast show ' + type;
 setTimeout(() => toast.className = 'toast', 3000);
}

// --- Storage Helpers ---
function saveTriggers() {
 chrome.storage.sync.set({ triggers }, () => {
 console.log('Triggers saved:', triggers);
 });
}

function saveSettings() {
 chrome.storage.sync.set({ settings }, () => {
 console.log('Settings saved:', settings);
 });
}

function loadData() {
 chrome.storage.sync.get(['triggers', 'settings', 'defaultTriggerDeleted'], data => {
 triggers = data.triggers || [];
 settings = Object.assign(settings, data.settings || {});
        
        // Add default trigger on first install if not already deleted by user
        if (triggers.length === 0 && !data.defaultTriggerDeleted) {
            console.log('First install detected - adding default Software Developer Job trigger');
         addDefaultTrigger();
        }
        
 renderRemindersTab();
 renderLinksTab();
 renderSettingsTab();
 updateCountdown();
 });
}

// Add default trigger on first install
function addDefaultTrigger() {
    const defaultTrigger = {
    name: "Software Developer Job",
        reminder: {
            type: "daily",
            time: "09:00"
     },
        links: [
            {
     name: "LinkedIn Software Engineer Jobs - India",
              url: "https://www.linkedin.com/jobs/search/?alertAction=viewjobs&f_E=2%2C3%2C4%2C5&f_JT=F&f_TPR=r40000&f_WT=1%2C3%2C2&geoId=102713980&keywords=software%20engineer&location=India&origin=JOB_SEARCH_PAGE_JOB_FILTER&sortBy=R",
            favicon: "https://www.google.com/s2/favicons?domain=linkedin.com&sz=32"
    }
        ],
      paused: false,
    isDefault: true  // Mark as default trigger
    };
 
    triggers.push(defaultTrigger);
    saveTriggers();
    
    // Create alarm for default trigger
    chrome.runtime.sendMessage({
        type: 'createAlarm',
   trigger: defaultTrigger,
        index: 0
    });
    
    console.log('✅ Default trigger added successfully');
    showToast('👋 Welcome! Default job search reminder added at 9:00 AM daily', 'success');
}


// --- Reminders Tab ---
function renderRemindersTab() {
 const list = document.getElementById('reminders-list');
 if (!list) return;
 
 list.innerHTML = '';
 
 if (triggers.length === 0) {
 list.innerHTML = '<div class="empty-state">No reminders yet — create your first one!</div>';
 } else {
 triggers.forEach((trigger, idx) => {
const card = document.createElement('div');
        card.className = 'card';
      const isPaused = trigger.paused || false;
          
  card.innerHTML = `
  <div class="card-title">${escapeHtml(trigger.name)} ${isPaused ? '<span style="color: #f59e0b; font-size: 0.9rem;">⏸️ Paused</span>' : ''}</div>
 <div class="card-info">🕒 ${formatReminder(trigger.reminder)}</div>
         <div class="card-info">🔗 ${trigger.links.length} / ${MAX_LINKS} links used</div>
 <div class="card-actions">
         <button data-action="pause" data-index="${idx}">${isPaused ? '▶️ Resume' : '⏸️ Pause'}</button>
 <button data-action="edit" data-index="${idx}">✏️ Edit</button>
 <button data-action="delete" data-index="${idx}">🗑️ Delete</button>
 </div>
 `;
 list.appendChild(card);
 });
 }
 
 const addBtn = document.getElementById('add-reminder-btn');
 if (addBtn) {
 addBtn.disabled = triggers.length >= MAX_TRIGGERS;
 addBtn.textContent = triggers.length >= MAX_TRIGGERS 
 ? `⚠️ Maximum ${MAX_TRIGGERS} triggers reached` 
 : '+ Add Reminder';
 }
}

function formatReminder(reminder) {
 if (reminder.type === 'daily') {
        // Convert 24-hour format to 12-hour format with AM/PM
  const [hour, minute] = reminder.time.split(':').map(Number);
  const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `Daily at ${displayHour}:${String(minute).padStart(2, '0')} ${period}`;
 } else {
 return `Every ${reminder.interval} ${reminder.unit}`;
 }
}

function escapeHtml(text) {
 const div = document.createElement('div');
 div.textContent = text;
 return div.innerHTML;
}

// --- Links Tab ---
function renderLinksTab() {
 const list = document.getElementById('links-list');
 if (!list) return;
 
 list.innerHTML = '';
 
 if (triggers.length === 0) {
 list.innerHTML = '<div class="empty-state">No triggers — add a reminder first!</div>';
 return;
 }
 
 triggers.forEach((trigger, tIdx) => {
 const card = document.createElement('div');
 card.className = 'link-card';
 
 const linksHtml = trigger.links.map((link, lIdx) => `
 <div class="link-row">
 <div style="display: flex; align-items: center; gap: 8px; flex: 1;">
 ${link.favicon ? `<img src="${escapeHtml(link.favicon)}" alt="" style="width: 16px; height: 16px; border-radius: 3px;" onerror="this.style.display='none'">` : ''}
 <div style="flex: 1;">
 <div style="font-weight: 600; color: #2d3748; margin-bottom: 2px;">${escapeHtml(link.name)}</div>
 <span class="link-url">${truncateUrl(link.url)}</span>
 </div>
        </div>
 <div class="link-actions">
 <button data-action="edit" data-trigger="${tIdx}" data-link="${lIdx}" title="Edit">✏️</button>
 <button data-action="delete" data-trigger="${tIdx}" data-link="${lIdx}" title="Delete">🗑️</button>
 </div>
 </div>
 `).join('');
 
 card.innerHTML = `
 <div class="link-title">${escapeHtml(trigger.name)}</div>
 <div class="link-count">${trigger.links.length} / ${MAX_LINKS} links</div>
 ${trigger.links.length > 0 ? `<div class="link-list">${linksHtml}</div>` : '<div style="color: #a0aec0; text-align: center; padding: 16px;">No links added yet</div>'}
 <button data-action="add" data-trigger="${tIdx}" class="primary-btn" ${trigger.links.length >= MAX_LINKS ? 'disabled' : ''}>
 ${trigger.links.length >= MAX_LINKS ? '⚠️ Maximum links reached' : '+ Add Link'}
 </button>
 `;
 list.appendChild(card);
 });
}

function truncateUrl(url) {
 return url.length > 40 ? url.slice(0, 37) + '...' : url;
}

// Listen for storage changes
chrome.storage.onChanged.addListener((changes, area) => {
 if (area === 'sync' && changes.triggers) {
     // Triggers changed, re-render tabs
     if (currentTab === 'reminders') renderRemindersTab();
     if (currentTab === 'links') renderLinksTab();
    }
});

// --- Countdown to Next Reminder ---
function updateCountdown() {
 const el = document.getElementById('next-reminder-countdown');
 if (!el || triggers.length === 0) {
 if (el) el.textContent = '';
 return;
 }
 
 chrome.alarms.getAll(alarms => {
 if (alarms.length > 0) {
 const nextAlarm = alarms.reduce((earliest, alarm) => 
 !earliest || alarm.scheduledTime < earliest.scheduledTime ? alarm : earliest
 );
 
 const now = Date.now();
 const timeLeft = nextAlarm.scheduledTime - now;
 
 if (timeLeft > 0) {
 const hours = Math.floor(timeLeft / (1000 * 60 * 60));
 const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
 el.textContent = `⏰ Next reminder in ${hours}h ${minutes}m`;
 } else {
 el.textContent = '⏰ Reminder due now!';
 }
 } else {
 el.textContent = '⏰ No active reminders';
 }
 });
}

const EMOJIS = {
    reminder: ['🕒', '⏰', '🔔', '🚨', '📅', '⏳'],
    link: ['🔗', '🌐', '📎', '🌍'],
    success: ['✅', '🎉', '👍', '💪'],
    error: ['❌', '🚫', '⚠️', '💥'],
    motivation: ['💡', '🔥', '🌟', '💪', '🏆'],
};

function getRandomEmoji(type) {
 const emojis = EMOJIS[type] || [];
    return emojis[Math.floor(Math.random() * emojis.length)] || '🔔';
}

// Listen for background messages
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'reminderFired') {
  console.log('Reminder fired in popup:', msg.trigger.name);
      if (!isInitialized) {
       console.log('Popup not ready yet, queuing reminder message');
 pendingReminderMessage = msg;
   sendResponse({ received: true, queued: true });
         return true;
        }
  
     handleReminderFiredMessage(msg);
        sendResponse({ received: true });
    }
    return true;
});

// Open all links with a delay between each
function openAllLinksWithDelay(links) {
  console.log('openAllLinksWithDelay called with', links.length, 'links');
    console.log('Links array:', JSON.stringify(links));
    
 if (!links || links.length === 0) {
console.log('No links to open');
   return;
  }
  
  // Send message to background script to open all links
    // This prevents popup closure from cancelling the tab creation
    chrome.runtime.sendMessage({
     type: 'openAllLinks',
 links: links
    }, (response) => {
if (chrome.runtime.lastError) {
       console.error('Error sending openAllLinks message:', chrome.runtime.lastError.message);
        } else {
console.log('Background script will open all links:', response);
   }
    });
    
    // Show toast immediately
 showToast(`${getRandomEmoji('link')} Opening ${links.length} link${links.length > 1 ? 's' : ''}!`, 'success');
}

// Play reminder sound in popup
function playReminderSound() {
    console.log('Attempting to play reminder sound...');
    try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
const gainNode = audioContext.createGain();
     
   oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
        
        // Play a pleasant notification sound (two tones)
oscillator.frequency.value = 800;
   oscillator.type = 'sine';
     
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
   
    oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.3);
 
// Second tone
  setTimeout(() => {
   const oscillator2 = audioContext.createOscillator();
  const gainNode2 = audioContext.createGain();
 
  oscillator2.connect(gainNode2);
   gainNode2.connect(audioContext.destination);
       
oscillator2.frequency.value = 1000;
 oscillator2.type = 'sine';
     
       gainNode2.gain.setValueAtTime(0.3, audioContext.currentTime);
 gainNode2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
  
   oscillator2.start(audioContext.currentTime);
  oscillator2.stop(audioContext.currentTime + 0.3);
 
  console.log('✅ Reminder sound played successfully');
}, 200);
  
  } catch (error) {
  console.error('❌ Could not play sound in popup:', error);
  }
}

