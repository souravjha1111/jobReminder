(() => {
  if (window.__instahyreApplyHelperLoaded) return;
  window.__instahyreApplyHelperLoaded = true;

  let enabled = false;
  let busy = false;
  let lastClickAt = 0;
  const CLICK_COOLDOWN_MS = 2200;
  const seen = new WeakSet();

  const norm = s => (s || '').replace(/\s+/g, ' ').trim().toLowerCase();
  const visible = el => {
    if (!el || !el.isConnected) return false;
    const r = el.getBoundingClientRect();
    const st = getComputedStyle(el);
    return r.width > 0 && r.height > 0 && st.display !== 'none' && st.visibility !== 'hidden' && st.opacity !== '0';
  };
  const disabled = el => el.disabled || el.getAttribute('aria-disabled') === 'true' || /disabled/.test(el.className || '');
  const textOf = el => norm(el.innerText || el.textContent);
  const clickSafely = el => {
    if (!enabled || !visible(el) || disabled(el) || Date.now() - lastClickAt < CLICK_COOLDOWN_MS) return false;
    lastClickAt = Date.now();
    el.scrollIntoView({block:'center', inline:'center', behavior:'auto'});
    // Use the native click path so Angular/React event handlers receive the interaction.
    el.click();
    return true;
  };
  const buttons = root => [...root.querySelectorAll('button, [role="button"], a.btn, input[type="button"], input[type="submit"]')].filter(visible);
  const modalCandidates = () => [...document.querySelectorAll('[role="dialog"], .modal, .modal-dialog, .modal-content')].filter(visible);

  function handleSimilarJobsDialog(){
    const dialogs = modalCandidates();
    for (const dialog of dialogs) {
      const txt = textOf(dialog);
      // Only act on the follow-up dialog shown after a successful application.
      if (!(txt.includes('application sent') || txt.includes('want to apply to other similar jobs'))) continue;
      const selected = [...dialog.querySelectorAll('input[type="checkbox"]')].some(cb => cb.checked);
      if (!selected) continue;
      const action = buttons(dialog).find(b => {
        const t = textOf(b);
        return /^apply to \d+ job(s)?$/.test(t) || t === 'apply to selected jobs';
      });
      if (action && !seen.has(action)) {
        if (clickSafely(action)) { seen.add(action); return true; }
      }
    }
    return false;
  }

  function handlePrimaryApply(){
    // Restrict to explicit, visible Apply controls. Avoid generic class-only clicks.
    const candidates = buttons(document).filter(b => {
      const t = textOf(b);
      return t === 'apply' || t === 'apply now' || t === 'apply to job';
    });
    const target = candidates.find(b => !seen.has(b) && !disabled(b));
    if (target) {
      if (clickSafely(target)) { seen.add(target); return true; }
      return false;
    }
    return false;
  }

  function scan(){
    if (!enabled || busy) return;
    busy = true;
    try {
      // Modal first: otherwise a generic Apply control behind the overlay could be clicked.
      if (!handleSimilarJobsDialog()) handlePrimaryApply();
    } finally { busy = false; }
  }

  let timer = null;
  const observer = new MutationObserver(() => {
    if (!enabled) return;
    clearTimeout(timer);
    timer = setTimeout(scan, 500);
  });
  observer.observe(document.documentElement, {subtree:true, childList:true, attributes:true, attributeFilter:['class','disabled','aria-disabled','checked']});

  chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
    if (msg.action === 'START') {
      enabled = true;
      chrome.storage.local.set({enabled:true});
      scan();
      sendResponse({ok:true, enabled});
    } else if (msg.action === 'STOP') {
      enabled = false;
      clearTimeout(timer);
      chrome.storage.local.set({enabled:false});
      sendResponse({ok:true, enabled});
    }
    return true;
  });
  chrome.storage.local.get({enabled:false}, v => { enabled = !!v.enabled; if (enabled) scan(); });
})();