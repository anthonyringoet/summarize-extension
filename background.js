const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const PROMPT_PREFIX = 'Summarize the following text in the text\'s original language: ';

async function summarize(apiKey, text) {
  const prompt = PROMPT_PREFIX + text;
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7
    })
  };

  const response = await fetch(OPENAI_API_URL, requestOptions);
  const data = await response.json();
  return data.choices && data.choices[0] && data.choices[0].message.content.trim();
}

async function createSummaryTab(summary) {
  const summaryHtml = `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Summary</title>
        <style>
          body {
            font-family: -apple-system,BlinkMacSystemFont,"Segoe UI","Noto Sans",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji";
            max-width: 44rem;
            margin: 0 auto;
            padding: 1em;
            font-size: 1.3rem;
            line-height: 1.4;
          }
          pre { white-space: pre-wrap; word-wrap: break-word; }
        </style>
      </head>
      <body>
        <h1>Summary</h1>
        <pre>${summary}</pre>
      </body>
    </html>
  `;

  const summaryUrl = URL.createObjectURL(new Blob([summaryHtml], { type: 'text/html' }));
  await browser.tabs.create({ url: summaryUrl });
}

browser.runtime.onMessage.addListener(handleMessage);

async function handleMessage(message, sender, sendResponse) {
  if (message.action === 'summarize') {
    const apiKey = await browser.storage.sync.get('api_key').then((res) => res.api_key);
    if (!apiKey) {
      alert('Please set your OpenAI API key in the extension settings.');
      return;
    }

    const summary = await summarize(apiKey, message.text);
    createSummaryTab(summary);

    // Send a response back to the popup.
    sendResponse();
  }
}