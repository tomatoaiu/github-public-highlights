const colorInputs = document.querySelectorAll('input[type="color"]');

const PUBLIC_REPOSITORY = 'color0';
const PRIVATE_REPOSITORY = 'color1';

document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get([PUBLIC_REPOSITORY], (result) => {
    const input = colorInputs[0] as HTMLInputElement;
    input.value = result[PUBLIC_REPOSITORY];
  });
  chrome.storage.local.get([PRIVATE_REPOSITORY], (result) => {
    const input = colorInputs[1] as HTMLInputElement;
    input.value = result[PRIVATE_REPOSITORY];
  });

  colorInputs.forEach((input, index) => {
    input.addEventListener('change', (e: Event) => {
      const target = e.target as HTMLInputElement;
      const color = target.value;
      chrome.storage.local.set({ [`color${index}`]: color });

      // const tabs = await chrome.tabs.query({
      //   active: true,
      //   currentWindow: true,
      // });
      // await chrome.tabs.sendMessage(tabs[0]?.id || 0, {
      //   message: { type: 'change-color' },
      // });
    });
  });
});
