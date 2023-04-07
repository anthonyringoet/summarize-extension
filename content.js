browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'summarize') {
    sendResponse(document.body.innerText);
  }
});
