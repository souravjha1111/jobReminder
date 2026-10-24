const statusEl = document.getElementById('status');
function getTab(){ return chrome.tabs.query({active:true,currentWindow:true}).then(tabs=>tabs[0]); }
async function send(action){
  const tab = await getTab();
  if (!tab || !tab.url || !tab.url.includes('instahyre.com')) { statusEl.textContent='Open Instahyre first.'; return; }
  try { await chrome.tabs.sendMessage(tab.id,{action}); statusEl.textContent = action==='START' ? 'Auto-apply enabled' : 'Auto-apply stopped'; }
  catch(e){ statusEl.textContent='Reload the Instahyre tab, then try again.'; }
}
document.getElementById('start').addEventListener('click',()=>send('START'));
document.getElementById('stop').addEventListener('click',()=>send('STOP'));
chrome.storage.local.get({enabled:false},v=>statusEl.textContent=v.enabled?'Auto-apply enabled':'Auto-apply stopped');