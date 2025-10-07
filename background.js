// Listener para mensagens do popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'startDubbing') {
    startDubbingProcess();
    sendResponse({ status: 'Processo de dublagem iniciado...' });
  }
  // Retorna true para indicar que a resposta será enviada de forma assíncrona
  return true;
});

async function startDubbingProcess() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (!tab || !tab.url || !tab.url.includes('youtube.com/watch')) {
    updatePopupStatus('Por favor, navegue para um vídeo do YouTube para usar esta extensão.');
    return;
  }

  try {
    // Silencia o vídeo original
    await executeContentScript(tab.id, { action: 'muteVideo' });

    // ETAPA 1: Obter áudio (espaço reservado)
    updatePopupStatus('Etapa 1/4: Baixando áudio... (Espaço reservado)');
    const audioBlob = await getAudioFromYouTube(tab.url);
    console.log('Áudio obtido (simulado).');

    // ETAPA 2: Transcrever áudio (espaço reservado)
    updatePopupStatus('Etapa 2/4: Transcrevendo áudio... (Espaço reservado)');
    const englishText = await transcribeAudio(audioBlob);
    console.log('Texto em inglês:', englishText);

    // ETAPA 3: Traduzir texto (espaço reservado)
    updatePopupStatus('Etapa 3/4: Traduzindo texto... (Espaço reservado)');
    const portugueseText = await translateText(englishText);
    console.log('Texto em português:', portugueseText);

    // ETAPA 4: Sintetizar fala (usando a API chrome.tts)
    updatePopupStatus('Etapa 4/4: Gerando áudio dublado...');
    await speakText(portugueseText);

    updatePopupStatus('Dublagem concluída!');

    // Opcional: reativa o som do vídeo original em um volume baixo
    await executeContentScript(tab.id, { action: 'unmuteVideo' });

  } catch (error) {
    console.error('Erro no processo de dublagem:', error);
    updatePopupStatus(`Erro: ${error.message}`);
  }
}

// --- FUNÇÕES DE ESPAÇO RESERVADO ---
// Você precisará substituir estas por chamadas de API reais para o seu back-end.

async function getAudioFromYouTube(url) {
  // **AÇÃO NECESSÁRIA:** Implemente um endpoint de back-end que receba uma URL do YouTube,
  // baixe o áudio e o retorne.
  console.warn('Aviso: getAudioFromYouTube() é uma simulação.');
  await new Promise(resolve => setTimeout(resolve, 1500));
  return { status: 'success' }; // Retorna um objeto de sucesso simulado
}

async function transcribeAudio(audioBlob) {
  // **AÇÃO NECESSÁRIA:** Envie os dados de áudio para o seu back-end, que os encaminha
  // para um serviço de transcrição (por exemplo, OpenAI Whisper).
  console.warn('Aviso: transcribeAudio() é uma simulação.');
  await new Promise(resolve => setTimeout(resolve, 1500));
  return "Hello, this is a demonstration of a YouTube video dubbing extension.";
}

async function translateText(text) {
  // **AÇÃO NECESSÁRIA:** Envie o texto em inglês para o seu back-end, que chama
  // uma API de tradução (por exemplo, Google Translate) para o português.
  console.warn('Aviso: translateText() é uma simulação.');
  await new Promise(resolve => setTimeout(resolve, 1500));
  return "Olá, esta é uma demonstração de uma extensão de dublagem de vídeo do YouTube.";
}

// --- FUNÇÕES DA EXTENSÃO DO CHROME ---

function speakText(text) {
  return new Promise((resolve, reject) => {
    chrome.tts.speak(text, {
      lang: 'pt-BR',
      rate: 1.0,
      onEvent: (event) => {
        if (event.type === 'end') {
          resolve();
        } else if (event.type === 'error') {
          reject(new Error(event.errorMessage));
        }
      }
    });
  });
}

async function updatePopupStatus(status) {
  // Envia uma mensagem para o popup (se estiver aberto)
  await chrome.runtime.sendMessage({ action: 'updateStatus', status: status });
}

async function executeContentScript(tabId, message) {
  // Injeta e envia uma mensagem para o content script
  await chrome.scripting.executeScript({
    target: { tabId: tabId },
    files: ['content.js']
  });
  return await chrome.tabs.sendMessage(tabId, message);
}