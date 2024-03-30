const express = require("express");
const bodyParser = require("body-parser");
const { handleMessage } = require("./whatsapp-bot");
const { connectMongoDB } = require("./database");
const config = require("./config");

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));

app.post("/webhook", async (req, res) => {
  const messageBody = req.body.Body;
  const fromNumber = req.body.From;
  const toNumber = req.body.To;

  handleMessage(messageBody, fromNumber, toNumber);

  try {
    const db = await connectMongoDB();
    const messagesCollection = db.collection("messages");
    const result = await messagesCollection.insertOne({
      from: fromNumber,
      message: messageBody,
    });
    
    return res.send({
      status_code: 200,
      msg: `You Sent message from ${fromNumber}`,
      data: result,
    });
  } catch (err) {
    console.error("Error storing message in MongoDB:", err);
    return res.send({
      status_code: 500,
      msg: "Internal server error",
    });
  }

  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
