const twilio = require("twilio");
const config = require("./config");

const { accountSid, authToken } = config.twilio;
const twilioClient = twilio(accountSid, authToken);

function handleMessage(messageBody, fromNumber, toNumber) {
  
  const response = `You Sent: ${messageBody}`;

  twilioClient.messages
    .create({
      body: response,
      from: fromNumber,
      to: toNumber,
    })
    .then((message) => console.log("Response sent:", message.sid))
    .catch((err) => console.error("Error sending response:", err));
    return response;
}

module.exports = { handleMessage };
