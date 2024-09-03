const { Queue } = require("bullmq");
const IORedis = require("ioredis");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: ".env" });
const connection = new IORedis(
  `redis://${process.env.REDIS_HOSTNAME}:${process.env.REDIS_PORT}`,
  {
    maxRetriesPerRequest: null,
  }
);

const tanscode_queue = new Queue("transcode", { connection });

const handleAddToQueue = async (filePath, fileName) => {
  const result = await tanscode_queue.add("New file emerged to transcode.", {
    path: filePath,
    fileName: fileName,
  });

  console.log("Job added to Queue: ", result.id);
};


module.exports = {
  handleAddToQueue,
};
