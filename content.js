// Listener para mensagens do script de fundo (background.js)
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const videoElement = document.querySelector('.html5-main-video');

  if (!videoElement) {
    console.error('Player de vídeo do YouTube não encontrado.');
    sendResponse({ status: 'error', message: 'Player não encontrado' });
    return;
  }

  if (request.action === 'muteVideo') {
    videoElement.muted = true;
    console.log('Vídeo silenciado.');
    sendResponse({ status: 'success', message: 'Vídeo silenciado' });
  } else if (request.action === 'unmuteVideo') {
    videoElement.muted = false;
    // Opcional: define um volume baixo em vez de reativar o som completamente
    videoElement.volume = 0.1;
    console.log('Som do vídeo reativado em volume baixo.');
    sendResponse({ status: 'success', message: 'Som do vídeo reativado' });
  }
});