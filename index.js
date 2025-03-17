const express = require("express");

const app = express();
const PORT = 5000;

//database connection
const { connectMongoDB } = require("./connection");
const MONGO_URL = "mongodb://127.0.0.1:27017/medicine-tracker";
connectMongoDB(MONGO_URL)
  .then(() => {
    console.log("Mongo DB connected...");
  })
  .catch((err) => {
    console.log(err);
  });

//middleware
app.use(express.json());

//Routes
app.get("/", (req, res) => {
  res.send("Server is running!");
});

//Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
