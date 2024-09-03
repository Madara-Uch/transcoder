const ffmpeg = require("fluent-ffmpeg");
const [fileName, inputDir] = process.argv.slice(2);

const RESOLUTIONS = [
  { name: "360p", width: 480, height: 360 },
  { name: "480p", width: 858, height: 480 },
  { name: "720p", width: 1280, height: 720 },
];

const promises = RESOLUTIONS.map((reolution) => {
  const output = `/usr/src/app/outputs/${fileName}-${reolution.name}.mp4`;
  return new Promise((res, rej) => {
    ffmpeg(`${inputDir}/${fileName}`)
      .output(output)
      .withVideoCodec("libx264")
      .withAudioCodec("aac")
      .withSize(`${reolution.width}x${reolution.height}`)
      .on("end", () => {
        res();
      })
      .format("mp4")
      .run();
  });
});
