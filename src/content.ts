const getHeader = (): HTMLElement | null => {
  const header: HTMLElement | null = document.querySelector(
    '#repository-container-header',
  );
  return header;
};

const getStatusLabel = (
  header: HTMLElement,
): HTMLElement | null | null => {
  const statusLabel: HTMLCollectionOf<Element> | null = header
    .getElementsByClassName(
      'Label Label--secondary v-align-middle mr-1',
    );

  return statusLabel?.[0] as HTMLElement | null;
};

const doPaint = async () => {
  const { color0: publicColor } = await chrome.storage.local.get('color0');
  const { color1: privateColor } = await chrome.storage.local.get('color1');

  const header = getHeader();
  if (header) {
    const toPublicColor = () =>
      header.style.backgroundColor = publicColor ?? '2a2';
    const toPrivateColor = () =>
      header.style.backgroundColor = privateColor ?? 'a22';

    const label = getStatusLabel(header);

    if (label && label.innerText === 'Public') {
      toPublicColor();
    } else if (label && label.innerText === 'Private') {
      toPrivateColor();
    } else if (header.innerText.match(/Public/)) {
      toPublicColor();
    } else if (header.innerText.match(/Private/)) {
      toPrivateColor();
    }
  }
};

// chrome.runtime.onMessage.addListener((_message, _sender, sendResponse) => {
//   if (_message.type === 'change-color') {
//     doPaint();
//     sendResponse();
//     return true;
//   }
// });

doPaint();
