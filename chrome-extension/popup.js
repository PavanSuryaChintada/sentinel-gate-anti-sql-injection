document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('toggle');
  const link = document.getElementById('sentinelgateLink');
  if (link) link.href = 'https://sentinelgate.vercel.app';

  chrome.storage.sync.get(['sentinelgateEnabled'], (result) => {
    const enabled = result.sentinelgateEnabled !== false;
    toggle.classList.toggle('on', enabled);
    toggle.setAttribute('aria-checked', enabled);
  });

  toggle.addEventListener('click', () => {
    const isOn = toggle.classList.contains('on');
    const newState = !isOn;
    chrome.storage.sync.set({ sentinelgateEnabled: newState }, () => {
      toggle.classList.toggle('on', newState);
      toggle.setAttribute('aria-checked', newState);
    });
  });
});
