const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const mongoose = require("mongoose");
const crypto = require("crypto");
const Message = require("./models/message");
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const db = require('./dbConnection');
console.log('path', path.join(__dirname, "./views"));

app.set("views", path.join(__dirname, "./views"));
app.set('view engine', 'ejs');

app.get('/', async function(req, res) {
    try {
        let response = await Message.find();
         res.render('./index', {response: response});
    } catch(err){
        console.log('err',err);
        return res.json({status: 400, message: 'failed', error: err.message});
    }
});


io.on("connection", (socket) => {
  console.log("Client connected");

  socket.on("data", (encryptedMessages) => {
    decryptAndSaveMessages(encryptedMessages);
  });
});

async function decryptAndSaveMessages(encryptedMessages) {
  
  for (const encryptedMessage of encryptedMessages) {
    // Validate data integrity using secret_key
    let obj = {
      name: encryptedMessage.name,
      origin: encryptedMessage.origin,
      destination: encryptedMessage.destination,
    };
    const secretKey = crypto
      .createHash("sha256")
      .update(JSON.stringify(obj))
      .digest("hex");
    if (secretKey != encryptedMessage.secret_key) {
        console.log("Data integrity compromised. Discarding message.");
      continue;
    }

    // Decrypt payload
    const decryptedMessage = decryptPayload(
      encryptedMessage.encrypted_message,
      secretKey
    );

    // Add a timestamp
    const timestamp = new Date();

    // Save to MongoDB
    const message = new Message({
      ...JSON.parse(decryptedMessage),
      timestamp,
    });

    try {
      await message.save();
    } catch (err) {
      console.error("Error saving message:", err);
    }
  }
}

function decryptPayload(encryptedPayload, secretKey) {
  // Implement decryption logic here (e.g., aes-256-ctr)

  // Encrypted message received
  const encryptedMessage = encryptedPayload; // Replace with the encrypted message

  
  const parts = encryptedMessage.split("|");
  const iv = Buffer.from(parts[0], "hex");
  const encryptedData = parts[1];

  const decryptionKey = Buffer.from(secretKey, "hex").slice(0, 32); // Use the first 32 bytes (256 bits) of the secret key
  const decipher = crypto.createDecipheriv("aes-256-ctr", decryptionKey, iv);

  // Step 2: Decrypt the message
  let decryptedMessage = decipher.update(encryptedData, "hex", "utf8");
  decryptedMessage += decipher.final("utf8");

  //   console.log("Decrypted Message:", decryptedMessage);

  return decryptedMessage;
}

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Listener service is running on port ${PORT}`);
});
