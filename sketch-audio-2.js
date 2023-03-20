const canvasSketch = require("canvas-sketch");
const math = require("canvas-sketch-util/math");
const random = require("canvas-sketch-util/random");
const eases = require("eases");
const risoColors = require("riso-colors");
const Color = require("canvas-sketch-util/color");
const colormap = require("colormap");

const settings = {
  dimensions: [1080, 1080],
  animate: true,
};
let audio, audioContext, audioData, sourceNode, analyserNode;
let manager, minDb, maxDb;

const sketch = ({ context, width, height }) => {
  const numCircles = 22;
  const numSlices = 5;
  const slice = (Math.PI * 2) / numSlices;
  const radius = 10;

  const bins = [];
  const lineWidths = [];
  const rotationOffsets = [];

  let lineWidth, bin, mapped, phi;
  let amplitude = 9;

  const colors = colormap({
    colormap: "electric",
    nshades: amplitude,
  });

  const rectColors = [random.pick(risoColors), random.pick(risoColors)];
  const bgColor = colors[Math.floor(random.range(1, 9))]; //random.pick(rectColors).hex;

  console.log(colors);
  console.log(bgColor);
  const mask = {
    radius: width * 0.5,
    sides: 120,
    x: width * 0.5,
    y: height * 0.58,
  };

  for (let i = 0; i < numCircles * numSlices; i++) {
    bin = random.rangeFloor(4, 128);
    bins.push(bin);
  }

  for (let i = 0; i < numCircles; i++) {
    const t = i / (numCircles - 1);
    lineWidth = eases.quadIn(t) * 200 + 10;
    lineWidths.push(lineWidth);
  }

  for (let i = 0; i < numCircles; i++) {
    rotationOffsets.push(
      random.range(Math.PI * -0.25, Math.PI * 0.5) - Math.PI * 0.25
    );
  }

  return ({ context, width, height }) => {
    context.fillStyle = bgColor;
    context.fillRect(0, 0, width, height);

    if (!audioContext) return;
    analyserNode.getFloatFrequencyData(audioData);

    context.save();
    context.translate(width * 0.5, height * 0.5);

    // drawPoligon({ context, radius: mask.radius, sides: mask.sides });

    context.scale(2, -11);

    // context.clip();

    let cradius = radius;
    fill = colors[Math.floor(random.range(1, 9))];
    stroke = colors[Math.floor(random.range(1, 9))];

    for (let i = 0; i < numCircles; i++) {
      context.save();

      context.rotate(rotationOffsets[i]);

      cradius += lineWidths[i] * 0.5 + 2;
      for (let j = 0; j < numSlices; j++) {
        context.rotate(slice);
        context.lineWidth = lineWidths[i];

        bin = bins[i * numSlices + j];

        mapped = math.mapRange(audioData[bin], minDb, maxDb, 0, 1, true);

        phi = slice * mapped;

        context.beginPath();
        context.arc(0, 0, cradius, 0, phi);
        context.strokeStyle = stroke;

        context.fillStyle = colors[Math.floor(random.range(1, 9))];
        context.stroke();
      }
      cradius += lineWidths[i] * 0.5;

      context.restore();
    }
    context.restore();

    // polygon outline
    // context.save();
    // context.translate(width * 0.5, height * 0.6);
    // context.lineWidth = 20;

    // drawPoligon({
    //   context,
    //   radius: mask.radius,
    //   sides: mask.sides,
    // });

    // context.globalCompositeOperation = "color-burn";
    // context.strokeStyle = colors[Math.floor(random.range(1, 9))];
    // context.stroke();

    // context.restore();
  };
};

const addListeners = () => {
  window.addEventListener("mouseup", () => {
    if (!audioContext) createAudio();

    if (audio.paused) {
      audio.play();
      manager.play();
    } else {
      audio.pause();
      manager.pause();
    }
  });
};

const createAudio = () => {
  audio = document.createElement("audio");
  audio.src = "src/assets/piruetatbnmidi.mp3";

  audioContext = new AudioContext();

  sourceNode = audioContext.createMediaElementSource(audio);
  sourceNode.connect(audioContext.destination);

  analyserNode = audioContext.createAnalyser();
  analyserNode.fftSize = 512;
  analyserNode.smoothingTimeConstant = 0.9;
  sourceNode.connect(analyserNode);

  minDb = analyserNode.minDecibels;
  maxDb = analyserNode.maxDecibels;

  audioData = new Float32Array(analyserNode.frequencyBinCount);

  // console.log(audioData.length);
};

const getAverage = (data) => {
  let sum = 0;

  for (let i = 0; i < data.length; i++) {
    sum += data[i];
  }
  return sum / data.length;
};
const start = async () => {
  addListeners();
  manager = await canvasSketch(sketch, settings);
  manager.pause;
};
start();

const drawPoligon = ({ context, radius = 300, sides = 3 }) => {
  const slice = (Math.PI * 2) / sides;

  context.beginPath();
  context.moveTo(0, -radius);

  for (let i = 1; i < sides; i++) {
    const theta = i * slice - Math.PI * 0.5;
    context.lineTo(Math.cos(theta) * radius, Math.sin(theta) * radius);
  }
  context.closePath();
};
