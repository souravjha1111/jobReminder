(() => {
  if (window.__instahyreApplyHelperLoaded) return;
  window.__instahyreApplyHelperLoaded = true;

  let enabled = false;
  let scanTimer = null;
  let busy = false;
  let lastClickAt = 0;
  const CLICK_COOLDOWN_MS = 1800;
  const seen = new WeakSet();
  const PREFIX = '[Instahyre Apply Helper]';

  const norm = value => String(value || '').replace(/\s+/g, ' ').trim().toLowerCase();
  const log = (...args) => console.info(PREFIX, ...args);

  function isVisible(el) {
    if (!(el instanceof Element) || !el.isConnected) return false;
    const rect = el.getBoundingClientRect();
    const style = getComputedStyle(el);
    return rect.width > 0 && rect.height > 0 &&
      style.display !== 'none' && style.visibility !== 'hidden' &&
      style.opacity !== '0';
  }

  function isDisabled(el) {
    const cls = typeof el.className === 'string' ? el.className : '';
    return Boolean(el.disabled) ||
      el.getAttribute('aria-disabled') === 'true' ||
      el.getAttribute('disabled') !== null ||
      /\bdisabled\b/i.test(cls);
  }

  function labelOf(el) {
    return norm(el.innerText || el.textContent || el.getAttribute('aria-label') || el.value);
  }

  // Instahyre has rendered buttons as both <button> elements and styled
  // Angular elements such as <div class="btn-filled btn-sm ng-binding">.
  const ACTION_SELECTOR = [
    'button', '[role="button"]', 'a',
    'input[type="button"]', 'input[type="submit"]',
    '[ng-click]', '.btn-filled', '.btn-primary',
    '.btn', '[class~="btn-sm"]'
  ].join(',');

  function actionElements(root = document) {
    const found = [...root.querySelectorAll(ACTION_SELECTOR)].filter(isVisible);
    return [...new Set(found)];
  }

  function findDialogRoots() {
    const roots = [...document.querySelectorAll(
      '[role="dialog"], .modal, .modal-dialog, .modal-content, [class*="modal"]'
    )].filter(isVisible);

    // Fallback for app dialogs without a semantic dialog/modal class:
    // find the smallest visible ancestor containing the follow-up text.
    const phrase = [...document.querySelectorAll('body *')].find(el => {
      if (!isVisible(el) || el.children.length > 4) return false;
      const t = labelOf(el);
      return t.includes('application sent') ||
        t.includes('want to apply to other similar jobs');
    });
    if (phrase) {
      let parent = phrase;
      for (let i = 0; i < 7 && parent && parent !== document.body; i++, parent = parent.parentElement) {
        if (actionElements(parent).some(el => /^apply to \d+ jobs?$/.test(labelOf(el)))) {
          roots.unshift(parent);
          break;
        }
      }
    }
    return [...new Set(roots)];
  }

  function queueScan(delay = 450) {
    if (!enabled) return;
    clearTimeout(scanTimer);
    scanTimer = setTimeout(scan, delay);
  }

  function clickSafely(el, description) {
    if (!enabled || !isVisible(el) || isDisabled(el)) return false;

    const elapsed = Date.now() - lastClickAt;
    if (elapsed < CLICK_COOLDOWN_MS) {
      // Don't fall through and click a different Apply button underneath a modal.
      queueScan(CLICK_COOLDOWN_MS - elapsed + 100);
      return null;
    }

    el.scrollIntoView({ block: 'center', inline: 'center', behavior: 'auto' });
    log('Clicking:', description, '| element:', el.tagName, '| class:', typeof el.className === 'string' ? el.className : '');
    lastClickAt = Date.now();
    el.click();
    return true;
  }

  function handleSimilarJobsDialog() {
    for (const root of findDialogRoots()) {
      const txt = labelOf(root);
      if (!(txt.includes('application sent') ||
            txt.includes('want to apply to other similar jobs'))) continue;

      const action = actionElements(root).find(el => {
        const label = labelOf(el);
        return /^apply to \d+ jobs?$/.test(label) ||
          label === 'apply to selected jobs';
      });

      if (!action) continue;
      if (seen.has(action)) return true;

      const result = clickSafely(action, labelOf(action));
      if (result === true) seen.add(action);
      return true; // Dialog handled; never click a background button this scan.
    }
    return false;
  }

  function handlePrimaryApply() {
    const candidates = actionElements(document).filter(el => {
      const label = labelOf(el);
      return label === 'apply' || label === 'apply now' ||
        label === 'apply to job' || label === 'apply for this job';
    });

    const target = candidates.find(el => !seen.has(el) && !isDisabled(el));
    if (!target) return false;

    const result = clickSafely(target, labelOf(target));
    if (result === true) seen.add(target);
    return result !== false;
  }

  function scan() {
    if (!enabled || busy) return;
    busy = true;
    try {
      if (!handleSimilarJobsDialog()) handlePrimaryApply();
    } catch (error) {
      console.error(PREFIX, 'Scan failed:', error);
    } finally {
      busy = false;
    }
  }

  const observer = new MutationObserver(() => {
    if (enabled) queueScan(450);
  });
  observer.observe(document.documentElement, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: ['class', 'disabled', 'aria-disabled', 'checked']
  });

  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message.action === 'START') {
      enabled = true;
      chrome.storage.local.set({ enabled: true });
      log('Started. Watching for visible Apply buttons.');
      queueScan(50);
      sendResponse({ ok: true, enabled: true });
    } else if (message.action === 'STOP') {
      enabled = false;
      clearTimeout(scanTimer);
      chrome.storage.local.set({ enabled: false });
      log('Stopped.');
      sendResponse({ ok: true, enabled: false });
    } else if (message.action === 'STATUS') {
      sendResponse({ ok: true, enabled, page: location.href });
    }
    return true;
  });

  chrome.storage.local.get({ enabled: false }, value => {
    enabled = Boolean(value.enabled);
    if (enabled) {
      log('Restored enabled state. Watching for buttons.');
      queueScan(300);
    }
  });
})();