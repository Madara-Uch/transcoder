const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const { handleAddToQueue } = require("../producer");

const inputDir = path.resolve(__dirname, "../inputs");

function getLatestFile(dir) {
  const files = fs.readdirSync(dir);
  if (files.length === 0) {
    throw new Error("No files found in the directory.");
  }

  const fileStats = files.map((file) => {
    const filePath = path.join(dir, file);
    return {
      file,
      mtime: fs.statSync(filePath).mtime,
      filePath,
    };
  });

  fileStats.sort((a, b) => b.mtime - a.mtime);

  return fileStats[0];
}

router.get("/", async (req, res) => {
  try {
    const latestFile = getLatestFile(inputDir);
    console.log(`Processing latest file: ${latestFile.file}`);

    const result = await handleAddToQueue(latestFile.filePath, latestFile.file);
    res.status(200).send(`Job added to Queue with ID: ${result}`);
  } catch (error) {
    res.status(500).send(`Error adding job to queue: ${error.message}`);
  }
});

module.exports = router;
