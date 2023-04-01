import React, { useState, useEffect } from 'react';
import './App.css';
import _ from 'lodash';

const estimateTokens = (text) => {
  const charCount = text.length;
  const avgCharsPerToken = 4;
  return Math.ceil(charCount / avgCharsPerToken);
};

async function detectAnomaly(text, apiKey) {
  const prompt = `Please analyze the following text for any anomalies, such as broken sentences, incorrect formatting, or irrelevant content. If you find any issues, respond with 'yes' and describe the anomaly in a sentence, otherwise, respond with 'no': ${text}`;

  console.log("calling openai api...")
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant that analyzes texts." },
        { role: "user", content: prompt },
      ],
      temperature: 0.2,
    }),
  });

  const data = await response.json();
  const answer = data.choices && data.choices[0].message.content.trim();
  const hasAnomaly = answer.toLowerCase().startsWith('yes');
  const anomalyReason = hasAnomaly ? answer.substring(4) : '';
  return anomalyReason;
}

const splitLongArticle = (article, prompt, maxTokens) => {
  const pages = [];
  const sentences = article.split('. ');

  let conversation = `${prompt}\nI will send you a long article page by page. Respond "ok" after you receive each page. I will ask you to start the task after you receive the full article\n`;
  let tokenCount = estimateTokens(conversation);

  for (const sentence of sentences) {
    const sentenceTokens = sentence.split(' ').length + 1; // +1 for the period
    if (tokenCount + sentenceTokens > maxTokens) {
      conversation += '\n--- end of page. respond ok for the next page';
      pages.push(conversation);
      conversation = '';
      tokenCount = estimateTokens(conversation);
    }

    conversation += sentence + '. ';
    tokenCount += sentenceTokens;
  }

  conversation += '\n--- This is the end of the article\n';
  conversation += prompt;
  pages.push(conversation);

  return pages;
};

function App() {
  const [taskPrompt, setTaskPrompt] = useState('');
  const [longArticle, setLongArticle] = useState('');
  const [tokenLimit, setTokenLimit] = useState(4000);
  const [conversations, setConversations] = useState([]);
  const [apiKey, setApiKey] = useState('');
  const [anomalies, setAnomalies] = useState([]);

  useEffect(() => {
    const storedApiKey = localStorage.getItem("openaiApiKey");

    // Set the input value if a stored API key is found
    if (storedApiKey) {
      setApiKey(storedApiKey);
    }
  }, []);

  async function analyzeConversations(cs) {
    if (!apiKey) {
      setAnomalies([]);
      return;
    }

    const anomalyPromises = cs.map((conversation) => detectAnomaly(conversation, apiKey));
    const results = await Promise.all(anomalyPromises);
    setAnomalies(results);
  }

  // useEffect(() => {
  //   if (conversations.length > 0) {
  //     analyzeConversations();
  //   }
  // }, [conversations]);

  const handleConvert = () => {
    const pages = splitLongArticle(longArticle, taskPrompt, tokenLimit);
    setConversations(pages);
    if (pages.length > 0) {
      analyzeConversations(pages)
    }
  };

  return (
    <div className="container">
      <h1>ChatGPT Long Article Tool</h1>
      <div class="summary-textbox">
        <p>
          This website is designed to assist users in inputting long articles into ChatGPT by breaking them into smaller, manageable conversations. Users can input their task prompt and article, configure the maximum tokens per conversation, and the tool will generate a series of formatted text boxes ready for use with ChatGPT. This makes it easy to work with longer articles without exceeding the token limitations.
        </p>
      </div>
      <label>
        Task Prompt:
        <input
          type="text"
          placeholder="Summarize the article for me."
          value={taskPrompt}
          onChange={(e) => setTaskPrompt(e.target.value)}
        />
      </label>
      <br />
      <label>
        OpenAI API Key to detect text anomaly (optional):
        <input
          type="text"
          placeholder="OpenAI API Key"
          value={apiKey}
          onChange={(e) => { setApiKey(e.target.value); localStorage.setItem("openaiApiKey", e.target.value); }}
        />
        <br />
      </label>
      <label>
        Long Article:
        <textarea
          rows="10"
          cols="50"
          value={longArticle}
          onChange={(e) => setLongArticle(e.target.value)}
        />
      </label>
      <br />
      <label>
        Token Limit:
        <input
          type="number"
          min="1000"
          max="40000"
          value={tokenLimit}
          onChange={(e) => setTokenLimit(e.target.value)}
        />
      </label>
      <br />
      <button onClick={handleConvert}>Convert</button>
      <div>
        {conversations.map((conversation, index) => (
          <div key={index}>
            <h3>Conversation {index + 1}</h3>
            <textarea rows="10" cols="50" value={conversation} onChange={(e) => {
              const updatedConversations = [...conversations];
              updatedConversations[index] = e.target.value;
              setConversations(updatedConversations);
            }} />
            <button
              onClick={() => {
                const hiddenTextArea = document.createElement('textarea');
                hiddenTextArea.value = conversation;
                document.body.appendChild(hiddenTextArea);
                hiddenTextArea.select();
                document.execCommand('copy');
                document.body.removeChild(hiddenTextArea);
              }}
            >
              Copy
            </button>
            {anomalies[index] && anomalies !== "" && (
              <span className="warning">Warning: Anomalies detected in the text.</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;