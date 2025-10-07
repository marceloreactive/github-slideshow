// content.js

// Function to add the "Dub" button to the YouTube player
function addDubButton() {
  const playerControls = document.querySelector('.ytp-right-controls');
  if (playerControls && !document.querySelector('.dub-button')) {
    const dubButton = document.createElement('button');
    dubButton.innerText = 'Dub';
    dubButton.className = 'ytp-button dub-button';
    dubButton.style.cssText = 'font-size: 14px; padding: 0 10px; margin-right: 8px;';

    dubButton.addEventListener('click', () => {
      const videoId = new URLSearchParams(window.location.search).get('v');
      if (videoId) {
        console.log('Sending message to background script to start dubbing for video:', videoId);
        chrome.runtime.sendMessage({ action: 'startDubbing', videoId: videoId }, (response) => {
          if (chrome.runtime.lastError) {
            console.error('Error sending message:', chrome.runtime.lastError.message);
          } else {
            console.log('Response from background script:', response.status);
          }
        });
      } else {
        console.error('Could not get video ID.');
      }
    });

    playerControls.prepend(dubButton);
  }
}

// The YouTube page can load content dynamically, so we need to observe for changes
const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    if (mutation.addedNodes.length) {
      addDubButton();
    }
  }
});

observer.observe(document.body, { childList: true, subtree: true });

// Initial attempt to add the button
addDubButton();