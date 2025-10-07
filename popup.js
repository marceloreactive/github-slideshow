document.addEventListener('DOMContentLoaded', () => {
  const dubButton = document.getElementById('dub-button');
  const statusDiv = document.getElementById('status');

  dubButton.addEventListener('click', () => {
    // Envia uma mensagem para o script de fundo para iniciar o processo
    chrome.runtime.sendMessage({ action: 'startDubbing' }, (response) => {
      if (chrome.runtime.lastError) {
        // Lida com erros, como se o script de fundo não estivesse pronto
        statusDiv.textContent = 'Erro: ' + chrome.runtime.lastError.message;
      } else {
        statusDiv.textContent = response.status;
      }
    });
  });

  // Ouve atualizações de status do script de fundo
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'updateStatus') {
      statusDiv.textContent = request.status;
    }
  });
});