const docker = require("dockerode")();
const pathM = require("path");

async function handleDockerContainer(path, fileName, dockerFileContext) {
  try {
    const tarStream = await docker.buildImage(
      {
        context: dockerFileContext,
        src: [
          "Dockerfile",
          "convert.js",
          "package.json",
          "package-lock.json",
          "../inputs",
          "../outputs",
        ],
      },
      {
        t: "my-transcode-image:latest",
      }
    );

    await new Promise((resolve, reject) => {
      docker.modem.followProgress(tarStream, (err, res) =>
        err ? reject(err) : resolve(res)
      );
    });

    console.log("Docker image built successfully");

    const inputDir = pathM.resolve(__dirname, "../inputs");
    const outputDir = pathM.resolve(__dirname, "../outputs");

    const containerOptions = {
      Image: "my-transcode-image:latest",
      Cmd: ["node", "convert.js", fileName, "/usr/src/app/inputs"],
      Volumes: {
        "/usr/src/app/inputs": {},
        "/usr/src/app/outputs": {},
      },
      HostConfig: {
        Binds: [
          `${inputDir}:/usr/src/app/inputs`,
          `${outputDir}:/usr/src/app/outputs`,
        ],
      },
    };

    const container = await docker.createContainer(containerOptions);
    console.log("Container created:", container.id);

    await container.start();
    console.log("Container started");

    const stream = await container.wait();
    console.log("Container finished with exit code:", stream.StatusCode);

    await container.remove();
    console.log("Container removed");
  } catch (error) {
    console.error("Error handling Docker container:", error);
  }
}

module.exports = handleDockerContainer;
