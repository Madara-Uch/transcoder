const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const AddFile = require('./routes/addFile')
const chokidar = require("chokidar");
const { handleAddToQueue } = require("./producer");
const path = require('path')
dotenv.config({ path: ".env" });

const app = express();

const inputDir = path.resolve(__dirname, "./inputs");
const watcher = chokidar.watch(inputDir, {
  persistent: true,
  ignoreInitial: true,
});

watcher.on("add", (filePath) => {
  const fileName = filePath.split("\\").pop();

  handleAddToQueue(inputDir, fileName)
  .then((result) => {
    console.log(`Job added to Queue with ID: ${result}`);
  })
  .catch((error) => {
    console.error(`Error adding job to queue: ${error.message}`);
  });
});


app.use(bodyParser.json())
app.use('/addFile',AddFile)

app.listen(process.env.PORT, () => {
  console.log("Server is listening at port: ", process.env.PORT);
});
