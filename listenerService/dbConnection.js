const mongoose = require("mongoose");

const db = mongoose.connect("mongodb://127.0.0.1:27017/timeSeries", {
   useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("Database connected!"))
.catch(err => console.log(err));
   
module.exports = db;