const express = require('express');
const { Client } = require('@line/bot-sdk');
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://pmpeayala:E7fsXIt4yPCKl1Pl@s3madpm01.hltgsm5.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const mongoClient = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
    // useUnifiedTopology: true
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await mongoClient.connect();
    // Send a ping to confirm a successful connection
    await mongoClient.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await mongoClient.close();
  }
}
run().catch(console.dir);

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

async function handleEvent(event) {
  if (event.type === 'message' && event.message.type === 'text') {
    const userId = req.body.event.source.userId;
    const messageText = req.body.event.message.text;

    const newMessage = new Message({
      userId: userId,
      messageText: messageText,
      timestamp: new Date()
    });
  
    try {
      await newMessage.save();
      console.log('Message saved to MongoDB');
    } catch (error) {
      console.error('Error saving message:', error);
    }
  
    return client.replyMessage(event.replyToken, "ได้เก็บข้อความของคุณไว้ใน Mongo DB แล้ว");
  }
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
