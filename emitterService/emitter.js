const socket = require("socket.io-client")("http://localhost:3000");
const crypto = require("crypto");
const data = require("./data.json");

console.log('emitter js');

function generateRandomInt(min, max) { // getting random elements
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRandomMessage() {
  const name = data.names[generateRandomInt(0, data.names.length - 1)];
  const origin = data.cities[generateRandomInt(0, data.cities.length - 1)];
  const destination = data.cities[generateRandomInt(0, data.cities.length - 1)];

  const originalMessage = {
    name,
    origin,
    destination,
  };
 // creating secret key using sha-256 
  const secretKey = crypto
    .createHash("sha256")
    .update(JSON.stringify(originalMessage))
    .digest("hex");

  const encryptedMessage = encryptPayload(originalMessage, secretKey);

  return {
    ...originalMessage,
    secret_key: secretKey,
    encrypted_message: encryptedMessage,
  };
}

function encryptPayload(originalMessage, secretKey) {
  const encryptionKey = Buffer.from(secretKey, "hex").slice(0, 32);
  const randomValue = crypto.randomBytes(16); // Generate a random initialization vector
  const cipher = crypto.createCipheriv("aes-256-ctr", encryptionKey, randomValue);
  // Encrypt the message
  let encryptedMessage = cipher.update(
    JSON.stringify(originalMessage),
    "utf8",
    "hex"
  );
  encryptedMessage += cipher.final("hex");
  encryptedMessage = randomValue.toString("hex") + "|" + encryptedMessage;

  return encryptedMessage;
}

function emitData() {
  const messageCount = generateRandomInt(49, 499);
  const messages = [];

  for (let i = 0; i < messageCount; i++) {
    messages.push(generateRandomMessage());
  }

  socket.emit("data", messages); // emit the messages 
}

setInterval(emitData, 10000);
