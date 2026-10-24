# Instahyre Auto-Apply Helper

A small Manifest V3 Chrome extension prototype for assisting with the Instahyre application flow.

## Install
1. Download this repository (or the `instahyre-auto-apply` folder).
2. Open `chrome://extensions`.
3. Enable Developer mode.
4. Choose **Load unpacked** and select the extension folder containing `manifest.json`.
5. Open Instahyre and test on one job first.

## Scope
- Detects visible Apply controls on Instahyre.
- Watches for dynamically-rendered follow-up dialogs.
- Provides start/stop controls.
- Uses conservative selectors and a cooldown to avoid rapid duplicate clicks.

## Important
This is a prototype and has not been verified against every version of Instahyre's live DOM. Review the code and test manually before relying on it. Keep job applications truthful and pause if the page presents a CAPTCHA, unexpected dialog, or unclear submission state.

## Files
- `manifest.json` — Chrome extension configuration
- `content.js` — DOM detection and click flow
- `popup.html` / `popup.js` — extension popup controls
