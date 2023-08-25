const express = require('express');
const { Client } = require('@line/bot-sdk');

const config = {
  channelAccessToken: 'YOUR_CHANNEL_ACCESS_TOKEN',
  channelSecret: 'YOUR_CHANNEL_SECRET',
};

const client = new Client(config);
const app = express();
const port = 3000;

app.use(express.json());

app.post('/webhook', (req, res) => {
  Promise.all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error('Error processing events:', err);
      res.status(500).end();
    });
});

function handleEvent(event) {
  if (event.type === 'message' && event.message.type === 'text') {
    const message = { type: 'text', text: 'Hello, you said: ' + event.message.text };
    return client.replyMessage(event.replyToken, message);
  }
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
