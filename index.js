const express = require('express');
const { Client } = require('@line/bot-sdk');

const config = {
  channelAccessToken: 'X93vYR6Ih/TaR+6Y9ypAjCClXqQwcKi4T83MVT+wGfbMQB+Nbq1/3YoNEXveeYLEMeUnGf1gc0nCp08TzKiM8sr7t7BTPozmNLXERfS0eBSGQl599aoWN7yeHXOA8wY5yhZ9eeujmp1yCyrwotKW6AdB04t89/1O/w1cDnyilFU=',
  channelSecret: '31ab8dfa3c994419c6edb35fc65a7a68',
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
