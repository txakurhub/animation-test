const canvasSketch = require("canvas-sketch");

const settings = {
  dimensions: [1080, 1080],
};
const particles = [];

const sketch = ({ width, height }) => {
  let x, y, particle;

  for (let i = 0; i < 1; i++) {
    x = width * 0.5;
    y = height * 0.5;

    particle = new Particle({ x, y });
    particles.push(particle);
  }
  return ({ context, width, height }) => {
    context.fillStyle = "black";
    context.fillRect(0, 0, width, height);

    particles.forEach((p) => {
      p.draw(context);
    });
  };
};

canvasSketch(sketch, settings);

class Particle {
  constructor({ x, y, radius = 10 }) {
    // position
    this.x = x;
    this.y = y;

    // acceleration
    this.ax = 0;
    this.ay = 0;

    //  velocity
    this.vx = 0;
    this.vy = 0;

    // initial position
    this.ix = x;
    this.iy = y;

    this.radius = radius;
  }

  draw(context) {
    context.save();
    context.translate(this.x, this.y);
    context.fillStyle = "gray";

    context.beginPath();
    context.arc(0, 0, this.radius, 0, Math.PI * 2);
    context.fill();

    context.restore();
  }
}
