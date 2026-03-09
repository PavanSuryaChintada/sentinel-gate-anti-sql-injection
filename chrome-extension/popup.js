document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('toggle');
  const link = document.getElementById('ciphershieldLink');
  if (link) link.href = 'https://ciphershield.vercel.app';

  chrome.storage.sync.get(['ciphershieldEnabled'], (result) => {
    const enabled = result.ciphershieldEnabled !== false;
    toggle.classList.toggle('on', enabled);
    toggle.setAttribute('aria-checked', enabled);
  });

  toggle.addEventListener('click', () => {
    const isOn = toggle.classList.contains('on');
    const newState = !isOn;
    chrome.storage.sync.set({ ciphershieldEnabled: newState }, () => {
      toggle.classList.toggle('on', newState);
      toggle.setAttribute('aria-checked', newState);
    });
  });
});
