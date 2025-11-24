chrome.runtime.onInstalled.addListener(() => {
 console.log('CareerClock - Smart Application Tracker installed');
 chrome.storage.sync.get(['settings'], data => {
 if (!data.settings) {
 chrome.storage.sync.set({
 settings: {
 sound: true,
 autoPopup: true,
 systemNotification: true,
 autoOpenLinks: false
 }
 });
 }
 });
 
 // Recreate alarms for existing triggers
 chrome.storage.sync.get(['triggers'], data => {
 if (data.triggers && data.triggers.length > 0) {
 data.triggers.forEach((trigger, idx) => {
 createAlarm(trigger, idx);
 });
 console.log('Alarms recreated for', data.triggers.length, 'triggers');
 }
 });
});

// Create alarm for a trigger
function createAlarm(trigger, idx) {
 const alarmName = 'trigger_' + idx;
 
 if (trigger.reminder.type === 'daily') {
 const [hour, minute] = trigger.reminder.time.split(':').map(Number);
 const now = new Date();
 let alarmTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute, 0, 0);
 
 // If time has passed today, schedule for tomorrow
 if (alarmTime <= now) {
 alarmTime.setDate(alarmTime.getDate() + 1);
 }
 
 const when = alarmTime.getTime();
 chrome.alarms.create(alarmName, { 
 when,
 periodInMinutes: 24 * 60 // Repeat daily
 });
 console.log(`Daily alarm created: ${alarmName} at ${trigger.reminder.time}`);
 } else {
 // Interval-based reminder
 let intervalMinutes;
 if (trigger.reminder.unit === 'hours') {
 intervalMinutes = parseInt(trigger.reminder.interval) * 60;
 } else { // days
 intervalMinutes = parseInt(trigger.reminder.interval) * 24 * 60;
 }
 
 chrome.alarms.create(alarmName, { 
 delayInMinutes: intervalMinutes,
 periodInMinutes: intervalMinutes 
 });
 console.log(`Interval alarm created: ${alarmName} every ${trigger.reminder.interval} ${trigger.reminder.unit}`);
 }
}

// Handle alarm triggers
chrome.alarms.onAlarm.addListener(alarm => {
 console.log('Alarm triggered:', alarm.name);
 
 chrome.storage.sync.get(['triggers', 'settings'], data => {
 const idx = parseInt(alarm.name.replace('trigger_', ''));
 const trigger = data.triggers && data.triggers[idx];
 const settings = data.settings || { sound: true, autoPopup: true, systemNotification: true, autoOpenLinks: false };
 
 if (!trigger) {
 console.log('No trigger found for alarm:', alarm.name);
 return;
 }
 
 console.log('Processing reminder for:', trigger.name);
 
 // Show system notification (without icon to avoid errors)
 if (settings.systemNotification) {
 const notificationOptions = {
 type: 'basic',
 title: '🔔 CareerClock Reminder',
 message: `Time to check: ${trigger.name}\n${trigger.links.length} job link(s) waiting!`,
 priority: 2,
 requireInteraction: true
 };
 
 chrome.notifications.create('reminder_' + idx, notificationOptions, (notificationId) => {
 console.log('Notification created:', notificationId);
 });
 }
 
 // Play sound
 if (settings.sound) {
 playNotificationSound();
 }
 
 // Auto-open popup
 if (settings.autoPopup) {
 chrome.action.openPopup().then(() => {
 console.log('Popup opened successfully');
 // Wait a bit for popup to initialize before sending message
 setTimeout(() => {
 sendReminderMessage(trigger, idx);
 }, 300);
 }).catch(err => {
 console.log('Could not open popup:', err);
 // Try to send message anyway in case popup is already open
 sendReminderMessage(trigger, idx);
 });
 } else {
 // If auto-popup is disabled, still send message in case popup is open
 sendReminderMessage(trigger, idx);
 }
 });
});

// Send reminder message to popup
function sendReminderMessage(trigger, idx) {
 chrome.runtime.sendMessage({ 
 type: 'reminderFired', 
 trigger: trigger,
 index: idx
 }).then(response => {
 console.log('Message delivered to popup:', response);
 }).catch(err => {
 console.log('Popup not open or message failed:', err);
 });
}

// Play notification sound
function playNotificationSound() {
 // Create an audio context for playing sound
 try {
 const audioContext = new (self.AudioContext || self.webkitAudioContext)();
 const oscillator = audioContext.createOscillator();
 const gainNode = audioContext.createGain();
 
 oscillator.connect(gainNode);
 gainNode.connect(audioContext.destination);
 
 oscillator.frequency.value = 800;
 oscillator.type = 'sine';
 
 gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
 gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
 
 oscillator.start(audioContext.currentTime);
 oscillator.stop(audioContext.currentTime + 0.5);
 
 console.log('Notification sound played');
 } catch (error) {
 console.log('Could not play sound:', error);
 }
}

// Handle notification clicks
chrome.notifications.onClicked.addListener((notificationId) => {
 console.log('Notification clicked:', notificationId);
 
 const idx = parseInt(notificationId.replace('reminder_', ''));
 
 chrome.storage.sync.get(['triggers'], data => {
 const trigger = data.triggers && data.triggers[idx];
 if (trigger && trigger.links.length > 0) {
 // Open all links
 trigger.links.forEach(link => {
 chrome.tabs.create({ url: link.url });
 });
 }
 });
 
 // Clear the notification
 chrome.notifications.clear(notificationId);
 
 // Open popup
 chrome.action.openPopup().catch(err => {
 console.log('Could not open popup:', err);
 });
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
 if (message.type === 'createAlarm') {
 createAlarm(message.trigger, message.index);
 sendResponse({ success: true });
 return true;
 }
 
 if (message.type === 'clearAlarm') {
 chrome.alarms.clear('trigger_' + message.index, (wasCleared) => {
 console.log('Alarm cleared:', wasCleared);
 sendResponse({ success: wasCleared });
 });
 return true;
 }
    if (message.type === 'openAllLinks') {
        console.log('Background: Opening all links via message');
   const links = message.links || [];
        links.forEach((link, index) => {
       setTimeout(() => {
      chrome.tabs.create({ url: link.url }, (tab) => {
          if (chrome.runtime.lastError) {
    console.error('Error opening link', link.url, chrome.runtime.lastError);
          } else {
console.log(`✅ Opened tab ${index + 1}/${links.length}:`, link.url);
       }
        });
    }, index * 150);
        });
    sendResponse({ success: true });
return true;
    }

 return true;
});

// Listen for storage changes to update alarms
chrome.storage.onChanged.addListener((changes, area) => {
 if (area === 'sync' && changes.triggers) {
 console.log('Triggers changed, updating alarms');
 const newTriggers = changes.triggers.newValue || [];
 
 // Clear all existing alarms
 chrome.alarms.clearAll(() => {
 console.log('All alarms cleared');
 
 // Recreate alarms for all triggers
 newTriggers.forEach((trigger, idx) => {
 createAlarm(trigger, idx);
 });
 console.log('Alarms recreated for', newTriggers.length, 'triggers');
 });
 }
});
