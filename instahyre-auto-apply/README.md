# Instahyre Auto-Apply Helper

A small Manifest V3 Chrome extension prototype for assisting with the Instahyre application flow.

## Install / update after a code change

1. Download the repository ZIP and extract it.
2. Open `chrome://extensions`.
3. Enable **Developer mode**.
4. Click **Load unpacked** and select the `instahyre-auto-apply` folder containing `manifest.json`.
5. When updating an existing installation, click **Reload** on the extension card, then refresh the Instahyre tab.
6. Open the extension popup and click **Start auto-apply**. Test on one job first.

## Scope

- Detects visible Apply controls, including Angular-styled controls such as `btn-filled btn-sm ng-binding`.
- Watches for dynamically-rendered follow-up dialogs.
- Provides start/stop controls.
- Uses a cooldown to reduce duplicate rapid clicks.
- Logs detected click attempts to the page's DevTools console with the prefix `[Instahyre Apply Helper]`.

## Debugging

1. Open Instahyre and press F12 to open DevTools.
2. Select **Console**, click Start in the extension popup, and look for messages beginning with `[Instahyre Apply Helper]`.
3. If there is no start log, reload the extension from `chrome://extensions` and refresh the Instahyre tab.
4. If it logs that it is watching but finds no action, inspect the button and share its **Copy outerHTML** plus the Console errors.

## Important

This is a prototype and has not been verified against every version of Instahyre's live DOM. Review the job details and test manually before relying on it. Do not use it to bypass CAPTCHA or other verification; pause if the page presents an unexpected dialog or unclear submission state.

## Files

- `manifest.json` — Chrome extension configuration
- `content.js` — DOM detection and click flow
- `popup.html` / `popup.js` — extension popup controls
