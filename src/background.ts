const PUBLIC_REPOSITORY = 'color0';
const PRIVATE_REPOSITORY = 'color1';

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ [PUBLIC_REPOSITORY]: '#aaaaaa' });
  chrome.storage.sync.set({ [PRIVATE_REPOSITORY]: '#aa22aa' });
});
