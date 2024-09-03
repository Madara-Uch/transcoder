const { Worker } = require("bullmq");
const IORedis = require("ioredis");
const dotenv = require("dotenv");
dotenv.config({ path: ".env" });
const handleDockerContainer = require('./Worker_node(Docker)/worker')
const connection = new IORedis(
  `redis://${process.env.REDIS_HOSTNAME}:${process.env.REDIS_PORT}`,
  {
    maxRetriesPerRequest: null,
  }
);

const worker = new Worker(
  "transcode",
  async (job) => {
    console.log(`Message Recieved id: ${job.id}`);
    console.log("Processing Message");
    console.log(`Path is ${job.data.path}`);
    console.log(`Path is ${job.data.fileName}`);
    const dockerFileContext = "./Worker_node(Docker)/";
    handleDockerContainer(job.data.path, job.data.fileName,dockerFileContext);
  },
  { connection }
);
