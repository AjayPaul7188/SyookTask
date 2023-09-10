### encrypted-timeseries

### How to run emitterService

Step 1: Go to SyookTask\emitterService\emitter.js in terminal
Step 2: Do npm install
Step 3: Now run the command "npm start", then emitter service will get start and emits the messages.

## How to run listenerService

Note: Open another terminal
Step 1: Go to SyookTask\listenerService\listener.js in terminal
Step 2: Do npm install
Step 3: Now run the command "npm start", then listener service will get start and saves the messages in moongodb.

Note: Mongodb atlas setup is required. The name of the database is "timeSeries".

To see the result in UI open the link "http://localhost:3000/"

