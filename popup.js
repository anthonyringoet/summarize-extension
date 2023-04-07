const summarizeButton = document.getElementById('summarize');
const apiKeyMessage = document.getElementById('api-key-message');
const noTextMessage = document.getElementById('no-text-message');
const loadingIndicator = document.getElementById('loading-indicator');

async function updateButtonState() {
  const apiKey = await browser.storage.sync.get('api_key').then((res) => res.api_key);
  const response = await browser.tabs.executeScript({
    code: 'window.getSelection().toString()',
  });
  const selectedText = response[0];

  if (apiKey && selectedText) {
    summarizeButton.disabled = false;
    apiKeyMessage.hidden = true;
    noTextMessage.hidden = true;
  } else {
    summarizeButton.disabled = true;
    apiKeyMessage.hidden = Boolean(apiKey);
    noTextMessage.hidden = Boolean(selectedText);
  }
}

summarizeButton.addEventListener('click', async () => {
  loadingIndicator.hidden = false;
  summarizeButton.disabled = true;

  const response = await browser.tabs.executeScript({
    code: 'window.getSelection().toString()',
  });
  const text = response[0] || document.body.innerText;

  // Use the sendMessage to trigger summarization and wait for the response.
  browser.runtime.sendMessage({ action: 'summarize', text }, () => {
    loadingIndicator.hidden = true;
    summarizeButton.disabled = false;
  });
});

updateButtonState();
