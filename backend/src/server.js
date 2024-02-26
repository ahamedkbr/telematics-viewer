require("dotenv").config();

const http = require("http");
const app = require("./app");
const mongoose = require("mongoose");

const server = http.createServer(app);

mongoose.connect(process.env.MONGO_DB_URI).then(() => {
  console.log("DB connected");
}).catch((e) => {
  console.error("Error in MongoDB", e);
});


server.listen(process.env.PORT, () => {
  console.log("Server is running");
});