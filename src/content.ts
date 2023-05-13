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

const doPaint = () => {
  const header = getHeader();
  if (header) {
    const toPublicColor = () => header.style.backgroundColor = '#2a2';
    const toPrivateColor = () => header.style.backgroundColor = '#a22';

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

doPaint();
